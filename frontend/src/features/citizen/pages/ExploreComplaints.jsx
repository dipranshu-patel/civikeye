import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    ChevronRight,
    ArrowLeft,
    ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { complaintsService } from "../services/complaints.service";
import ComplaintCard from "../components/ComplaintCard";
import ComplaintDetailsModal from "../components/ComplaintDetailsModal";

export default function ExploreComplaints() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const statusOptions = [
        { value: "", label: "All Statuses" },
        { value: "reported", label: "Reported" },
        { value: "in_progress", label: "In Progress" },
        { value: "pending_verification", label: "Pending Verification" },
        { value: "resolved", label: "Resolved" },
        { value: "reopened", label: "Reopened" },
        { value: "overdue", label: "Overdue" },
    ];

    const [viewMode, setViewMode] = useState("overview");
    const [activeSection, setActiveSection] = useState(null);

    const [loading, setLoading] = useState(true);

    const [ongoingAuth, setOngoingAuth] = useState([]);
    const [ongoingVol, setOngoingVol] = useState([]);
    const [resolvedAll, setResolvedAll] = useState([]);

    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [selectedComplaintId, setSelectedComplaintId] = useState(null);

    useEffect(() => {
        if (viewMode !== "overview") return;

        const fetchOverview = async () => {
            setLoading(true);
            try {
                let ongoingP = null;
                let resolvedP = null;

                const isResolvedFilter = filterStatus === "resolved";
                const isFrontendFilter = filterStatus === "overdue";
                const apiStatus = isFrontendFilter ? "" : filterStatus;

                if (!apiStatus || !isResolvedFilter) {
                    ongoingP = complaintsService.exploreComplaints({
                        search,
                        status:
                            apiStatus ||
                            "reported,assigned,in_progress,pending_verification,reopened",
                        limit: isFrontendFilter ? 50 : 15,
                    });
                }

                if (!apiStatus || isResolvedFilter) {
                    resolvedP = complaintsService.exploreComplaints({
                        search,
                        status: apiStatus || "resolved",
                        limit: isFrontendFilter ? 50 : 15,
                    });
                }

                const [resOngoing, resResolved] = await Promise.all([
                    ongoingP ||
                        Promise.resolve({
                            data: {
                                data: {
                                    authorityRequired: [],
                                    volunteerNeeded: [],
                                },
                            },
                        }),
                    resolvedP ||
                        Promise.resolve({
                            data: {
                                data: {
                                    authorityRequired: [],
                                    volunteerNeeded: [],
                                },
                            },
                        }),
                ]);

                let ongoingAuthData =
                    resOngoing.data.data.authorityRequired || [];
                let ongoingVolData = resOngoing.data.data.volunteerNeeded || [];
                let resolvedAuth =
                    resResolved.data.data.authorityRequired || [];
                let resolvedVol = resResolved.data.data.volunteerNeeded || [];
                let resolvedAllData = [...resolvedAuth, ...resolvedVol];

                if (filterStatus === "overdue") {
                    const isPast = (dateStr) => new Date(dateStr) < new Date();
                    const checkOverdue = (c) =>
                        c.slaDeadline &&
                        isPast(c.slaDeadline) &&
                        c.status !== "resolved" &&
                        c.status !== "closed";

                    ongoingAuthData = ongoingAuthData.filter(checkOverdue);
                    ongoingVolData = ongoingVolData.filter(checkOverdue);
                    resolvedAllData = resolvedAllData.filter(checkOverdue);
                }

                setOngoingAuth(ongoingAuthData);
                setOngoingVol(ongoingVolData);
                setResolvedAll(resolvedAllData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchOverview, 300);
        return () => clearTimeout(timeout);
    }, [search, filterStatus, viewMode]);

    useEffect(() => {
        if (viewMode !== "list") return;

        const fetchList = async () => {
            if (page === 1) setLoading(true);
            try {
                let params = { search, page, limit: 15 };

                const isFrontendFilter = filterStatus === "overdue";
                const apiStatus = isFrontendFilter ? "" : filterStatus;

                if (activeSection === "resolved") {
                    params.status = apiStatus || "resolved";
                } else {
                    params.status =
                        apiStatus ||
                        "reported,assigned,in_progress,pending_verification,reopened";
                    if (activeSection === "authorityRequired")
                        params.issueType = "authority_required";
                    if (activeSection === "volunteerNeeded")
                        params.issueType = "community_fixable";
                }

                if (isFrontendFilter) {
                    params.limit = 100;
                }

                const res = await complaintsService.exploreComplaints(params);

                let newItems = [];
                if (activeSection === "resolved") {
                    const auth = res.data.data.authorityRequired || [];
                    const vol = res.data.data.volunteerNeeded || [];
                    newItems = [...auth, ...vol];
                } else if (activeSection === "authorityRequired") {
                    newItems = res.data.data.authorityRequired || [];
                } else {
                    newItems = res.data.data.volunteerNeeded || [];
                }

                if (filterStatus === "overdue") {
                    const isPast = (dateStr) => new Date(dateStr) < new Date();
                    const checkOverdue = (c) =>
                        c.slaDeadline &&
                        isPast(c.slaDeadline) &&
                        c.status !== "resolved" &&
                        c.status !== "closed";
                    newItems = newItems.filter(checkOverdue);
                }

                if (page === 1) {
                    setListData(newItems);
                } else {
                    setListData((prev) => {
                        const existingIds = new Set(
                            prev.map((item) => item.id),
                        );
                        const uniqueNewItems = newItems.filter(
                            (item) => !existingIds.has(item.id),
                        );
                        return [...prev, ...uniqueNewItems];
                    });
                }

                setHasMore(res.data.data.hasMore ?? newItems.length > 0);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [search, filterStatus, viewMode, activeSection, page]);

    const handleSeeMore = (section) => {
        setActiveSection(section);
        setPage(1);
        setViewMode("list");
    };

    const handleBack = () => {
        setViewMode("overview");
        setActiveSection(null);
        setPage(1);
    };

    const SeeMoreCard = ({ onClick, label }) => (
        <div
            onClick={onClick}
            className="w-[180px] shrink-0 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer h-full min-h-[220px]"
        >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                <ChevronRight className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">{label}</span>
        </div>
    );

    const SectionRow = ({ title, subtitle, items, sectionKey }) => {
        if (items.length === 0 && !loading) return null;

        return (
            <div className="mb-10">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                </div>
                <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x snap-mandatory items-stretch">
                    {loading && items.length === 0 ? (
                        [...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-[340px] h-[260px] bg-gray-100 rounded-2xl animate-pulse shrink-0"
                            ></div>
                        ))
                    ) : (
                        <>
                            {items.slice(0, 5).map((c) => (
                                <div
                                    className="snap-start h-full flex"
                                    key={c.id}
                                >
                                    <ComplaintCard
                                        complaint={c}
                                        onClick={() =>
                                            setSelectedComplaintId(c.id)
                                        }
                                    />
                                </div>
                            ))}
                            {items.length >= 5 && (
                                <div className="snap-start h-full flex">
                                    <SeeMoreCard
                                        onClick={() =>
                                            handleSeeMore(sectionKey)
                                        }
                                        label={`See all`}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                {viewMode === "list" && (
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center w-12 shrink-0 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search complaints, wards, departments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center shrink-0">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center justify-between gap-3 px-5 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all duration-300 min-w-[170px] shadow-sm hover:shadow-md cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                {!filterStatus && (
                                    <Filter className="w-4 h-4 text-gray-400" />
                                )}
                                {filterStatus
                                    ? statusOptions.find(
                                          (o) => o.value === filterStatus,
                                      )?.label
                                    : "Filter Status"}
                            </span>
                            <ChevronDown
                                className={clsx(
                                    "w-4 h-4 text-gray-400 transition-transform duration-300",
                                    isFilterOpen && "rotate-180 text-gray-900",
                                )}
                            />
                        </button>

                        {isFilterOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsFilterOpen(false)}
                                ></div>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-full min-w-[200px] bg-slate-50/95 backdrop-blur-sm border border-gray-200 shadow-xl text-gray-900 rounded-xl py-2 z-20 overflow-hidden ring-1 ring-black/5">
                                    {statusOptions.map((option) => {
                                        const isSelected =
                                            filterStatus === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setFilterStatus(
                                                        option.value,
                                                    );
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

            {viewMode === "overview" && (
                <div className="min-h-[60vh]">
                    <SectionRow
                        title="Authority Required"
                        subtitle="Issues requiring government department action."
                        items={ongoingAuth}
                        sectionKey="authorityRequired"
                    />

                    <SectionRow
                        title="Volunteer Needed"
                        subtitle="Community-fixable issues open to volunteer participation."
                        items={ongoingVol}
                        sectionKey="volunteerNeeded"
                    />

                    <SectionRow
                        title="Resolved Complaints"
                        subtitle="Past issues that have been verified and closed."
                        items={resolvedAll}
                        sectionKey="resolved"
                    />

                    {!loading &&
                        ongoingAuth.length === 0 &&
                        ongoingVol.length === 0 &&
                        resolvedAll.length === 0 && (
                            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    No complaints found
                                </h3>
                                <p className="text-gray-500 mt-1">
                                    Try adjusting your search or filters to see
                                    more results.
                                </p>
                            </div>
                        )}
                </div>
            )}

            {viewMode === "list" && (
                <div className="min-h-[60vh]">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {activeSection === "authorityRequired" &&
                                    "Authority Required"}
                                {activeSection === "volunteerNeeded" &&
                                    "Volunteer Needed"}
                                {activeSection === "resolved" &&
                                    "Resolved Complaints"}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {activeSection === "authorityRequired" &&
                                    "Issues requiring government department action."}
                                {activeSection === "volunteerNeeded" &&
                                    "Community-fixable issues open to volunteer participation."}
                                {activeSection === "resolved" &&
                                    "Past issues that have been verified and closed."}
                            </p>
                        </div>
                        <div className="text-sm font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {listData.length} results
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listData.map((c) => (
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

                    {!loading && hasMore && listData.length >= 15 && (
                        <div className="mt-10 flex justify-center w-full">
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                className="px-8 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm cursor-pointer"
                            >
                                Load more complaints
                            </button>
                        </div>
                    )}
                </div>
            )}

            {selectedComplaintId && (
                <ComplaintDetailsModal
                    complaintId={selectedComplaintId}
                    onClose={() => setSelectedComplaintId(null)}
                />
            )}
        </div>
    );
}
