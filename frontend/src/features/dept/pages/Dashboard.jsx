import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Clock,
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    ChevronRight,
    CheckSquare,
    Edit,
    RefreshCw,
    MapPin,
    TrendingUp,
    Eye,
} from "lucide-react";
import { deptService } from "../services/dept.service";
import { meService } from "../../citizen/services/me.service";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, meRes] = await Promise.all([
                    deptService.getDashboardData(),
                    meService.getProfile(),
                ]);
                setData(dashRes.data.data);
                setProfile(meRes.data.data.user);
            } catch (err) {
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    const { summary, urgentComplaints, recentActivity, performance } = data;

    const getActivityIcon = (type) => {
        if (type?.toLowerCase().includes("assigned"))
            return <CheckSquare className="w-5 h-5 text-blue-500" />;
        if (type?.toLowerCase().includes("proof"))
            return <CheckCircle className="w-5 h-5 text-emerald-500" />;
        if (type?.toLowerCase().includes("verification"))
            return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
        if (type?.toLowerCase().includes("reopened"))
            return <AlertTriangle className="w-5 h-5 text-orange-500" />;
        if (type?.toLowerCase().includes("resolved"))
            return <CheckCircle className="w-5 h-5 text-emerald-500" />;
        return <Edit className="w-5 h-5 text-blue-500" />;
    };

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto min-h-[60vh]">
            {/* Header / Dept Info */}
            <div className="flex items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.department?.name || "Department Dashboard"}
                </h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium text-sm mb-1 whitespace-nowrap">
                            Assigned
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary.assigned || 0}
                            </h3>
                        </div>
                    </div>
                    <CheckSquare className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-indigo-100 font-medium text-sm mb-1 whitespace-nowrap">
                            In Progress
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary.inProgress || 0}
                            </h3>
                        </div>
                    </div>
                    <RefreshCw className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-amber-100 font-medium text-sm mb-1 whitespace-nowrap">
                            Pending Verify
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary.pendingVerification || 0}
                            </h3>
                        </div>
                    </div>
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-5 text-white shadow-lg shadow-red-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-rose-100 font-medium text-sm mb-1 whitespace-nowrap">
                            Overdue
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary.overdue || 0}
                            </h3>
                        </div>
                    </div>
                    <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium text-sm mb-1 whitespace-nowrap">
                            Resolved
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary.resolvedThisMonth || 0}
                            </h3>
                        </div>
                    </div>
                    <CheckCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>
            </div>

            {/* Urgent Attention Required */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-sm font-bold tracking-widest text-gray-900 uppercase">
                        Urgent Attention Required
                    </h2>
                    {summary.overdue > 0 && (
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                            {summary.overdue} overdue
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {urgentComplaints?.length > 0 ? (
                        urgentComplaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                className="bg-white border border-red-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                            {complaint.publicCode}
                                        </span>
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {complaint.category?.name}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                        {Math.abs(complaint.daysUntilSla)}d
                                        overdue
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {complaint.title}
                                </h3>
                                <div className="text-xs text-gray-500 space-y-1 mb-4 flex-1">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {complaint.addressText}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        SLA:{" "}
                                        {new Date(
                                            complaint.slaDeadline,
                                        ).toLocaleString()}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-gray-400" />
                                        {complaint.upvoteCount} upvotes
                                    </p>
                                </div>
                                <Link
                                    to={`/official/complaints?search=${complaint.publicCode}`}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors mt-auto"
                                >
                                    <Eye className="w-4 h-4" /> View Complaint
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white border border-gray-100 rounded-xl p-8 text-center flex flex-col items-center justify-center text-gray-500">
                            <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                            <p>No overdue complaints!</p>
                        </div>
                    )}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <section className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold tracking-widest text-gray-900 uppercase">
                            Recent Activity
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {recentActivity?.length > 0 ? (
                                recentActivity.map((act, i) => (
                                    <div
                                        key={act.id || i}
                                        className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            {getActivityIcon(
                                                act.note || act.to_status,
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {act.note ||
                                                    `Status changed to ${act.to_status?.replace("_", " ")}`}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                                {act.public_code} • {act.title}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0 text-xs text-gray-500 font-medium">
                                            {new Date(
                                                act.created_at,
                                            ).toLocaleString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    No recent activity.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="space-y-8">
                    {/* Quick Actions */}
                    <section>
                        <h2 className="text-sm font-bold tracking-widest text-gray-900 uppercase mb-4">
                            Quick Actions
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-50">
                                <Link
                                    to="/official/complaints?tab=assigned"
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                                        View Assigned Complaints
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {summary.assigned}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </Link>
                                <Link
                                    to="/official/complaints?tab=in_progress"
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                                        View In Progress
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {summary.inProgress}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </Link>
                                <Link
                                    to="/official/complaints?tab=pending_verification"
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                                        View Pending Verification
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {summary.pendingVerification}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </Link>
                                <Link
                                    to="/official/complaints?tab=reopened"
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                                        View Reopened Issues
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            {summary.reopened}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Department Performance */}
                    <section>
                        <h2 className="text-sm font-bold tracking-widest text-gray-900 uppercase mb-4">
                            Department Performance
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">
                                    Resolution Rate
                                </span>
                                <span className="text-sm font-bold text-emerald-600">
                                    {performance?.resolutionRate || 0}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">
                                    Avg Response Time
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                    {performance?.avgResolutionDays || 0} days
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">
                                    SLA Target
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                    {performance?.slaTargetDays || 3} days
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">
                                    Overdue Rate
                                </span>
                                <span className="text-sm font-bold text-red-500">
                                    {performance?.overdueRate || 0}%
                                </span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
