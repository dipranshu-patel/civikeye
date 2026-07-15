import { MapPin, ThumbsUp, Clock } from "lucide-react";
import clsx from "clsx";

function formatDistanceToNow(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor(Math.abs(now - d) / 1000);

    if (diffInSeconds < 60) return "< 1m";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    const remainingHours = diffInHours % 24;
    return remainingHours > 0
        ? `${diffInDays}d ${remainingHours}h`
        : `${diffInDays}d`;
}

function isPast(dateStr) {
    return new Date(dateStr) < new Date();
}

export default function ComplaintCard({ complaint, onClick, className }) {
    const {
        publicCode,
        title,
        status,
        category,
        addressText,
        upvoteCount,
        slaDeadline,
        createdAt,
        coverPhoto,
    } = complaint;

    const renderSLA = () => {
        if (!slaDeadline) return null;
        const isOverdue = isPast(new Date(slaDeadline));
        const distance = formatDistanceToNow(new Date(slaDeadline));
        if (status === "resolved" || status === "closed") {
            return null;
        }
        return (
            <span
                className={clsx(
                    "flex items-center gap-1",
                    isOverdue
                        ? "text-red-600 font-semibold"
                        : "text-amber-600 font-medium",
                )}
            >
                {isOverdue ? `SLA ${distance} overdue` : `SLA ${distance} left`}
            </span>
        );
    };

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

    const sConf = statusConfig[status] || statusConfig.reported;
    const isOverdue =
        status !== "resolved" &&
        status !== "closed" &&
        slaDeadline &&
        isPast(new Date(slaDeadline));

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
            onClick={onClick}
            className={clsx(
                "shrink-0 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 transition-all cursor-pointer h-full",
                className,
            )}
        >
            <div className="p-5 flex gap-4">
                <div className="w-[72px] h-[72px] rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                    {coverPhoto ? (
                        <img
                            src={coverPhoto}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-[10px] text-center font-medium">
                            No Photo
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase truncate">
                            {publicCode} &bull; {category?.name || "Category"}
                        </p>
                        <span
                            className={clsx(
                                "px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap flex items-center gap-1.5",
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
                    <h3
                        className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 mb-2"
                        title={title}
                    >
                        {title}
                    </h3>
                    <div className="space-y-1.5 mt-auto">
                        <div className="flex items-start gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span className="truncate">{addressText}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 py-3.5 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mt-auto bg-gray-50/50">
                <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                    <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                    {upvoteCount || 0}
                </div>
                {renderSLA()}
                <div className="flex items-center gap-1.5 ml-auto text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(createdAt))} ago
                </div>
            </div>

            <div className="px-5 pb-5 pt-4 bg-white border-t border-gray-100 mt-auto">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick && onClick(e);
                    }}
                    className="w-full py-2.5 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
