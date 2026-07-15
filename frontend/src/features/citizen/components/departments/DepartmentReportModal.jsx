import { useState, useEffect } from "react";
import {
    X,
    Building2,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ShieldCheck,
} from "lucide-react";
import { departmentService } from "../../services/departments.service";

export default function DepartmentReportModal({ isOpen, onClose, department }) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && department) {
            const fetchComplaints = async () => {
                setLoading(true);
                try {
                    const data = await departmentService.getRecentComplaints(
                        department.id,
                    );
                    setComplaints(data);
                } catch (error) {
                    console.error(
                        "Failed to fetch department complaints:",
                        error,
                    );
                } finally {
                    setLoading(false);
                }
            };
            fetchComplaints();
        }
    }, [isOpen, department]);

    if (!isOpen || !department) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "resolved":
                return "text-emerald-700 bg-emerald-50 border-emerald-200";
            case "reported":
                return "text-blue-700 bg-blue-50 border-blue-200";
            case "in_progress":
                return "text-indigo-700 bg-indigo-50 border-indigo-200";
            case "overdue":
                return "text-red-700 bg-red-50 border-red-200";
            case "reopened":
                return "text-amber-700 bg-amber-50 border-amber-200";
            default:
                return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm flex-shrink-0">
                            <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded-full bg-gray-200/50 text-[10px] font-mono text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    {department.code}
                                </span>
                                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate">
                                    {department.category || "General"}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                {department.name}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {department.description}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                        Performance Summary
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 uppercase tracking-wider font-bold mb-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Resolution
                            </div>
                            <div className="text-2xl font-bold text-emerald-900">
                                {department.resolutionRatePct || 0}%
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                            <div className="flex items-center gap-1.5 text-[10px] text-blue-600 uppercase tracking-wider font-bold mb-1">
                                <Clock className="w-3.5 h-3.5" />
                                Avg Response
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                                {department.avgResolutionDays
                                    ? `${department.avgResolutionDays}d`
                                    : "N/A"}
                            </div>
                        </div>
                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                            <div className="flex items-center gap-1.5 text-[10px] text-amber-600 uppercase tracking-wider font-bold mb-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Overdue
                            </div>
                            <div className="text-2xl font-bold text-amber-900">
                                {department.overdueCount || 0}
                            </div>
                        </div>
                        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                            <div className="flex items-center gap-1.5 text-[10px] text-indigo-600 uppercase tracking-wider font-bold mb-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified
                            </div>
                            <div className="text-2xl font-bold text-indigo-900">
                                {department.verifiedPct || 0}%
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Recent Activity
                        </h3>
                        <span className="text-xs text-gray-500 font-medium">
                            {department.totalComplaints} total records
                        </span>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="py-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading recent activity...
                            </div>
                        ) : complaints.length > 0 ? (
                            complaints.map((complaint) => (
                                <div
                                    key={complaint.id}
                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-gray-400">
                                                {complaint.publicCode}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(complaint.status)}`}
                                            >
                                                {complaint.status.replace(
                                                    "_",
                                                    " ",
                                                )}
                                            </span>
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {complaint.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {complaint.categoryName}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col gap-1">
                                        <div className="text-xs text-gray-500">
                                            Reported
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {new Date(
                                                complaint.createdAt,
                                            ).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 px-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-900">
                                    No recent activity
                                </p>
                                <p className="text-xs text-gray-500">
                                    This department has not handled any
                                    complaints yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
