import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    MapPin,
    Eye,
    Settings as SettingsIcon,
    Shield,
    Key,
    LogOut,
    Trash2,
    ChevronRight,
    X,
    Loader2,
} from "lucide-react";
import clsx from "clsx";
import { meService } from "../services/me.service";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../shared/store/uiSlice";

function Toggle({ enabled, onChange, disabled }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            disabled={disabled}
            onClick={() => onChange(!enabled)}
            className={clsx(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                enabled ? "bg-gray-900" : "bg-gray-200",
                disabled && "opacity-50 cursor-not-allowed",
            )}
        >
            <span
                aria-hidden="true"
                className={clsx(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    enabled ? "translate-x-5" : "translate-x-0",
                )}
            />
        </button>
    );
}

export default function Settings() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [preferences, setPreferences] = useState(null);

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle("Settings"));
        loadData();
    }, [dispatch]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await meService.getProfile();
            setProfile(res.data.data.user);
            setPreferences(res.data.data.user.preferences);
        } catch (error) {
            console.error("Failed to load profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrefChange = async (key, value) => {
        const original = { ...preferences };
        setPreferences({ ...preferences, [key]: value });
        try {
            await meService.updatePreferences({ [key]: value });
        } catch (error) {
            console.error("Failed to update preference", error);
            setPreferences(original);
        }
    };

    const [updatingLocation, setUpdatingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);

    const handleUpdateLocation = () => {
        setLocationError(null);
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }
        setUpdatingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const res = await meService.updateLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setProfile(res.data.data.user);
                } catch (error) {
                    console.error("Failed to update location:", error);
                    setLocationError(
                        "Failed to update location. Please try again.",
                    );
                } finally {
                    setUpdatingLocation(false);
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                setLocationError(
                    "Permission denied or unable to retrieve location.",
                );
                setUpdatingLocation(false);
            },
        );
    };

    const handleSignOut = () => {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!profile) return null;

    const words = profile.fullName ? profile.fullName.trim().split(/\s+/) : [];
    const initials =
        words.length >= 2
            ? (words[0][0] + words[1][0]).toUpperCase()
            : words.length === 1
              ? words[0].substring(0, 2).toUpperCase()
              : "U";

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Settings
                </h1>
                <p className="text-gray-500 mt-2">
                    Manage your civic profile, preferences, and how your
                    contributions appear on the public ledger.
                </p>
            </div>

            <section className="mb-12">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    <span>01</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Identity</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Profile
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Your public identity on CivikEye.
                </p>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-700 border border-gray-200 shrink-0">
                                {initials}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {profile.fullName}
                                    </h3>
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase tracking-wide">
                                        {profile.role}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Member since{" "}
                                    {new Date(
                                        profile.createdAt,
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditProfileOpen(true)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
                        >
                            Edit profile
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-gray-100">
                        <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                <Mail className="w-3.5 h-3.5" />
                                Email
                            </div>
                            <p className="text-gray-900 font-medium">
                                {profile.email}
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                <MapPin className="w-3.5 h-3.5" />
                                Location
                            </div>
                            <p className="text-gray-900 font-medium">
                                {profile.location
                                    ? `${profile.location.latitude.toFixed(4)}, ${profile.location.longitude.toFixed(4)}`
                                    : "Location not set"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    <span>02</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Preferences</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Public visibility
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    How your civic activity appears on the public ledger.
                </p>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
                    <div className="p-6 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Show my name on complaints
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                When off, complaints appear as Anonymous on the
                                public feed.
                            </p>
                        </div>
                        <Toggle
                            enabled={preferences?.showNameOnComplaints}
                            onChange={(val) =>
                                handlePrefChange("showNameOnComplaints", val)
                            }
                        />
                    </div>
                    <div className="p-6 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Appear on community leaderboard
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Verified contributions remain public regardless
                                of this setting.
                            </p>
                        </div>
                        <Toggle
                            enabled={preferences?.appearOnLeaderboard}
                            onChange={(val) =>
                                handlePrefChange("appearOnLeaderboard", val)
                            }
                        />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mt-6">
                    <div className="p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Location
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Determines nearby civic alerts and ward
                                    feed.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 pt-6">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                    Current Location
                                </p>
                                <p className="font-medium text-gray-900">
                                    {profile.location
                                        ? `${profile.location.latitude.toFixed(4)}, ${profile.location.longitude.toFixed(4)}`
                                        : "Location not set"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Auto-detected from device
                                </p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden sm:block">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        Permission
                                    </p>
                                    <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{" "}
                                        Granted
                                    </p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-2">
                                    <button
                                        onClick={handleUpdateLocation}
                                        disabled={updatingLocation}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                    >
                                        {updatingLocation && (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        )}
                                        Update location
                                    </button>
                                    {locationError && (
                                        <p className="text-xs font-semibold text-red-600">
                                            {locationError}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-12">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    <span>03</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Public Ledger</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Privacy & transparency
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    What stays private, and what stays publicly verifiable.
                </p>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100 mb-4">
                    <div className="p-6 flex items-center justify-between gap-4 bg-gray-50/50">
                        <div className="flex items-start gap-3">
                            <Eye className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Public ledger visibility
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Your verified complaints appear on the
                                    public CivikEye ledger.
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                            Visible
                        </span>
                    </div>
                    <div className="p-6 flex items-center justify-between gap-4 bg-gray-50/50">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Community verification
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Your volunteer efforts help resolve and
                                    verify civic issues in your community.
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            {profile.communityVerification === "verified"
                                ? "Participating"
                                : "Not Applicable"}
                        </span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="p-6 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                Show contribution history publicly
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Let others see your reports, verifications, and
                                resolutions on your public profile.
                            </p>
                        </div>
                        <Toggle
                            enabled={preferences?.showContributionHistory}
                            onChange={(val) =>
                                handlePrefChange("showContributionHistory", val)
                            }
                        />
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 px-2">
                    Your verified civic contributions remain publicly visible on
                    CivikEye to preserve accountability.
                </p>
            </section>

            <section>
                <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    <span>04</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>Account</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Account actions
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Manage credentials, export your civic activity, or close
                    your account.
                </p>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100 mb-6">
                    <button
                        onClick={() => setIsChangePasswordOpen(true)}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group text-left cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
                                <Key className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Change password
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Last updated{" "}
                                    {profile.passwordChangedAt
                                        ? new Date(
                                              profile.passwordChangedAt,
                                          ).toLocaleDateString()
                                        : "never"}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500" />
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group text-left cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-200 transition-all">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Sign out
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    End this session on this device
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500" />
                    </button>
                </div>

                <div className="bg-red-50/50 border border-red-100 rounded-2xl shadow-sm overflow-hidden">
                    <button
                        onClick={() => setIsDeleteAccountOpen(true)}
                        className="w-full p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-red-50 transition-colors text-left cursor-pointer"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0 hidden sm:flex">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-700">
                                    Delete account
                                </h3>
                                <p className="text-sm text-red-600/80 mt-0.5">
                                    Removes your private profile. Your verified
                                    public ledger contributions remain
                                    anonymized.
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-white border border-red-200 rounded-xl text-sm font-semibold text-red-600 self-start sm:self-center shrink-0 shadow-sm">
                            Delete
                        </div>
                    </button>
                </div>
            </section>

            {isEditProfileOpen && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setIsEditProfileOpen(false)}
                    onSuccess={(updated) =>
                        setProfile({ ...profile, ...updated })
                    }
                />
            )}

            {isChangePasswordOpen && (
                <ChangePasswordModal
                    onClose={() => setIsChangePasswordOpen(false)}
                />
            )}

            {isDeleteAccountOpen && (
                <DeleteAccountModal
                    onClose={() => setIsDeleteAccountOpen(false)}
                    onSuccess={handleSignOut}
                />
            )}
        </div>
    );
}

function EditProfileModal({ profile, onClose, onSuccess }) {
    const [fullName, setFullName] = useState(profile.fullName || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [emailStep, setEmailStep] = useState("idle");
    const [newEmail, setNewEmail] = useState("");
    const [otp, setOtp] = useState("");

    const handleSaveName = async (e) => {
        e.preventDefault();
        if (fullName.trim() === profile.fullName) {
            onClose();
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await meService.updateProfile({ fullName });
            onSuccess(res.data.data.user);
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.errors?.[0]?.message ||
                    err.response?.data?.message ||
                    "Failed to update profile",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRequestEmailChange = async (e) => {
        e.preventDefault();
        if (!newEmail.trim() || newEmail.trim() === profile.email) {
            setError("Please enter a different email address.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await meService.requestEmailChange(newEmail.trim());
            setEmailStep("otpSent");
        } catch (err) {
            setError(
                err.response?.data?.errors?.[0]?.message ||
                    err.response?.data?.message ||
                    "Failed to send OTP",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmEmailChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await meService.confirmEmailChange(otp.trim());
            onSuccess(res.data.data.user);
            setEmailStep("done");
            setTimeout(() => onClose(), 1500);
        } catch (err) {
            setError(
                err.response?.data?.errors?.[0]?.message ||
                    err.response?.data?.message ||
                    "Invalid OTP. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {emailStep === "otpSent"
                            ? "Verify new email"
                            : "Edit Profile"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {emailStep === "done" ? (
                    <div className="p-10 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 text-2xl">
                            ✓
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Email Updated
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Your email has been changed successfully.
                        </p>
                    </div>
                ) : emailStep === "otpSent" ? (
                    <form onSubmit={handleConfirmEmailChange} className="p-6">
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            A 6-digit code was sent to{" "}
                            <span className="font-semibold text-gray-900">
                                {newEmail}
                            </span>
                            . Enter it below to confirm your new email address.
                        </p>
                        {error && (
                            <div className="mb-5 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                                {error}
                            </div>
                        )}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value);
                                    setError(null);
                                }}
                                placeholder="000000"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all text-sm font-medium tracking-widest text-center text-xl"
                                autoFocus
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Code expires in 10 minutes.{" "}
                                <button
                                    type="button"
                                    className="text-gray-700 underline"
                                    onClick={() => {
                                        setEmailStep("enterEmail");
                                        setError(null);
                                        setOtp("");
                                    }}
                                >
                                    Use a different email
                                </button>
                            </p>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || otp.trim().length < 6}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                            >
                                {loading && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Verify & Change Email
                            </button>
                        </div>
                    </form>
                ) : emailStep === "enterEmail" ? (
                    <form onSubmit={handleRequestEmailChange} className="p-6">
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Enter your new email address. We'll send a
                            verification code to confirm you own it before
                            updating.
                        </p>
                        {error && (
                            <div className="mb-5 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                                {error}
                            </div>
                        )}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    setError(null);
                                }}
                                placeholder={profile.email}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all text-sm font-medium"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setEmailStep("idle");
                                    setError(null);
                                }}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                            >
                                {loading && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Send Verification Code
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSaveName} className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                                {error}
                            </div>
                        )}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl min-w-0">
                                <span
                                    className="text-sm font-medium text-gray-400 flex-1 truncate min-w-0"
                                    title={profile.email}
                                >
                                    {profile.email}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmailStep("enterEmail");
                                        setError(null);
                                    }}
                                    className="text-xs font-semibold text-gray-600 hover:text-gray-900 underline shrink-0 cursor-pointer"
                                >
                                    Change
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Changing email requires verification via a
                                one-time code.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                            >
                                {loading && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function ChangePasswordModal({ onClose }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await meService.changePassword({ currentPassword, newPassword });
            setSuccess(true);
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setError(
                err.response?.data?.errors?.[0]?.message ||
                    err.response?.data?.message ||
                    "Failed to change password",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Change Password
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {success ? (
                    <div className="p-10 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Key className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Password Updated
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Your password has been changed successfully.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                                {error}
                            </div>
                        )}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Current Password
                            </label>
                            <input
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all text-sm font-medium"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Must be at least 8 characters long.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                            >
                                {loading && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Update Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function DeleteAccountModal({ onClose, onSuccess }) {
    const [confirmation, setConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await meService.deleteAccount({ confirmation });
            onSuccess();
        } catch (err) {
            setError(
                err.response?.data?.errors?.[0]?.message ||
                    err.response?.data?.message ||
                    "Failed to delete account",
            );
        } finally {
            setLoading(false);
        }
    };

    const isMatch = confirmation.trim().toLowerCase() === "delete";

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative border border-red-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
                    <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Delete Account
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-100 rounded-full text-red-500 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                            Deleting your account is permanent. Your personal
                            data will be removed, but your verified civic
                            contributions will remain on the public ledger in an
                            anonymized state.
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                            Type{" "}
                            <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                delete
                            </span>{" "}
                            to confirm:
                        </p>
                        <input
                            type="text"
                            required
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            placeholder="delete"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all text-sm font-medium"
                        />
                    </div>
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !isMatch}
                            className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {loading && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Delete Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
