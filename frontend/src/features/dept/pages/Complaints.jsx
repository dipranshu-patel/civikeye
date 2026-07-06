import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import clsx from "clsx";
import { deptService } from "../services/dept.service";
import ComplaintCard from "../components/ComplaintCard";
import ComplaintDetailsModal from "../components/ComplaintDetailsModal";

export default function Complaints() {
    const [activeTab, setActiveTab] = useState("assigned");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState(""); 

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        tabCounts: null,
        complaints: [],
        pagination: null,
    });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const tabs = [
        { id: "assigned", label: "Assigned", countKey: "assigned" },
        { id: "in_progress", label: "In Progress", countKey: "inProgress" },
        { id: "pending_verification", label: "Pending Verification", countKey: "pendingVerification" },
        { id: "resolved", label: "Resolved", countKey: "resolvedThisMonth" },
        { id: "reopened", label: "Reopened", countKey: "reopened" }
    ];

    useEffect(() => {
        setPage(1);
    }, [activeTab, search, refreshTrigger]);

    useEffect(() => {
        const fetchComplaints = async () => {
            if (page === 1) setLoading(true);
            try {
                const res = await deptService.getComplaints({
                    tab: activeTab,
                    search,
                    page,
                    limit: 15,
                });

                const newComplaints = res.data.data.complaints || [];
                const newCounts = res.data.data.tabCounts || null;

                if (page === 1) {
                    setData({
                        tabCounts: newCounts,
                        complaints: newComplaints,
                        pagination: res.data.data.pagination,
                    });
                } else {
                    setData((prev) => ({
                        tabCounts: newCounts,
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

        fetchComplaints();
    }, [activeTab, search, page, refreshTrigger]);

    const handleUpdate = () => {
        setRefreshTrigger(prev => prev + 1);
        setSelectedComplaintId(null);
    };

    return (
        <div className="max-w-[1400px] mx-auto min-h-[70vh]">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
                
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search by code or title..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-8 overflow-x-auto hide-scrollbar">
                <div className="inline-flex bg-gray-100/80 p-1 rounded-xl">
                    <div className="relative flex w-max min-w-full" ref={tabsRef}>
                        <div 
                            className="absolute top-0 bottom-0 bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 ease-out z-0"
                            style={{ left: pillStyle.left, width: pillStyle.width }}
                        />
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const count = data.tabCounts ? data.tabCounts[tab.countKey] || 0 : 0;
                            return (
                                <button
                                    key={tab.id}
                                    data-tab-id={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        "relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 cursor-pointer",
                                        isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {tab.label}
                                    <span className={clsx(
                                        "px-2 py-0.5 rounded-full text-xs font-bold transition-colors",
                                        isActive ? "bg-gray-100 text-gray-900" : "bg-gray-200/50 text-gray-500"
                                    )}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading && page === 1 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-gray-300" />
                    <p className="text-sm font-medium">Loading complaints...</p>
                </div>
            ) : data.complaints.length > 0 ? (
                <div className="space-y-8">
                    {/* Grid Layout: Exactly 3 cards per row on large screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.complaints.map((complaint) => (
                            <ComplaintCard 
                                key={complaint.id}
                                complaint={complaint}
                                className="w-full"
                                onClick={() => setSelectedComplaintId(complaint.id)}
                            />
                        ))}
                    </div>
                    
                    {hasMore && (
                        <div className="flex justify-center pt-4 pb-8">
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={loading}
                                className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No complaints found</h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                        There are no complaints matching your current filters in this tab.
                    </p>
                </div>
            )}

            {/* Details Modal */}
            {selectedComplaintId && (
                <ComplaintDetailsModal
                    complaintId={selectedComplaintId}
                    onClose={() => setSelectedComplaintId(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}
