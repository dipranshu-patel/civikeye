import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    AlertCircle,
    Building2,
    CheckCircle,
    Clock,
    FileText,
    Settings,
    ShieldAlert,
    TrendingUp,
    Users,
    ClipboardList,
} from "lucide-react";
import { adminService } from "../services/admin.service";

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await adminService.getDashboard();
                setData(res.data.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load admin dashboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-sm font-medium">{error}</div>;
    }

    const { summaryCards, recentActivity, systemSnapshot } = data;

    const getActivityIcon = (type) => {
        if (type?.toLowerCase().includes("department"))
            return <Building2 className="w-5 h-5 text-blue-500" />;
        if (type?.toLowerCase().includes("sla"))
            return <Clock className="w-5 h-5 text-purple-500" />;
        if (
            type?.toLowerCase().includes("user") ||
            type?.toLowerCase().includes("account")
        )
            return <Users className="w-5 h-5 text-emerald-500" />;
        if (
            type?.toLowerCase().includes("spam") ||
            type?.toLowerCase().includes("delete")
        )
            return <ShieldAlert className="w-5 h-5 text-red-500" />;
        return <Activity className="w-5 h-5 text-gray-500" />;
    };

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto min-h-[60vh]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Monitor platform operations and administrative activity.
                    </h2>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-gray-900">
                        {formatDate(new Date())}
                    </p>
                    <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mt-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Platform Status: Operational
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium text-sm mb-1 whitespace-nowrap">
                            TOTAL COMPLAINTS
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summaryCards.totalComplaints?.toLocaleString() ||
                                    0}
                            </h3>
                        </div>
                        <p className="text-blue-200 text-xs mt-1">
                            across all wards
                        </p>
                    </div>
                    <ClipboardList className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-purple-100 font-medium text-sm mb-1 whitespace-nowrap">
                            AUTHORITY COMPLAINTS
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summaryCards.authorityComplaints?.toLocaleString() ||
                                    0}
                            </h3>
                        </div>
                        <p className="text-purple-200 text-xs mt-1">
                            department-routed
                        </p>
                    </div>
                    <Building2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium text-sm mb-1 whitespace-nowrap">
                            VOLUNTEER COMPLAINTS
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summaryCards.volunteerComplaints?.toLocaleString() ||
                                    0}
                            </h3>
                        </div>
                        <p className="text-emerald-200 text-xs mt-1">
                            community-fixable
                        </p>
                    </div>
                    <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-amber-100 font-medium text-sm mb-1 whitespace-nowrap">
                            DEPARTMENTS
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summaryCards.activeDepartments?.toLocaleString() ||
                                    0}
                            </h3>
                        </div>
                        <p className="text-amber-200 text-xs mt-1">active</p>
                    </div>
                    <Building2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-5 text-white shadow-lg shadow-red-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-rose-100 font-medium text-sm mb-1 whitespace-nowrap">
                            OVERDUE COMPLAINTS
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summaryCards.overdueComplaints?.toLocaleString() ||
                                    0}
                            </h3>
                        </div>
                        <p className="text-rose-200 text-xs mt-1">
                            past SLA deadline
                        </p>
                    </div>
                    <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                    QUICK ACTIONS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link
                        to="/admin/departments"
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">
                                Create Department
                            </h4>
                            <p className="text-sm text-gray-500">
                                Add new civic department
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/departments"
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">
                                Manage Departments
                            </h4>
                            <p className="text-sm text-gray-500">
                                View and edit departments
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/sla-configuration"
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">
                                Configure SLA
                            </h4>
                            <p className="text-sm text-gray-500">
                                Set resolution deadlines
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/audit-logs"
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">
                                View Audit Logs
                            </h4>
                            <p className="text-sm text-gray-500">
                                System activity records
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                            RECENT ACTIVITY
                        </h3>
                        <Link
                            to="/admin/audit-logs"
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {recentActivity?.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="mt-1 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            {getActivityIcon(
                                                activity.entityType,
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold text-gray-900">
                                                    {activity.action}
                                                </p>
                                                <span className="text-sm text-gray-400">
                                                    by {activity.actorName}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {activity.entityName ||
                                                    activity.entityType}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {formatTime(activity.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
