import { useState, useEffect } from "react";
import { X, Activity } from "lucide-react";
import { adminService } from "../services/admin.service";

export default function AuditLogDetailModal({ logId, onClose }) {
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await adminService.getAuditLogDetail(logId);
                setLog(res.data.data.log);
            } catch (err) {
                setError(err.response?.data?.error?.message || "Failed to load details");
            } finally {
                setLoading(false);
            }
        };

        if (logId) {
            fetchDetails();
        }
    }, [logId]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
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

    const formatValue = (val) => {
        if (val === null || val === undefined || val === "") return "Not set";
        if (val === true) return "Yes";
        if (val === false) return "No";
        return String(val);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">
                            System Event Details
                        </p>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" />
                            {log?.logCode || "Loading..."}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {error && (
                        <div className="text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="py-8 text-center text-gray-500 text-sm">
                            Fetching log details...
                        </div>
                    ) : log ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">Action</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getActionColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">Timestamp</h3>
                                    <span className="font-medium text-gray-900 text-sm">{formatDate(log.createdAt)}</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">Entity Type</h3>
                                    <span className="font-medium text-gray-900 text-sm capitalize">{log.entityType?.replace("_", " ") || "Unknown"}</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">Actor</h3>
                                    <span className="font-medium text-gray-900 text-sm">{log.actorName} ({log.actorRole})</span>
                                </div>
                            </div>

                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase mb-3 border-b border-gray-100 pb-2">
                                        Metadata / Changes
                                    </h3>
                                    
                                    {log.metadata.changes && log.metadata.changes.length > 0 ? (
                                        <div className="space-y-4">
                                            {log.metadata.changes.map((change, idx) => (
                                                <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
                                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium text-gray-700 capitalize">
                                                        Field: {change.field.replace(/([A-Z])/g, ' $1').trim()}
                                                    </div>
                                                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                                                        <div className="p-3">
                                                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Before</div>
                                                            <div className="text-gray-900 break-words font-mono text-xs bg-red-50 p-2 rounded border border-red-100">
                                                                {formatValue(change.before)}
                                                            </div>
                                                        </div>
                                                        <div className="p-3">
                                                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">After</div>
                                                            <div className="text-gray-900 break-words font-mono text-xs bg-emerald-50 p-2 rounded border border-emerald-100">
                                                                {formatValue(change.after)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                                            <pre className="text-emerald-400 font-mono text-xs">
                                                {JSON.stringify(log.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
