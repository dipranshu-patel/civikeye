import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../shared/store/uiSlice";
import { volunteerService } from "../services/volunteer.service";
import VolunteerTaskCard from "../components/VolunteerTaskCard";
import CompleteTaskModal from "../components/CompleteTaskModal";
import ComplaintDetailsModal from "../components/ComplaintDetailsModal";
import {
    Search,
    Filter,
    RefreshCw,
    HandHeart,
    CheckCircle,
    ShieldCheck,
    User,
    Star,
    Award,
    Target
} from "lucide-react";
import clsx from "clsx";

const TABS = [
    { id: "discover", label: "Discover Tasks", icon: Search },
    { id: "my-tasks", label: "My Tasks", icon: HandHeart },
];

const MY_TASKS_TABS = [
    { id: "active", label: "Active" },
    { id: "pending_verification", label: "Pending Verification" },
    { id: "completed", label: "Completed" },
];

export default function Volunteer() {
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("discover");
    const [myTasksTab, setMyTasksTab] = useState("active");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [globalSummary, setGlobalSummary] = useState(null);

    const mainTabsRef = useRef(null);
    const [mainPillStyle, setMainPillStyle] = useState({ left: 0, width: 0 });

    const subTabsRef = useRef(null);
    const [subPillStyle, setSubPillStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        if (mainTabsRef.current) {
            const activeEl = mainTabsRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
            if (activeEl) {
                setMainPillStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
            }
        }
    }, [activeTab]);

    useEffect(() => {
        if (subTabsRef.current) {
            const activeEl = subTabsRef.current.querySelector(`[data-tab-id="${myTasksTab}"]`);
            if (activeEl) {
                setSubPillStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
            }
        }
    }, [myTasksTab, activeTab]);

    const [discoverData, setDiscoverData] = useState({
        tasks: [],
        pagination: null,
    });
    const [myTasksData, setMyTasksData] = useState({
        summary: null,
        tasks: [],
    });

    const [claimingId, setClaimingId] = useState(null);
    const [claimError, setClaimError] = useState(null);
    const [completingTask, setCompletingTask] = useState(null);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);

    useEffect(() => {
        dispatch(setPageTitle("Volunteer"));
        fetchGlobalSummary();
    }, [dispatch]);

    useEffect(() => {
        fetchData();
    }, [activeTab, myTasksTab, search]);

    const fetchGlobalSummary = async () => {
        try {
            const [myRes, impRes] = await Promise.all([
                volunteerService.getMyTasks({ tab: "active" }),
                volunteerService.getImpact()
            ]);
            setGlobalSummary({
                active: myRes.data.data.summary.active || 0,
                pendingVerification: myRes.data.data.summary.pendingVerification || 0,
                completed: myRes.data.data.summary.completed || 0,
                verificationRatePct: impRes.data.data.personal.verificationRatePct
            });
        } catch (error) {
            console.error("Failed to fetch global summary", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "discover") {
                const res = await volunteerService.discoverTasks({ search });
                setDiscoverData(res.data.data);
            } else if (activeTab === "my-tasks") {
                const res = await volunteerService.getMyTasks({
                    tab: myTasksTab,
                });
                setMyTasksData(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch volunteer data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    const handleClaimTask = async (task) => {
        if (claimingId) return;
        setClaimingId(task.taskId);
        setClaimError(null);
        try {
            await volunteerService.claimTask(task.taskId);
            fetchGlobalSummary(); // Refresh summary
            setActiveTab("my-tasks");
            setMyTasksTab("active");
        } catch (error) {
            console.error("Failed to claim task:", error);
            setClaimError({
                taskId: task.taskId,
                msg: error.response?.data?.error?.message || "Failed to claim task.",
            });
        } finally {
            setClaimingId(null);
        }
    };

    const handleCompleteSubmit = async (formData) => {
        if (!completingTask) return;
        await volunteerService.completeTask(completingTask.taskId, formData);
        fetchGlobalSummary(); // Refresh summary
        setCompletingTask(null);
        setMyTasksTab("pending_verification");
    };

    const renderEmptyState = (icon, title, message) => (
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">{title}</h3>
            <p className="text-gray-500 text-sm text-center px-4 max-w-md">
                {message}
            </p>
        </div>
    );

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Global Summary Cards */}
            {globalSummary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-blue-100 font-medium text-sm mb-1">
                                Active Tasks
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">
                                    {globalSummary.active}
                                </h3>
                            </div>
                        </div>
                        <HandHeart className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-purple-100 font-medium text-sm mb-1">
                                In Verification
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">
                                    {globalSummary.pendingVerification}
                                </h3>
                            </div>
                        </div>
                        <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>

                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-emerald-100 font-medium text-sm mb-1">
                                Completed Fixes
                            </p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold">
                                    {globalSummary.completed}
                                </h3>
                            </div>
                        </div>
                        <CheckCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-900/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-orange-100 font-medium text-sm mb-1">
                                Verification Success
                            </p>
                            <div className="flex items-baseline gap-1.5">
                                <h3 className="text-3xl font-bold">
                                    {globalSummary.verificationRatePct !== null
                                        ? globalSummary.verificationRatePct
                                        : "--"}
                                </h3>
                                <span className="text-lg font-medium text-orange-200">
                                    %
                                </span>
                            </div>
                        </div>
                        <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                </div>
            )}

            {/* Main Tabs */}
            <div className="inline-flex max-w-full overflow-x-auto hide-scrollbar bg-gray-100/80 p-1 rounded-xl mb-8">
                <div className="relative flex w-max min-w-full" ref={mainTabsRef}>
                    <div 
                        className="absolute top-0 bottom-0 bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 ease-out z-0"
                        style={{ left: mainPillStyle.left, width: mainPillStyle.width }}
                    />
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                data-tab-id={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "relative z-10 flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 cursor-pointer",
                                    isActive
                                        ? "text-gray-900"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <Icon
                                    className={clsx(
                                        "w-4 h-4",
                                        isActive
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                    )}
                                />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Discover Tasks View */}
            {activeTab === "discover" && (
                <div>
                    <div className="mb-8">
                        <form
                            onSubmit={handleSearch}
                            className="relative w-full max-w-xl"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search open volunteer tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 shadow-sm rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all text-sm font-medium"
                            />
                        </form>
                    </div>

                    <div className="min-h-[60vh]">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                            </div>
                        ) : discoverData.tasks.length === 0 ? (
                            renderEmptyState(
                                <HandHeart className="w-8 h-8 text-gray-400" />,
                                "No tasks available",
                                "There are currently no complaints requiring volunteer assistance.",
                            )
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {discoverData.tasks.map((task) => (
                                    <VolunteerTaskCard
                                        key={task.taskId}
                                        task={task}
                                        type="discover"
                                        className="w-full"
                                        actionLabel={
                                            claimingId === task.taskId
                                                ? "Claiming..."
                                                : "Claim Task"
                                        }
                                        actionIcon={HandHeart}
                                        onAction={handleClaimTask}
                                        errorMsg={claimError?.taskId === task.taskId ? claimError.msg : null}
                                        onClick={() => setSelectedComplaintId(task.complaintId || task.taskId)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* My Tasks View */}
            {activeTab === "my-tasks" && (
                <div>
                    <div className="inline-flex max-w-full overflow-x-auto hide-scrollbar bg-gray-100/80 p-1 rounded-xl mb-8">
                        <div className="relative flex w-max min-w-full" ref={subTabsRef}>
                            <div 
                                className="absolute top-0 bottom-0 bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 ease-out z-0"
                                style={{ left: subPillStyle.left, width: subPillStyle.width }}
                            />
                            {MY_TASKS_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    data-tab-id={tab.id}
                                    onClick={() => setMyTasksTab(tab.id)}
                                    className={clsx(
                                        "relative z-10 px-3 sm:px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-300 cursor-pointer text-center",
                                        myTasksTab === tab.id
                                            ? "text-gray-900"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="min-h-[60vh]">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                            </div>
                        ) : myTasksData.tasks.length === 0 ? (
                            renderEmptyState(
                                <Search className="w-8 h-8 text-gray-400" />,
                                "No tasks found",
                                `You have no ${myTasksTab.replace("_", " ")} tasks.`,
                            )
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {myTasksData.tasks.map((task) => (
                                    <VolunteerTaskCard
                                        key={task.assignmentId}
                                        task={task}
                                        type={myTasksTab}
                                        className="w-full"
                                        actionLabel={
                                            myTasksTab === "active"
                                                ? "Complete Task"
                                                : null
                                        }
                                        actionIcon={CheckCircle}
                                        onAction={
                                            myTasksTab === "active"
                                                ? () => setCompletingTask(task)
                                                : undefined
                                        }
                                        onClick={() => setSelectedComplaintId(task.complaintId || task.taskId)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* End Views */}

            {completingTask && (
                <CompleteTaskModal
                    task={completingTask}
                    onClose={() => setCompletingTask(null)}
                    onSubmit={handleCompleteSubmit}
                />
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
