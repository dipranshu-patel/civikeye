import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../shared/store/uiSlice";
import { volunteerService } from "../services/volunteer.service";
import { Trophy, Medal, Star, User, RefreshCw, Award } from "lucide-react";
import clsx from "clsx";

export default function LeaderboardPage() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState({ entries: [] });
    const [personalImpact, setPersonalImpact] = useState(null);

    useEffect(() => {
        dispatch(setPageTitle("Leaderboard"));
        fetchLeaderboard();
    }, [dispatch]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const [leadRes, impRes] = await Promise.all([
                volunteerService.getLeaderboard({ limit: 10 }),
                volunteerService.getImpact()
            ]);
            setLeaderboard(leadRes.data.data);
            setPersonalImpact(impRes.data.data.personal);
        } catch (error) {
            console.error("Failed to fetch leaderboard", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
        );
    }

    // Identify if current user is in top 10
    const top10 = leaderboard.entries;
    const currentUserRank = personalImpact?.volunteerRank;
    const isRanked = currentUserRank !== null && currentUserRank !== undefined;
    const inTop10 = isRanked && currentUserRank <= 10;

    const renderUserRow = (entry, isPinned = false) => {
        return (
            <div
                key={isPinned ? 'pinned-user' : entry.rank}
                className={clsx(
                    "flex items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-2xl transition-all",
                    isPinned
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm mb-6"
                        : "bg-white border border-gray-100 hover:shadow-md hover:border-gray-200"
                )}
            >
                {entry.rank <= 3 && !isPinned ? (
                    <span className="w-8 h-8 sm:w-12 sm:h-12 text-xl sm:text-2xl shrink-0 leading-none flex items-center justify-center">
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                    </span>
                ) : (
                    <div className={clsx(
                        "w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-sm sm:text-lg shrink-0",
                        isPinned
                            ? "bg-white text-orange-600 border-2 border-orange-200"
                            : "bg-gray-50 text-gray-500"
                    )}>
                        {`#${entry.rank}`}
                    </div>
                )}
                
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-indigo-50 rounded-full flex items-center justify-center shrink-0 border border-indigo-100">
                    {entry.isAnonymous ? (
                        <User className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-300" />
                    ) : (
                        <span className="text-sm sm:text-lg font-bold text-indigo-600">
                            {entry.displayName ? entry.displayName.charAt(0).toUpperCase() : "A"}
                        </span>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 truncate flex items-center gap-2">
                        {entry.displayName || "Anonymous"}
                        {isPinned && (
                            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                                You
                            </span>
                        )}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        {entry.completedFixes} completed fixes
                    </p>
                </div>
                
                <div className="text-right shrink-0">
                    <p className="text-xl font-black text-gray-900">
                        {entry.totalPoints}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        points
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-[1000px] mx-auto min-h-[60vh]">
            <div className="mb-10 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-inner">
                    <Award className="w-10 h-10 text-orange-500" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Leaderboard</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Top contributors across the system. Points are awarded for reporting valid issues, verifying complaints, and fixing tasks.
                </p>
            </div>

            <div className="bg-white rounded-3xl p-3 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                    {/* Pinned Current User if not in Top 10 */}
                    {!inTop10 && isRanked && (
                        renderUserRow({
                            rank: currentUserRank,
                            displayName: "You",
                            isAnonymous: false,
                            completedFixes: personalImpact.completedFixes,
                            totalPoints: personalImpact.contributionScore
                        }, true)
                    )}

                    {!inTop10 && !isRanked && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-6 border-dashed">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0 bg-white text-gray-400 border border-gray-200">
                                --
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-bold text-gray-600 flex items-center gap-2">
                                    You are unranked
                                </p>
                                <p className="text-sm text-gray-500">
                                    Contribute to earn points and appear on the leaderboard!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Top 10 Users */}
                    <div className="space-y-3">
                        {top10.map(entry => renderUserRow(entry))}
                        
                        {top10.length === 0 && (
                            <div className="text-center py-12 text-gray-500 font-medium">
                                No contributors yet. Be the first!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
