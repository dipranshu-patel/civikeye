import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { adminService } from "../services/admin.service";

export default function CreateDepartmentForm({ onCreated, onCancel }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        category: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const categories = [
        "Roads",
        "Water",
        "Electrical",
        "Sanitation",
        "Public Safety",
        "Infrastructure",
        "Health",
        "Transport",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await adminService.createDepartment(formData);
            onCreated();
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error?.message || "Failed to create department");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6 animate-fade-in">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Create Department</h3>
                <p className="text-sm text-gray-500">Add a new civic department to the platform</p>
            </div>
            
            {error && (
                <p className="mb-6 text-red-500 text-sm font-medium">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Roads Department"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Official Email
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="e.g. roads@city.gov"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category / Scope
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors bg-white flex items-center justify-between text-left h-[42px]"
                        >
                            <span className={formData.category ? "text-black" : "text-gray-400"}>
                                {formData.category || "Select category"}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180 text-black' : ''}`} />
                        </button>
                        
                        {isCategoryOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)}></div>
                                <div className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto py-1">
                                    {categories.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, category: c });
                                                setIsCategoryOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm transition-colors text-gray-700"
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Create Password
                        </label>
                        <input
                            type="text"
                            required
                            minLength={6}
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            placeholder="Brief description of the department's responsibilities"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Creating..." : "Create Department"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
