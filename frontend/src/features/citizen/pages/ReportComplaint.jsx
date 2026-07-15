import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { complaintsService } from "../services/complaints.service";
import {
    Upload,
    X,
    ShieldCheck,
    Users,
    AlertCircle,
    Clock,
    MapPin,
    ChevronDown,
} from "lucide-react";
import clsx from "clsx";

export default function ReportComplaint() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [photos, setPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [issueType, setIssueType] = useState("authority_required");
    const [addressText, setAddressText] = useState("");

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [similarComplaints, setSimilarComplaints] = useState([]);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await complaintsService.getPublicCategories();
                setCategories(res.data?.data?.categories || []);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };
        fetchCategories();
    }, []);

    const handlePhotoSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (photos.length + selectedFiles.length > 4) {
            setGlobalError("You can upload a maximum of 4 photos.");
            return;
        }
        setGlobalError(null);
        setPhotos((prev) => [...prev, ...selectedFiles]);
    };

    const removePhoto = (index) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const selectedCategory = categories.find((c) => c.id === categoryId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalError(null);
        setFieldErrors({});
        setSimilarComplaints([]);

        if (title.length < 5)
            return setGlobalError("Title must be at least 5 characters.");
        if (photos.length < 1)
            return setGlobalError("At least 1 photo is required.");
        if (!categoryId) return setGlobalError("Please select a category.");
        if (addressText.length < 10)
            return setGlobalError("Address must be at least 10 characters.");

        setLoading(true);

        if (!navigator.geolocation) {
            setGlobalError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // 1. Check for similar complaints
                    const similarRes =
                        await complaintsService.getSimilarComplaints(
                            latitude,
                            longitude,
                            categoryId,
                        );
                    const similar = similarRes.data?.data?.complaints || [];

                    if (similar.length > 0) {
                        setSimilarComplaints(similar);
                        setGlobalError(
                            "Similar complaints found nearby. Submission blocked to prevent duplicates.",
                        );
                        setLoading(false);
                        return;
                    }

                    // 2. No similar complaints found, proceed to create
                    const formData = new FormData();
                    formData.append("title", title);
                    formData.append("description", description);
                    formData.append("categoryId", categoryId);
                    formData.append("issueType", issueType);
                    formData.append("addressText", addressText);
                    formData.append("latitude", latitude);
                    formData.append("longitude", longitude);

                    photos.forEach((file) => {
                        formData.append("photos", file);
                    });

                    await complaintsService.createComplaint(formData);
                    navigate("/citizen/my-complaints");
                } catch (err) {
                    console.error(err);
                    if (err.response?.status === 422) {
                        const errors = err.response.data.errors;
                        const fErrors = {};
                        errors.forEach((e) => (fErrors[e.field] = e.message));
                        setFieldErrors(fErrors);
                    } else {
                        setGlobalError(
                            err.response?.data?.error?.message ||
                                "Failed to submit complaint.",
                        );
                    }
                } finally {
                    setLoading(false);
                }
            },
            (geoErr) => {
                console.error(geoErr);
                setGlobalError(
                    "Please allow location access to submit a complaint. Exact location is required for verification.",
                );
                setLoading(false);
            },
            { enableHighAccuracy: true },
        );
    };

    return (
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 items-start min-h-[60vh]">
            {/* Left: Form */}
            <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Report a civic issue
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Every report becomes part of the public ledger —
                        visible, time-bound, and verifiable by nearby citizens.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                01
                            </span>
                            Complaint title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Pothole cluster on Main Street"
                            className={clsx(
                                "w-full p-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors outline-none",
                                fieldErrors.title
                                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                            )}
                            maxLength={150}
                        />
                        <div className="flex justify-between gap-4 mt-2 text-xs text-gray-400">
                            <span>
                                Examples: "Garbage pileup beside market road"
                            </span>
                            <span className="shrink-0 whitespace-nowrap">
                                {title.length} / 150
                            </span>
                        </div>
                        {fieldErrors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {fieldErrors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                02
                            </span>
                            Photo evidence
                        </label>

                        {photos.length < 4 && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <Upload className="w-6 h-6 text-gray-400 mb-3" />
                                <p className="font-medium text-gray-900">
                                    Click to upload photos
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    JPG, PNG up to 10MB &middot; Up to 4 photos
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePhotoSelect}
                                />
                            </div>
                        )}

                        {photos.length > 0 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {photos.map((file, i) => (
                                    <div
                                        key={i}
                                        className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white text-gray-600 cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {fieldErrors.photos && (
                            <p className="mt-1 text-sm text-red-500">
                                {fieldErrors.photos}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                03
                            </span>
                            Description{" "}
                            <span className="text-gray-400 text-xs uppercase tracking-wider ml-2">
                                Optional
                            </span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className={clsx(
                                "w-full p-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors outline-none resize-none",
                                fieldErrors.description
                                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                            )}
                            maxLength={600}
                        />
                        <div className="flex justify-between gap-4 mt-2 text-xs text-gray-400">
                            <span>
                                Avoid sharing personal information. Reports are
                                public.
                            </span>
                            <span className="shrink-0 whitespace-nowrap">
                                {description.length} / 600
                            </span>
                        </div>
                        {fieldErrors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {fieldErrors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                04
                            </span>
                            Category
                        </label>

                        <div className="block sm:hidden relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsCategoryOpen(!isCategoryOpen)
                                }
                                className={`w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl text-sm transition-colors cursor-pointer border ${
                                    categoryId
                                        ? "bg-gray-900 text-white font-medium border-gray-900"
                                        : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-white"
                                } ${fieldErrors.categoryId ? "border-red-300 ring-4 ring-red-500/10" : ""}`}
                            >
                                <span>
                                    {categoryId
                                        ? categories.find(
                                              (c) => c.id === categoryId,
                                          )?.name
                                        : "Select a category..."}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${
                                        isCategoryOpen ? "rotate-180" : ""
                                    } ${categoryId ? "text-white" : "text-gray-400"}`}
                                />
                            </button>

                            {isCategoryOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsCategoryOpen(false)}
                                    ></div>
                                    <div className="absolute left-0 top-full mt-2 w-full bg-slate-50/95 backdrop-blur-sm border border-gray-200 shadow-xl text-gray-900 rounded-xl py-2 z-50 max-h-[300px] overflow-y-auto ring-1 ring-black/5">
                                        {categories.map((cat) => {
                                            const isSelected =
                                                categoryId === cat.id;
                                            return (
                                                <button
                                                    type="button"
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setCategoryId(cat.id);
                                                        setIsCategoryOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`group w-full text-left px-5 py-2.5 text-sm transition-all duration-300 relative cursor-pointer ${
                                                        isSelected
                                                            ? "text-gray-900 font-bold bg-slate-100/80"
                                                            : "text-gray-600 font-medium hover:text-gray-900 hover:bg-slate-100/50"
                                                    }`}
                                                >
                                                    {cat.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {categories.map((cat) => (
                                <label
                                    key={cat.id}
                                    className={clsx(
                                        "p-3 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all",
                                        categoryId === cat.id
                                            ? "border-gray-900 bg-gray-50 text-gray-900 shadow-sm"
                                            : "border-gray-200 bg-white hover:border-gray-300 text-gray-700",
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        value={cat.id}
                                        checked={categoryId === cat.id}
                                        onChange={() => setCategoryId(cat.id)}
                                        className="sr-only"
                                    />
                                    <span className="font-semibold text-sm">
                                        {cat.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {fieldErrors.categoryId && (
                            <p className="mt-1 text-sm text-red-500">
                                {fieldErrors.categoryId}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                05
                            </span>
                            Issue type
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <label
                                className={clsx(
                                    "flex-1 p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all",
                                    issueType === "authority_required"
                                        ? "border-gray-900 bg-gray-50 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300 bg-white",
                                )}
                            >
                                <input
                                    type="radio"
                                    name="issueType"
                                    className="hidden"
                                    checked={issueType === "authority_required"}
                                    onChange={() =>
                                        setIssueType("authority_required")
                                    }
                                />
                                <div
                                    className={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                        issueType === "authority_required"
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-500",
                                    )}
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <div
                                        className={clsx(
                                            "font-semibold text-sm",
                                            issueType === "authority_required"
                                                ? "text-gray-900"
                                                : "text-gray-700",
                                        )}
                                    >
                                        Authority Required
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                                        Requires department action, equipment,
                                        or official repair.
                                    </p>
                                </div>
                            </label>
                            <label
                                className={clsx(
                                    "flex-1 p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all",
                                    issueType === "community_fixable"
                                        ? "border-gray-900 bg-gray-50 shadow-sm"
                                        : "border-gray-200 hover:border-gray-300 bg-white",
                                )}
                            >
                                <input
                                    type="radio"
                                    name="issueType"
                                    className="hidden"
                                    checked={issueType === "community_fixable"}
                                    onChange={() =>
                                        setIssueType("community_fixable")
                                    }
                                />
                                <div
                                    className={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                        issueType === "community_fixable"
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-500",
                                    )}
                                >
                                    <Users className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <div
                                        className={clsx(
                                            "font-semibold text-sm",
                                            issueType === "community_fixable"
                                                ? "text-gray-900"
                                                : "text-gray-700",
                                        )}
                                    >
                                        Community Fixable
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                                        Can potentially be resolved through
                                        volunteers or local community action.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                06
                            </span>
                            Location Address
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={addressText}
                                onChange={(e) => setAddressText(e.target.value)}
                                placeholder="Main Street, Sector 45, Block C"
                                className={clsx(
                                    "w-full pl-10 pr-3 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-colors outline-none",
                                    fieldErrors.addressText
                                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10",
                                )}
                                maxLength={300}
                            />
                        </div>
                        {fieldErrors.addressText && (
                            <p className="mt-2 text-sm text-red-500">
                                {fieldErrors.addressText}
                            </p>
                        )}
                    </div>
                </form>
            </div>

            {/* Right: Live Preview & Similar Complaints */}
            <div className="w-full lg:w-96 shrink-0 space-y-6">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                Live preview
                            </div>
                        </div>

                        <div className="p-0">
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 relative overflow-hidden">
                                {photos.length > 0 ? (
                                    <img
                                        src={URL.createObjectURL(photos[0])}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>Photo preview</span>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 break-words">
                                    {title || "Complaint Title"}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                                    {selectedCategory?.name || "Category"}{" "}
                                    &bull;{" "}
                                    {issueType === "authority_required"
                                        ? "Authority Required"
                                        : "Community Fixable"}
                                </p>

                                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                                    <span className="break-words line-clamp-2">
                                        {addressText || "Location Address"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                                            SLA
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedCategory
                                                ? `${selectedCategory.slaDurationDays} days`
                                                : "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wider">
                                            Routed
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedCategory?.department
                                                ?.name || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {globalError && (
                        <div className="text-red-500 text-sm font-medium flex items-center gap-2 px-1">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {globalError}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || similarComplaints.length > 0}
                        className="w-full py-4 rounded-xl bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-gray-900/20"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Processing & checking location...
                            </>
                        ) : similarComplaints.length > 0 ? (
                            "Submission Blocked"
                        ) : (
                            "Submit report"
                        )}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-3">
                        By submitting, you confirm this report is accurate.
                        Exact GPS location will be captured.
                    </p>

                    {similarComplaints.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm mt-4">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-orange-900">
                                        {similarComplaints.length} similar
                                        complaints found nearby
                                    </h4>
                                    <p className="text-sm text-orange-700 mt-1">
                                        Upvote an existing issue instead of
                                        creating a duplicate to raise priority
                                        faster.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {similarComplaints.map((comp) => (
                                    <div
                                        key={comp.id}
                                        className="bg-white border border-orange-100 p-4 rounded-lg shadow-sm"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-semibold text-gray-500">
                                                {comp.publicCode}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                                {comp.status}
                                            </span>
                                        </div>
                                        <h5 className="font-semibold text-gray-900 mb-1">
                                            {comp.title}
                                        </h5>
                                        <p className="text-xs text-gray-500 mb-3">
                                            {comp.addressText}
                                        </p>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/citizen/my-complaints`,
                                                )
                                            }
                                            className="w-full py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                                        >
                                            View & Upvote
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
