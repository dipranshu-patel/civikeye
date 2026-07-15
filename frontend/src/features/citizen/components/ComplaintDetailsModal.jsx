import { useState, useEffect } from "react";
import {
    X,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    ThumbsUp,
} from "lucide-react";
import clsx from "clsx";
import { complaintsService } from "../services/complaints.service";

function formatDistanceToNow(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - d) / 1000);

    if (diffInSeconds < 60) return "just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function ComplaintDetailsModal({ complaintId, onClose }) {
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [upvoteError, setUpvoteError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res =
                    await complaintsService.getComplaintDetail(complaintId);
                setComplaint(res.data.data.complaint);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [complaintId]);

    const statusConfig = {
        reported: {
            bg: "bg-gray-100",
            text: "text-gray-700",
            label: "Reported",
            dot: "bg-gray-400",
        },
        assigned: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            label: "Assigned",
            dot: "bg-blue-500",
        },
        in_progress: {
            bg: "bg-purple-50",
            text: "text-purple-700",
            label: "In progress",
            dot: "bg-purple-500",
        },
        pending_verification: {
            bg: "bg-amber-50",
            text: "text-amber-700",
            label: "Pending verification",
            dot: "bg-amber-500",
        },
        resolved: {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            label: "Resolved",
            dot: "bg-emerald-500",
        },
        reopened: {
            bg: "bg-orange-50",
            text: "text-orange-700",
            label: "Reopened",
            dot: "bg-orange-500",
        },
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading details...
                    </p>
                </div>
            </div>
        );
    }

    if (!complaint) return null;

    const {
        id,
        publicCode,
        title,
        description,
        status,
        category,
        department,
        addressText,
        upvoteCount,
        createdAt,
        photos,
        history,
        isOverdue,
        reporter_id: reporterId,
        userUpvoted: hasUpvoted,
    } = complaint;

    const currentUserId = localStorage.getItem("userId");
    const isReporter = currentUserId === reporterId;

    const handleUpvote = async (e) => {
        e.stopPropagation();
        setUpvoteError(null);

        if (!currentUserId) {
            setUpvoteError("Please log in to upvote.");
            return;
        }

        if (isReporter) {
            setUpvoteError("You cannot upvote your own complaint.");
            return;
        }

        try {
            if (hasUpvoted) {
                setComplaint((prev) => ({
                    ...prev,
                    userUpvoted: false,
                    upvoteCount: Math.max(0, prev.upvoteCount - 1),
                }));
                await complaintsService.removeUpvote(id);
            } else {
                setComplaint((prev) => ({
                    ...prev,
                    userUpvoted: true,
                    upvoteCount: prev.upvoteCount + 1,
                }));
                await complaintsService.addUpvote(id);
            }
        } catch (err) {
            setComplaint((prev) => ({
                ...prev,
                userUpvoted: !prev.userUpvoted,
                upvoteCount: prev.userUpvoted
                    ? prev.upvoteCount + 1
                    : Math.max(0, prev.upvoteCount - 1),
            }));
            setUpvoteError(
                err.response?.data?.error?.message ||
                    "Failed to toggle upvote.",
            );
        }
    };

    const sConf = statusConfig[status] || statusConfig.reported;
    const displayBadge = isOverdue
        ? {
              bg: "bg-red-50",
              text: "text-red-700",
              label: "Overdue",
              dot: "bg-red-500",
          }
        : sConf;

    return (
        <div
            className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-gray-500 tracking-wide">
                            {publicCode}
                        </span>
                        <span
                            className={clsx(
                                "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5",
                                displayBadge.bg,
                                displayBadge.text,
                            )}
                        >
                            <span
                                className={clsx(
                                    "w-1.5 h-1.5 rounded-full",
                                    displayBadge.dot,
                                )}
                            ></span>
                            {displayBadge.label}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Left: Details */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">
                                    {title}
                                </h1>

                                <div className="flex flex-wrap gap-y-3 gap-x-6 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        {addressText}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        {formatDistanceToNow(createdAt)} ago
                                    </div>
                                    <div
                                        onClick={handleUpvote}
                                        className={clsx(
                                            "flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer",
                                            hasUpvoted
                                                ? "text-blue-600"
                                                : "text-gray-600 hover:text-gray-900",
                                            isReporter &&
                                                "opacity-50 cursor-not-allowed hover:text-gray-600",
                                        )}
                                        title={
                                            isReporter
                                                ? "You cannot upvote your own complaint"
                                                : "Upvote"
                                        }
                                    >
                                        <div
                                            className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                                hasUpvoted
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-blue-50 text-blue-500 hover:bg-blue-100",
                                            )}
                                        >
                                            <ThumbsUp
                                                className={clsx(
                                                    "w-4 h-4",
                                                    hasUpvoted &&
                                                        "fill-blue-600",
                                                )}
                                            />
                                        </div>
                                        {upvoteCount} Upvotes
                                    </div>
                                </div>

                                {upvoteError && (
                                    <div className="text-red-500 text-sm font-medium mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {upvoteError}
                                    </div>
                                )}

                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        Description
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {description ||
                                            "No description provided."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-gray-100 rounded-2xl p-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Category
                                        </h3>
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {category?.name}
                                        </p>
                                    </div>
                                    <div className="border border-gray-100 rounded-2xl p-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                            Assigned To
                                        </h3>
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {department?.name || "Unassigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {photos && photos.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">
                                        Evidence Photos
                                    </h3>
                                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                        {photos.map((p, i) => (
                                            <a
                                                key={i}
                                                href={p.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="shrink-0"
                                            >
                                                <img
                                                    src={p.url}
                                                    alt={`Complaint photo ${i + 1}`}
                                                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition-opacity"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Progression/History */}
                        <div className="w-full md:w-[320px] shrink-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                Complaint Progression
                            </h3>

                            <div className="space-y-6 relative before:absolute before:top-4 before:bottom-0 before:left-[11px] before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
                                {history && history.length > 0 ? (
                                    history.map((item, index) => {
                                        const isLast =
                                            index === history.length - 1;
                                        const hConf =
                                            statusConfig[item.toStatus] ||
                                            statusConfig.reported;

                                        return (
                                            <div
                                                key={item.id}
                                                className="relative flex items-start gap-4"
                                            >
                                                <div
                                                    className={clsx(
                                                        "w-6 h-6 rounded-full shrink-0 flex items-center justify-center z-10 ring-4 ring-white mt-1",
                                                        hConf.bg,
                                                        hConf.text,
                                                    )}
                                                >
                                                    {item.toStatus ===
                                                        "resolved" ||
                                                    item.toStatus ===
                                                        "closed" ? (
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <div
                                                            className={clsx(
                                                                "w-2 h-2 rounded-full",
                                                                hConf.dot,
                                                            )}
                                                        ></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-2">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <h4 className="font-bold text-gray-900 text-sm">
                                                            {hConf.label}
                                                        </h4>
                                                    </div>
                                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                        {formatDate(
                                                            item.createdAt,
                                                        )}
                                                    </p>
                                                    {item.note && (
                                                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-sm text-gray-600">
                                                            {item.note}
                                                        </div>
                                                    )}
                                                    {item.actorName && (
                                                        <p className="text-xs text-gray-500 mt-2 font-medium">
                                                            By{" "}
                                                            <span className="text-gray-700 font-semibold">
                                                                {item.actorName}
                                                            </span>
                                                            <span className="ml-1 capitalize text-gray-400">
                                                                (
                                                                {item.actorRole}
                                                                )
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-sm text-gray-500 py-4">
                                        No progression history yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
