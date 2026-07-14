import { useState } from "react";
import { X, Key, Power } from "lucide-react";
import { adminService } from "../services/admin.service";

export default function ViewDepartmentModal({ department, onClose, onUpdate }) {
    const [isResetting, setIsResetting] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await adminService.resetDepartmentPassword(department.id, newPassword);
            setIsResetting(false);
            setNewPassword("");
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.msg || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            await adminService.updateDepartmentStatus(department.id);
            onUpdate();
        } catch (err) {
            setError(err.response?.data?.error?.message || "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
                onClick={onClose}
            ></div>
            
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Department Details
                        </p>
                        <h2 className="text-xl font-bold text-gray-900">
                            {department.name}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">Status</span>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                department.isActive 
                                    ? "bg-green-50 text-green-700" 
                                    : "bg-gray-100 text-gray-600"
                            }`}>
                                {department.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">Official Email</span>
                            <span className="text-gray-900 font-medium text-sm">{department.email}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">Category</span>
                            <span className="text-gray-900 font-medium text-sm">{department.category}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">Created Date</span>
                            <span className="text-gray-900 font-medium text-sm">{formatDate(department.createdAt)}</span>
                        </div>
                    </div>

                    {isResetting && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                            <h4 className="font-semibold text-gray-900 text-sm mb-3">Reset Password</h4>
                            <form onSubmit={handleResetPassword} className="space-y-3">
                                <div>
                                    <input 
                                        type="text" 
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsResetting(false);
                                            setNewPassword("");
                                        }}
                                        className="flex-1 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={loading || !newPassword}
                                        className="flex-1 py-2 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 disabled:opacity-50 cursor-pointer  "
                                    >
                                        {loading ? "Saving..." : "Save Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                    {!isResetting && (
                        <button 
                            onClick={() => setIsResetting(true)}
                            className="w-full py-3 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <Key className="w-4 h-4" />
                            Reset Password
                        </button>
                    )}
                    
                    <button 
                        onClick={handleToggleStatus}
                        disabled={loading}
                        className={`w-full py-3 flex items-center justify-center gap-2 text-sm font-medium border rounded-xl transition-colors disabled:opacity-50 cursor-pointer ${
                            department.isActive
                                ? "text-red-600 bg-red-50 border-red-100 hover:bg-red-100"
                                : "text-green-600 bg-green-50 border-green-100 hover:bg-green-100"
                        }`}
                    >
                        <Power className="w-4 h-4" />
                        {department.isActive ? "Deactivate Department" : "Activate Department"}
                    </button>
                </div>
            </div>
        </div>
    );
}
