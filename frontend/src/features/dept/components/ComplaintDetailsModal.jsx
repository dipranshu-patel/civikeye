import { useState, useEffect, useRef } from "react";
import {
    X,
    MapPin,
    Clock,
    CheckCircle2,
    ThumbsUp,
    Upload,
    Loader2,
    AlertCircle,
} from "lucide-react";
import clsx from "clsx";
import { deptService } from "../services/dept.service";

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

export default function ComplaintDetailsModal({
    complaintId,
    onClose,
    onUpdate,
}) {
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    const [note, setNote] = useState("");
    const [photos, setWorkPhotos] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await deptService.getComplaintDetail(complaintId);
                setComplaint(res.data.data.complaint);
            } catch (err) {
                console.error(err);
                setError("Failed to load details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [complaintId]);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            setError("Maximum 3 photos allowed.");
            return;
        }
        setWorkPhotos(files);
        setError(null);
    };

    const handleUpdateStatus = async (toStatus) => {
        if (toStatus === "pending_verification") {
            if (!note.trim()) {
                setError("A resolution note is required.");
                return;
            }
            if (photos.length === 0) {
                setError("At least one work photo is required as proof.");
                return;
            }
        }

        setSubmitting(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("toStatus", toStatus);
            if (note.trim()) formData.append("note", note.trim());
            photos.forEach((photo) => formData.append("photos", photo));

            await deptService.updateComplaintStatus(complaintId, formData);

            const res = await deptService.getComplaintDetail(complaintId);
            setComplaint(res.data.data.complaint);
            setNote("");
            setWorkPhotos([]);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to update status.");
        } finally {
            setSubmitting(false);
        }
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

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-gray-900 animate-spin" />
                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading details...
                    </p>
                </div>
            </div>
        );
    }

    if (!complaint) return null;

    const {
        publicCode,
        title,
        description,
        status,
        category,
        addressText,
        upvoteCount,
        createdAt,
        photos: complaintPhotos,
        history,
        isOverdue,
    } = complaint;

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
                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative"
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
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Left: Details */}
                        <div className="flex-1 space-y-8 min-w-0">
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
                                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                            <ThumbsUp className="w-4 h-4" />
                                        </div>
                                        {upvoteCount} Upvotes
                                    </div>
                                </div>

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
                                </div>
                            </div>

                            {complaintPhotos && complaintPhotos.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">
                                        Evidence Photos
                                    </h3>
                                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                        {complaintPhotos.map((p, i) => (
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

                        {/* Right: Progression/History & Actions */}
                        <div className="w-full lg:w-[380px] shrink-0 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">
                                Complaint Progression
                            </h3>

                            <div className="space-y-6 relative before:absolute before:top-4 before:bottom-0 before:left-[11px] before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent mb-8">
                                {history && history.length > 0 ? (
                                    history.map((item, index) => {
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

                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 mb-4">
                                    Department Actions
                                </h3>

                                {error && (
                                    <div className="mb-4 text-red-600 text-sm flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                {status === "reported" && (
                                    <button
                                        onClick={() =>
                                            handleUpdateStatus("in_progress")
                                        }
                                        disabled={submitting}
                                        className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer flex justify-center items-center gap-2"
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : null}
                                        Mark as In Progress
                                    </button>
                                )}

                                {(status === "in_progress" ||
                                    status === "reopened") && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                                Resolution Note *
                                            </label>
                                            <textarea
                                                value={note}
                                                onChange={(e) =>
                                                    setNote(e.target.value)
                                                }
                                                placeholder="Explain what was done..."
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm h-24 resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                                Work Proof Photos *
                                            </label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handlePhotoChange}
                                            />
                                            <button
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
                                            >
                                                <Upload className="w-4 h-4" />
                                                {photos.length > 0
                                                    ? `${photos.length} photo(s) selected`
                                                    : "Select Photos"}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleUpdateStatus(
                                                    "pending_verification",
                                                )
                                            }
                                            disabled={submitting}
                                            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2"
                                        >
                                            {submitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : null}
                                            Submit for Verification
                                        </button>
                                    </div>
                                )}

                                {status === "pending_verification" && (
                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm font-medium">
                                        Waiting for community verification. No
                                        actions required.
                                    </div>
                                )}

                                {status === "resolved" && (
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Successfully resolved and verified.
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
