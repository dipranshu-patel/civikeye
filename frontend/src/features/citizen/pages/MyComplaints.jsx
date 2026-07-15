import { useState, useEffect, useMemo, useRef } from "react";
import {
    Search,
    Filter,
    ChevronDown,
    CheckCircle,
    Clock,
    AlertTriangle,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import clsx from "clsx";
import { complaintsService } from "../services/complaints.service";
import ComplaintCard from "../components/ComplaintCard";
import ComplaintDetailsModal from "../components/ComplaintDetailsModal";

export default function MyComplaints() {
    const [activeTab, setActiveTab] = useState("active");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("recent");

    const tabsRef = useRef(null);
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        if (tabsRef.current) {
            const activeEl = tabsRef.current.querySelector(
                `[data-tab-id="${activeTab}"]`,
            );
            if (activeEl) {
                setPillStyle({
                    left: activeEl.offsetLeft,
                    width: activeEl.offsetWidth,
                });
            }
        }
    }, [activeTab]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        summary: null,
        complaints: [],
        pagination: null,
    });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [selectedComplaintId, setSelectedComplaintId] = useState(null);

    const sortOptions = [
        { value: "recent", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "most_upvoted", label: "Most Upvoted" },
    ];

    const tabs = [
        { id: "active", label: "Active", icon: Clock },
        {
            id: "pending_verification",
            label: "Pending Verification",
            icon: AlertCircle,
        },
        { id: "resolved", label: "Resolved", icon: CheckCircle },
        { id: "reopened", label: "Reopened", icon: RefreshCw },
        { id: "overdue", label: "Overdue", icon: AlertTriangle },
    ];

    useEffect(() => {
        setPage(1);
    }, [activeTab, search, sort]);

    useEffect(() => {
        const fetchComplaints = async () => {
            if (page === 1) setLoading(true);
            try {
                const res = await complaintsService.getMyComplaints({
                    tab: activeTab,
                    search,
                    sort,
                    page,
                    limit: 15,
                });

                const newComplaints = res.data.data.complaints || [];
                const newSummary = res.data.data.summary || null;

                if (page === 1) {
                    setData({
                        summary: newSummary,
                        complaints: newComplaints,
                        pagination: res.data.data.pagination,
                    });
                } else {
                    setData((prev) => ({
                        summary: prev.summary,
                        complaints: [...prev.complaints, ...newComplaints],
                        pagination: res.data.data.pagination,
                    }));
                }

                setHasMore(newComplaints.length === 15);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchComplaints, 300);
        return () => clearTimeout(timeout);
    }, [activeTab, search, sort, page]);

    const { summary, complaints } = data;

    return (
        <div className="max-w-[1400px] mx-auto">
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl p-6 text-white shadow-lg shadow-gray-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-gray-300 font-medium text-sm mb-1">
                                Total Complaints
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">
                                    {summary.active +
                                        summary.resolved +
                                        summary.reopened +
                                        summary.pendingVerification}
                                </h3>
                            </div>
                            {summary.pendingVerification > 0 && (
                                <p className="text-amber-400 text-xs mt-2 font-medium">
                                    {summary.pendingVerification} pending
                                    verification
                                </p>
                            )}
                        </div>
                        <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-blue-100 font-medium text-sm mb-1">
                                Active
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">
                                    {summary.active}
                                </h3>
                            </div>
                        </div>
                        <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-emerald-100 font-medium text-sm mb-1">
                                Resolved
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">
                                    {summary.resolved}
                                </h3>
                            </div>
                        </div>
                        <CheckCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                    <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg shadow-red-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-red-100 font-medium text-sm mb-1">
                                Overdue
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">
                                    {summary.overdue}
                                </h3>
                            </div>
                        </div>
                        <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            )}

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
                <div className="inline-flex max-w-full overflow-x-auto hide-scrollbar bg-gray-100/80 p-1 rounded-xl">
                    <div
                        className="relative flex w-max min-w-full"
                        ref={tabsRef}
                    >
                        <div
                            className="absolute top-0 bottom-0 bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 ease-out z-0"
                            style={{
                                left: pillStyle.left,
                                width: pillStyle.width,
                            }}
                        />
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    data-tab-id={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        "relative z-10 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 cursor-pointer",
                                        isActive
                                            ? "text-gray-900"
                                            : "text-gray-500 hover:text-gray-700",
                                    )}
                                >
                                    <Icon
                                        className={clsx(
                                            "w-4 h-4 shrink-0",
                                            isActive
                                                ? "text-gray-900"
                                                : "text-gray-400",
                                        )}
                                    />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-row gap-3">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search my complaints..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all text-sm font-medium shadow-sm"
                        />
                    </div>
                    <div className="flex items-center shrink-0">
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all duration-300 min-w-[130px] shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
                                    {sort === ""
                                        ? "Sort"
                                        : sortOptions.find(
                                              (o) => o.value === sort,
                                          )?.label}
                                </span>
                                <ChevronDown
                                    className={clsx(
                                        "w-4 h-4 text-gray-400 transition-transform duration-300",
                                        isFilterOpen &&
                                            "rotate-180 text-gray-900",
                                    )}
                                />
                            </button>

                            {isFilterOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsFilterOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-50/95 backdrop-blur-sm border border-gray-200 shadow-xl text-gray-900 rounded-xl py-2 z-20 overflow-hidden ring-1 ring-black/5">
                                        {sortOptions.map((option) => {
                                            const isSelected =
                                                sort === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setSort(option.value);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={clsx(
                                                        "group w-full text-left px-5 py-3 text-sm transition-all duration-300 relative cursor-pointer",
                                                        isSelected
                                                            ? "text-gray-900 font-bold bg-slate-100/80"
                                                            : "text-gray-600 font-medium hover:text-gray-900 hover:bg-slate-100/50",
                                                    )}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-full"></div>
                                                    )}
                                                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                                                        {option.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {complaints.map((c) => (
                        <ComplaintCard
                            key={c.id}
                            complaint={c}
                            className="w-full"
                            onClick={() => setSelectedComplaintId(c.id)}
                        />
                    ))}
                </div>

                {loading && page > 1 && (
                    <div className="py-8 flex justify-center w-full">
                        <div className="w-6 h-6 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                    </div>
                )}

                {loading && page === 1 && complaints.length === 0 && (
                    <div className="flex justify-center py-24">
                        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                )}

                {!loading && complaints.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                            No complaints found
                        </h3>
                        <p className="text-gray-500 mt-1">
                            You don't have any complaints in this section.
                        </p>
                    </div>
                )}

                {!loading && hasMore && complaints.length >= 15 && (
                    <div className="mt-10 flex justify-center w-full">
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            className="px-8 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
                        >
                            Load more
                        </button>
                    </div>
                )}
            </div>

            {selectedComplaintId && (
                <ComplaintDetailsModal
                    complaintId={selectedComplaintId}
                    onClose={() => setSelectedComplaintId(null)}
                />
            )}
        </div>
    );
}
