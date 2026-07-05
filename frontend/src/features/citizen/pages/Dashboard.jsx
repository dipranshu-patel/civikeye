import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, ShieldCheck, AlertTriangle, Target, CheckCircle, Inbox, List, Search, Activity } from "lucide-react";
import { dashboardService } from "../services/dashboard.service";
import clsx from "clsx";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await dashboardService.getDashboardData();
                setData(res.data);
            } catch (err) {
                setError("Failed to load dashboard data.");
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
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    const { summary, myComplaints, verificationRequests, recentActivity } =
        data;

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto min-h-[60vh]">
            <section>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-purple-100 font-medium text-sm mb-1">My Active Complaints</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">{summary.myActiveComplaints || 0}</h3>
                            </div>
                        </div>
                        <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-blue-100 font-medium text-sm mb-1">Pending Verifications</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">{summary.pendingVerifications || 0}</h3>
                            </div>
                        </div>
                        <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-emerald-100 font-medium text-sm mb-1">My Volunteer Tasks</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">{summary.myVolunteerTasks || 0}</h3>
                            </div>
                        </div>
                        <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-amber-100 font-medium text-sm mb-1">Contribution Score</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">{summary.contributionScore || 0}</h3>
                            </div>
                        </div>
                        <CheckCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        My Complaints
                    </h2>
                    <Link
                        to="/citizen/my-complaints"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        View all &rarr;
                    </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                    {myComplaints && myComplaints.length > 0 ? (
                        myComplaints.map((complaint) => (
                            <div
                                key={complaint.id}
                                className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex gap-4 w-[340px] shrink-0 snap-start"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {complaint.coverPhoto ? (
                                        <img
                                            src={complaint.coverPhoto}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                            No Img
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col justify-between h-full">
                                        <div>
                                            <div className="text-xs font-medium text-gray-500 mb-1 truncate">
                                                {complaint.publicCode} &bull;{" "}
                                                {complaint.category?.name}
                                            </div>
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {complaint.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-gray-500 truncate mr-2">
                                                {complaint.addressText}
                                            </p>
                                            <span
                                                className={clsx(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap",
                                                    complaint.status === "resolved"
                                                        ? "bg-green-50 text-green-700"
                                                        : complaint.status ===
                                                            "in_progress"
                                                          ? "bg-blue-50 text-blue-700"
                                                          : "bg-gray-100 text-gray-700",
                                                )}
                                            >
                                                {complaint.status.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-400 text-center py-8 flex flex-col items-center">
                            <Inbox className="w-8 h-8 text-gray-300 mb-2" strokeWidth={1.5} />
                            <span>No active complaints.</span>
                        </div>
                    )}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        My Volunteer Tasks
                    </h2>
                    <Link
                        to="/citizen/volunteer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        View all &rarr;
                    </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                    <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-400 text-center py-8 flex flex-col items-center min-w-full">
                        <List className="w-8 h-8 text-gray-300 mb-2" strokeWidth={1.5} />
                        <span>No active volunteer tasks.</span>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Verification Requests
                    </h2>
                    <Link
                        to="/citizen/verification-requests"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        View all &rarr;
                    </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                    {verificationRequests && verificationRequests.length > 0 ? (
                        verificationRequests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 w-[340px] shrink-0 snap-start flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {req.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {req.addressText}
                                    </p>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="px-4 py-2 bg-green-50 text-green-700 font-medium text-sm rounded-lg hover:bg-green-100 flex-1">
                                        Approve
                                    </button>
                                    <button className="px-4 py-2 bg-red-50 text-red-700 font-medium text-sm rounded-lg hover:bg-red-100 flex-1">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-400 text-center py-8 flex flex-col items-center min-w-full">
                            <Search className="w-8 h-8 text-gray-300 mb-2" strokeWidth={1.5} />
                            <span>No pending verifications nearby.</span>
                        </div>
                    )}
                </div>
            </section>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Recent Activity
                    </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
                    {recentActivity && recentActivity.length > 0 ? (
                        recentActivity.map((act, idx) => (
                            <div
                                key={`act-${idx}`}
                                className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col items-center justify-center text-center gap-3 w-48 h-48 shrink-0 snap-start"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                    <Clock className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="flex flex-col flex-1 justify-center">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-3">
                                        {act.note || act.to_status}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(
                                            act.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-400 text-center py-8 flex flex-col items-center">
                            <Activity className="w-8 h-8 text-gray-300 mb-2" strokeWidth={1.5} />
                            <span>No recent activity.</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
