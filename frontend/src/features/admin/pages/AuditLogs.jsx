import { useState, useEffect } from "react";
import { Search, ChevronRight, Activity, Zap, Users, ShieldAlert, FileText, Database } from "lucide-react";
import { adminService } from "../services/admin.service";
import AuditLogDetailModal from "../components/AuditLogDetailModal";

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewingLog, setViewingLog] = useState(null);

    const [page, setPage] = useState(1);
    const [limit] = useState(50);

    useEffect(() => {
        loadData();
    }, [page, searchQuery]);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await adminService.getAuditLogs({ 
                page, 
                limit,
                search: searchQuery || undefined
            });
            setLogs(res.data.data.logs || []);
            setSummary(res.data.data.summaryCards || null);
        } catch (err) {
            console.error("Failed to load audit logs:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getActionColor = (action) => {
        switch (action) {
            case "CREATE": return "text-emerald-700 bg-emerald-50 border-emerald-200";
            case "UPDATE": return "text-blue-700 bg-blue-50 border-blue-200";
            case "DELETE": return "text-red-700 bg-red-50 border-red-200";
            default: return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Audit Logs</h1>
                    <p className="text-gray-500 mt-1">Review administrative actions and system-level configuration changes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium text-sm mb-1 whitespace-nowrap">
                            TOTAL EVENTS
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary?.total?.toLocaleString() || 0}
                            </h3>
                        </div>
                    </div>
                    <Database className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium text-sm mb-1 whitespace-nowrap">
                            TODAY'S ACTIVITY
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary?.todayCount?.toLocaleString() || 0}
                            </h3>
                        </div>
                    </div>
                    <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-amber-100 font-medium text-sm mb-1 whitespace-nowrap">
                            DEPT CHANGES
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary?.deptChanges?.toLocaleString() || 0}
                            </h3>
                        </div>
                    </div>
                    <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-purple-100 font-medium text-sm mb-1 whitespace-nowrap">
                            SLA UPDATES
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary?.slaUpdates?.toLocaleString() || 0}
                            </h3>
                        </div>
                    </div>
                    <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                            Recent Audit Logs
                        </h2>
                    </div>
                    
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    loadData();
                                }
                            }}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date / Time</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event / Action</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500 text-sm">
                                        Loading audit logs...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500 text-sm">
                                        No audit logs found.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setViewingLog(log)}>
                                        <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                                            {formatDate(log.createdAt)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-medium text-gray-900 capitalize">
                                                {log.entityType?.replace("_", " ") || "Unknown"}
                                            </div>
                                            {log.metadata?.entityName && (
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {log.metadata.entityName}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {log.actorName}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5 capitalize">
                                                {log.actorRole}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setViewingLog(log); }}
                                                    className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-1.5 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {viewingLog && (
                <AuditLogDetailModal 
                    logId={viewingLog.id}
                    onClose={() => setViewingLog(null)}
                />
            )}
        </div>
    );
}
