import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Bell, User, PanelLeft, Trophy, Settings, LogOut } from "lucide-react";
import { toggleSidebar } from "../../store/uiSlice";
import { notificationsService } from "../../services/notifications.service";
import NotificationsDropdown from "./NotificationsDropdown";
import api from "../../lib/axios";

export default function TopNav({
    profile,
    settingsLink = "/settings",
    leaderboardLink = null,
    onProfileClick = null,
    showNotifications = true,
}) {
    const pageTitle = useSelector((state) => state.ui.pageTitle);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        if (!showNotifications) return;
        notificationsService
            .getUnreadCount()
            .then((res) => {
                setUnreadCount(res.data.data.count);
            })
            .catch(console.error);
    }, [showNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const words = profile?.fullName ? profile.fullName.trim().split(/\s+/) : [];
    const initials =
        words.length >= 2
            ? (words[0][0] + words[1][0]).toUpperCase()
            : words.length === 1
              ? words[0].substring(0, 2).toUpperCase()
              : "U";

    const handleSignOut = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
            window.location.href = "/login";
        }
    };

    return (
        <header className="h-16 bg-[#F8FAFC] border-b border-gray-200 flex items-center justify-between px-4 md:px-6 lg:px-8 xl:px-10 sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="md:hidden p-1.5 -ml-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                    <PanelLeft className="w-5 h-5" />
                </button>
                <h1 className="text-[16px] sm:text-xl font-bold text-gray-900 tracking-tight shrink-0">
                    {pageTitle}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                {leaderboardLink && (
                    <Link
                        to={leaderboardLink}
                        className="relative p-2 rounded-full text-gray-500 hover:text-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
                        title="Leaderboard"
                    >
                        <Trophy className="w-5 h-5" />
                    </Link>
                )}

                {showNotifications && (
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() =>
                                setIsNotificationsOpen(!isNotificationsOpen)
                            }
                            className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>
                        {isNotificationsOpen && (
                            <NotificationsDropdown
                                unreadCount={unreadCount}
                                onClose={() => setIsNotificationsOpen(false)}
                                onUnreadCountChange={setUnreadCount}
                            />
                        )}
                    </div>
                )}

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-medium text-sm hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        {initials}
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {profile?.fullName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {profile?.email}
                                </p>
                            </div>
                            {onProfileClick && (
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        onProfileClick();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <User className="w-4 h-4" /> My Profile
                                </button>
                            )}
                            {settingsLink && (
                                <Link
                                    to={settingsLink}
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <Settings className="w-4 h-4" /> Settings
                                </Link>
                            )}
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" /> Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
