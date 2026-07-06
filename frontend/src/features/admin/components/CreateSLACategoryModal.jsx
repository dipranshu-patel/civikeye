import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { adminService } from "../services/admin.service";

export default function CreateSLACategoryModal({ onClose, onCreated }) {
    const [formData, setFormData] = useState({
        name: "",
        departmentId: "",
        slaDurationDays: "",
        description: "",
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const res = await adminService.getDepartments();
            setDepartments(res.data.data.departments || []);
        } catch (err) {
            console.error("Failed to load departments", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await adminService.createSlaCategory(formData);
            onCreated();
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to create SLA category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add SLA Category</h2>
                        <p className="text-sm text-gray-500 mt-1">Define a new complaint category with resolution timeline</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-6 text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form id="create-sla-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Pothole"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department
                                </label>
                                <select
                                    required
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white"
                                >
                                    <option value="" disabled>Select department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SLA Duration (Days)
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="e.g. 7"
                                value={formData.slaDurationDays}
                                onChange={(e) => setFormData({ ...formData, slaDurationDays: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                placeholder="Brief description of this category's SLA requirements"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                            ></textarea>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="create-sla-form"
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? "Adding..." : "Add Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}
