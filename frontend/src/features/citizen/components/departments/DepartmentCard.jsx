import { Building2, ArrowUpRight, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DepartmentCard({ department, onOpenReport }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
            {/* Header */}
            <div className="p-5 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-start">
                <div className="flex gap-4 min-w-0">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
                        <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                                {department.code}
                            </span>
                            <span className="text-[10px] text-gray-300 hidden sm:inline">•</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium truncate">
                                {department.category || "General"}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 break-words">
                            {department.name}
                        </h3>
                    </div>
                </div>

                <div className="flex sm:flex-col items-start sm:items-end justify-center shrink-0">
                    <button
                        onClick={onOpenReport}
                        className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors bg-white px-3 py-1.5 border border-gray-200 rounded-lg shadow-sm hover:border-emerald-200 cursor-pointer"
                    >
                        Open report
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 pt-0">
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Resolution Rate
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {department.resolutionRatePct || 0}%
                    </div>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        Avg Response
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {department.avgResolutionDays
                            ? `${department.avgResolutionDays}d`
                            : "N/A"}
                    </div>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Overdue
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {department.overdueRatePct || 0}%
                    </div>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                        <ShieldCheck className="w-3 h-3 text-indigo-500" />
                        Verified
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {department.verifiedPct || 0}%
                    </div>
                </div>
            </div>
        </div>
    );
}
