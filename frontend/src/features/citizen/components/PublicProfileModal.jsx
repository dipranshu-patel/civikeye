import React, { useState, useEffect } from "react";
import {
    X,
    Loader2,
    Award,
    CheckCircle2,
    ThumbsUp,
    FileText,
    CheckCircle,
} from "lucide-react";
import { usersService } from "../services/users.service";
import clsx from "clsx";

export default function PublicProfileModal({ userId, onClose }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await usersService.getPublicProfile(userId);
            setProfile(res.data.data.profile);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    if (!userId) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        Public Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600 font-medium">
                            {error}
                        </div>
                    ) : profile ? (
                        <div className="space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 shrink-0 uppercase">
                                    {(() => {
                                        const w =
                                            profile.displayName
                                                ?.trim()
                                                .split(/\s+/) || [];
                                        return w.length >= 2
                                            ? (w[0][0] + w[1][0]).toUpperCase()
                                            : w.length === 1
                                              ? w[0]
                                                    .substring(0, 2)
                                                    .toUpperCase()
                                              : "?";
                                    })()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {profile.displayName}
                                        </h3>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">
                                            {profile.role}
                                        </span>
                                        {profile.communityVerification ===
                                            "verified" && (
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Member since{" "}
                                        {new Date(
                                            profile.memberSince,
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {profile.contributionSummary ? (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                                        Civic Participation
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gradient-to-br from-slate-700 to-gray-900 rounded-2xl p-4 text-white shadow-md shadow-gray-900/10 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <p className="text-gray-300 font-medium text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                    <FileText className="w-3.5 h-3.5" />{" "}
                                                    Reports
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    {
                                                        profile
                                                            .contributionSummary
                                                            .complaintsField
                                                    }
                                                </p>
                                            </div>
                                            <FileText className="absolute -right-3 -bottom-3 w-16 h-16 text-white opacity-10" />
                                        </div>

                                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-4 text-white shadow-md shadow-blue-900/20 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <p className="text-blue-100 font-medium text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                    <ThumbsUp className="w-3.5 h-3.5" />{" "}
                                                    Upvotes
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    {
                                                        profile
                                                            .contributionSummary
                                                            .upvotesCast
                                                    }
                                                </p>
                                            </div>
                                            <ThumbsUp className="absolute -right-3 -bottom-3 w-16 h-16 text-white opacity-20" />
                                        </div>

                                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-md shadow-emerald-900/20 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <p className="text-emerald-100 font-medium text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                    <CheckCircle className="w-3.5 h-3.5" />{" "}
                                                    Verifications
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    {
                                                        profile
                                                            .contributionSummary
                                                            .verificationsCast
                                                    }
                                                </p>
                                            </div>
                                            <CheckCircle className="absolute -right-3 -bottom-3 w-16 h-16 text-white opacity-20" />
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl p-4 text-white shadow-md shadow-purple-900/20 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <p className="text-purple-100 font-medium text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                    <Award className="w-3.5 h-3.5" />{" "}
                                                    Tasks
                                                </p>
                                                <p className="text-2xl font-bold">
                                                    {
                                                        profile
                                                            .contributionSummary
                                                            .tasksCompleted
                                                    }
                                                </p>
                                            </div>
                                            <Award className="absolute -right-3 -bottom-3 w-16 h-16 text-white opacity-20" />
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 text-white shadow-md shadow-red-900/20 relative overflow-hidden flex items-center justify-between">
                                        <div className="relative z-10 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-orange-200" />
                                            <span className="font-bold text-lg">
                                                Civic Points
                                            </span>
                                        </div>
                                        <span className="relative z-10 text-3xl font-black">
                                            {
                                                profile.contributionSummary
                                                    .civicPoints
                                            }
                                        </span>
                                        <Award className="absolute right-12 -bottom-6 w-24 h-24 text-white opacity-10" />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl text-center">
                                    <p className="text-sm font-medium text-gray-500">
                                        This user has hidden their public
                                        contribution history.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
