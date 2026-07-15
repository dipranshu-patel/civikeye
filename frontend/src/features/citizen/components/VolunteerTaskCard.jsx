import { MapPin, ThumbsUp, Clock, CheckCircle } from "lucide-react";
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

export default function VolunteerTaskCard({
    task,
    type,
    onAction,
    actionLabel,
    actionIcon: ActionIcon,
    className,
    onClick,
    errorMsg,
}) {
    const {
        publicCode,
        title,
        category,
        addressText,
        coverPhoto,
        upvoteCount,
        reportedAt,
        taskStatus,
        assignStatus,
        proofPhoto,
        note,
    } = task;

    const renderBadge = () => {
        if (type === "discover") {
            return (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap flex items-center gap-1.5 bg-blue-50 text-blue-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Volunteer Needed
                </span>
            );
        }

        const badgeConfig = {
            active: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                label: "Action Required",
                dot: "bg-amber-500",
            },
            pending_verification: {
                bg: "bg-purple-50",
                text: "text-purple-700",
                label: "In Verification",
                dot: "bg-purple-500",
            },
            completed: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                label: "Verified & Closed",
                dot: "bg-emerald-500",
            },
            failed: {
                bg: "bg-red-50",
                text: "text-red-700",
                label: "Rejected",
                dot: "bg-red-500",
            },
        };

        const conf = badgeConfig[assignStatus] || badgeConfig.active;

        return (
            <span
                className={clsx(
                    "px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap flex items-center gap-1.5",
                    conf.bg,
                    conf.text,
                )}
            >
                <span
                    className={clsx("w-1.5 h-1.5 rounded-full", conf.dot)}
                ></span>
                {conf.label}
            </span>
        );
    };

    return (
        <div
            onClick={onClick}
            className={clsx(
                "shrink-0 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 transition-all cursor-pointer",
                className || "w-[340px]",
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
                            {publicCode} &bull; {category || "Category"}
                        </p>
                        {renderBadge()}
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

            <div className="px-5 py-3.5 border-t border-gray-100 flex items-center gap-x-4 text-xs text-gray-500 bg-gray-50/50">
                <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                    <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                    {upvoteCount || 0}
                </div>
                <div className="flex items-center gap-1.5 ml-auto text-gray-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {reportedAt
                        ? formatDistanceToNow(new Date(reportedAt))
                        : "recent"}{" "}
                    ago
                </div>
            </div>

            {proofPhoto && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-start gap-3 bg-slate-50">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0 overflow-hidden border border-gray-200">
                        <img
                            src={proofPhoto}
                            alt="Resolution Proof"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-700 mb-0.5 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Fix Submitted
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-2 italic">
                            {note || "No note provided"}
                        </p>
                    </div>
                </div>
            )}

            {onAction && actionLabel && (
                <div className="px-5 pb-5 pt-4 bg-white mt-auto border-t border-gray-100">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(task);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all cursor-pointer group"
                    >
                        {ActionIcon && (
                            <ActionIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                        )}
                        {actionLabel}
                    </button>
                    {errorMsg && (
                        <p className="mt-2 text-[11px] font-semibold text-red-600 text-center leading-tight">
                            {errorMsg}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
