import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Filter,
    ChevronDown,
    ShieldCheck,
    CheckCircle,
    Target,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import { verificationsService } from "../services/verifications.service";
import VerificationCard from "../components/VerificationCard";
import ComplaintDetailsModal from "../components/ComplaintDetailsModal";

export default function VerificationRequests() {
    const [activeTab, setActiveTab] = useState("pending");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const tabsRef = useRef(null);
    const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        if (tabsRef.current) {
            const activeEl = tabsRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
            if (activeEl) {
                setPillStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
            }
        }
    }, [activeTab]);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        summary: null,
        items: [],
    });

    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [locationError, setLocationError] = useState(null);

    const filterOptions = [
        { value: "most_recent", label: "Most Recent" },
        { value: "deadline_soon", label: "Ending Soon" },
    ];

    const fetchVerifications = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            setLocationError(null);

            const params = {
                tab: activeTab,
            };
            if (activeTab === "pending") {
                if (search) params.search = search;
                params.filter = filter;
            }

            const response =
                await verificationsService.getMyVerifications(params);

            if (response.data.success) {
                setData({
                    summary: response.data.data.summary,
                    items: response.data.data.items || [],
                });
            }
        } catch (error) {
            console.error("Error fetching verifications:", error);
            if (error.response?.data?.error?.code === "LOCATION_REQUIRED") {
                setLocationError(
                    "Your location is required to access verifications.",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerifications();
    }, [activeTab, filter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchVerifications();
    };

    const handleVote = async (complaintId, voteType) => {
        try {
            const res = await verificationsService.castVote(complaintId, {
                vote: voteType,
            });
            if (res.data.success) {
                if (activeTab === "pending") {
                    setData((prev) => ({
                        ...prev,
                        items: prev.items.filter(
                            (item) => item.id !== complaintId,
                        ),
                    }));
                    fetchVerifications(false);
                }
            }
        } catch (error) {
            console.error("Error casting vote:", error);
            alert(
                error.response?.data?.error?.message || "Failed to submit vote",
            );
        }
    };

    const summary = data.summary || {
        pendingCount: 0,
        completedCount: 0,
        approvalAccuracyPct: null,
    };

    const TABS = [
        { id: "pending", label: "Pending Verification" },
        { id: "history", label: "Verification History" },
    ];

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium text-sm mb-1">
                            Pending Verifications
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary.pendingCount}
                            </h3>
                        </div>
                    </div>
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium text-sm mb-1">
                            Completed Reviews
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary.completedCount}
                            </h3>
                        </div>
                    </div>
                    <CheckCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-900/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-purple-100 font-medium text-sm mb-1">
                            Accuracy Rate
                        </p>
                        <div className="flex items-baseline gap-1.5">
                            <h3 className="text-3xl font-bold">
                                {summary.approvalAccuracyPct !== null
                                    ? summary.approvalAccuracyPct
                                    : "--"}
                            </h3>
                            <span className="text-lg font-medium text-purple-200">
                                %
                            </span>
                        </div>
                    </div>
                    <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>
            </div>

            {/* Tabs & Filters */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
                <div className="inline-flex max-w-full overflow-x-auto hide-scrollbar bg-gray-100/80 p-1 rounded-xl">
                    <div className="relative flex w-max min-w-full" ref={tabsRef}>
                        <div 
                            className="absolute top-0 bottom-0 bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 ease-out z-0"
                            style={{ left: pillStyle.left, width: pillStyle.width }}
                        />
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                data-tab-id={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "relative z-10 px-4 sm:px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 cursor-pointer text-center",
                                    activeTab === tab.id
                                        ? "text-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === "pending" && (
                    <div className="flex flex-row gap-3">
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-1 sm:w-64"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all text-sm font-medium shadow-sm"
                            />
                        </form>

                        <div className="relative shrink-0">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all duration-300 min-w-[130px] shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
                                    {filter === ""
                                        ? "Filter"
                                        : filterOptions.find(
                                              (o) => o.value === filter,
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
                                        {filterOptions.map((option) => {
                                            const isSelected =
                                                filter === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => {
                                                        setFilter(option.value);
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
                )}
            </div>

            {/* Content List */}
            <div className="min-h-[60vh]">
                {locationError ? (
                    <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                        <AlertCircle className="w-12 h-12 mb-4 text-red-500/50" />
                        <h3 className="text-lg font-bold mb-1">
                            Location Required
                        </h3>
                        <p className="text-sm font-medium mb-4 text-center max-w-md">
                            {locationError}
                        </p>
                        <Link
                            to="/settings"
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                        >
                            Go to Settings
                        </Link>
                    </div>
                ) : loading ? (
                    <div className="flex items-center justify-center min-h-[300px]">
                        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                ) : data.items.length === 0 ? (
                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                        <ShieldCheck className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-gray-900 font-bold text-lg mb-1">
                            No verifications found
                        </h3>
                        <p className="text-gray-500 text-sm text-center px-4 max-w-md">
                            {activeTab === "pending"
                                ? "There are no pending requests near you at the moment."
                                : "You haven't verified any requests yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {data.items.map((item) => (
                            <VerificationCard
                                key={
                                    activeTab === "history" ? item.voteId : item.id
                                }
                                item={item}
                                type={activeTab}
                                className="w-full"
                                onVote={handleVote}
                                onClick={(id) => setSelectedComplaintId(id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for displaying details */}
            {selectedComplaintId && (
                <ComplaintDetailsModal
                    complaintId={selectedComplaintId}
                    onClose={() => setSelectedComplaintId(null)}
                />
            )}
        </div>
    );
}
