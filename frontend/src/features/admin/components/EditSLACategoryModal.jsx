import { useState, useEffect } from "react";
import { X, Calendar, User } from "lucide-react";
import { adminService } from "../services/admin.service";

export default function EditSLACategoryModal({ category, onClose, onUpdated }) {
    const [formData, setFormData] = useState({
        slaDurationDays: category?.slaDurationDays || "",
        description: category?.description || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await adminService.updateSlaCategory(category.id, {
                slaDurationDays: Number(formData.slaDurationDays),
                description: formData.description,
            });
            onUpdated();
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to update SLA category");
        } finally {
            setLoading(false);
        }
    };

    if (!category) return null;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">
                            Edit SLA Configuration
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">
                    {error && (
                        <div className="text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
                            Current Configuration
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Category</span>
                                <span className="font-medium text-gray-900">{category.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Department</span>
                                <span className="font-medium text-gray-900">{category.department?.name || "N/A"}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Current SLA</span>
                                <span className="font-medium text-gray-900">{category.slaDurationDays} Days</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Description</h4>
                            <p className="text-sm text-gray-700">{category.description || "No description provided."}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
                            Update Configuration
                        </h3>
                        <form id="edit-sla-form" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SLA Duration (Days)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.slaDurationDays}
                                    onChange={(e) => setFormData({ ...formData, slaDurationDays: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>Last Updated: {formatDate(category.updatedAt || category.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span>Updated By: Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                    <button
                        form="edit-sla-form"
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
