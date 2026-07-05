import { MapPin, ThumbsUp, ThumbsDown, Clock, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

function formatDistanceToNow(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor(Math.abs(now - d) / 1000);
    
    if (diffInSeconds < 60) return '< 1m';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    const remainingHours = diffInHours % 24;
    return remainingHours > 0 ? `${diffInDays}d ${remainingHours}h` : `${diffInDays}d`;
}

export default function VerificationCard({ item, type = "pending", onVote, onClick, className }) {
    const [voting, setVoting] = useState(false);

    const isHistory = type === "history";
    const details = isHistory ? item.complaint : item;
    
    const {
        publicCode,
        title,
        category,
        department,
        addressText,
        coverPhoto,
    } = details;

    const tally = item.tally;

    const handleVote = async (e, voteType) => {
        e.stopPropagation();
        if (voting || !onVote) return;
        setVoting(true);
        try {
            await onVote(details.id, voteType);
        } finally {
            setVoting(false);
        }
    };

    return (
        <div 
            className={clsx("shrink-0 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 transition-all cursor-pointer", className || "w-[340px]")}
            onClick={() => onClick(details.id)}
        >
            <div className="p-5 flex gap-4">
                <div className="w-[72px] h-[72px] rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                    {coverPhoto ? (
                        <img src={coverPhoto} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-[10px] text-center font-medium">No Photo</div>
                    )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase truncate">
                            {publicCode} &bull; {category || "Category"}
                        </p>
                        {isHistory ? (
                            <span className={clsx("px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap flex items-center gap-1.5", 
                                item.myVote === "confirm" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                            )}>
                                {item.myVote === "confirm" ? "Confirmed" : "Rejected"}
                            </span>
                        ) : (
                            <span className={clsx("px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap flex items-center gap-1.5 bg-indigo-50 text-indigo-700")}>
                                <ShieldCheck className="w-3 h-3" />
                                Verify
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 mb-2" title={title}>
                        {title}
                    </h3>
                    <div className="space-y-1.5 mt-auto">
                        {department && (
                            <div className="flex items-start gap-1.5 text-xs text-gray-500">
                                <span className="text-gray-400 shrink-0 font-medium">@</span>
                                <span className="truncate">{department}</span>
                            </div>
                        )}
                        <div className="flex items-start gap-1.5 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span className="truncate">{addressText}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                        <span>{tally.confirms} / {tally.minVotes} needed</span>
                    </div>
                    {!isHistory && item.hoursUntilDeadline !== null && (
                        <div className={clsx("flex items-center gap-1", item.hoursUntilDeadline < 24 ? "text-red-600" : "text-gray-500")}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.hoursUntilDeadline}h left</span>
                        </div>
                    )}
                    {!isHistory && item.distanceKm !== undefined && (
                        <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.distanceKm}km</span>
                        </div>
                    )}
                </div>

                {!isHistory && (
                    <div className="flex gap-2">
                        <button
                            disabled={voting}
                            onClick={(e) => handleVote(e, 'confirm')}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Confirm
                        </button>
                        <button
                            disabled={voting}
                            onClick={(e) => handleVote(e, 'reject')}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-700 font-semibold text-xs hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
