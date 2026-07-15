import React, { useState, useEffect } from "react";
import { CheckCheck, Loader2, Bell, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { notificationsService } from "../../services/notifications.service";
import NotificationDetailModal from "./NotificationDetailModal";

export default function NotificationsDropdown({
    onClose,
    onUnreadCountChange,
    unreadCount,
}) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        loadNotifications(1);
    }, []);

    const loadNotifications = async (pageNumber) => {
        try {
            if (pageNumber === 1) setLoading(true);
            const res = await notificationsService.listNotifications({
                page: pageNumber,
                limit: 10,
            });
            const data = res.data.data;
            if (pageNumber === 1) {
                setNotifications(data.notifications);
            } else {
                setNotifications((prev) => [...prev, ...data.notifications]);
            }
            setHasMore(data.hasMore);
            setPage(pageNumber);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationsService.markAllRead();
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true })),
            );
            if (onUnreadCountChange) onUnreadCountChange(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const handleNotificationClick = async (notif) => {
        setSelectedNotification(notif);
        if (!notif.isRead) {
            try {
                await notificationsService.markOneRead(notif.id);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notif.id ? { ...n, isRead: true } : n,
                    ),
                );
                const res = await notificationsService.getUnreadCount();
                if (onUnreadCountChange)
                    onUnreadCountChange(Number(res.data.data.count) || 0);
            } catch (error) {
                console.error("Failed to mark as read:", error);
            }
        }
    };

    return (
        <>
            <div className="absolute right-[-44px] sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[380px] bg-slate-50/95 sm:bg-white backdrop-blur-md sm:backdrop-blur-none rounded-2xl shadow-2xl sm:shadow-xl border border-gray-200/50 sm:border-gray-100 flex flex-col z-50 overflow-hidden max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-80px)]">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gray-900" />
                        <h3 className="font-bold text-gray-900">
                            Notifications
                        </h3>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading && page === 1 ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                                <Bell className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-gray-900 font-medium">
                                No notifications yet
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                We'll let you know when there's an update.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-gray-100">
                            {notifications.map((notif) => (
                                <button
                                    key={notif.id}
                                    onClick={() =>
                                        handleNotificationClick(notif)
                                    }
                                    className={clsx(
                                        "w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 cursor-pointer group",
                                        !notif.isRead ? "bg-blue-50/30" : "",
                                    )}
                                >
                                    <div className="relative shrink-0 mt-1">
                                        <div
                                            className={clsx(
                                                "w-2 h-2 rounded-full",
                                                !notif.isRead
                                                    ? "bg-blue-500"
                                                    : "bg-transparent",
                                            )}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={clsx(
                                                "text-sm mb-1 truncate",
                                                !notif.isRead
                                                    ? "font-semibold text-gray-900"
                                                    : "font-medium text-gray-700",
                                            )}
                                        >
                                            {notif.title}
                                        </p>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {notif.body}
                                        </p>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-2">
                                            {new Date(
                                                notif.createdAt,
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 shrink-0 mt-1 transition-colors" />
                                </button>
                            ))}
                            {hasMore && (
                                <button
                                    onClick={() => loadNotifications(page + 1)}
                                    className="p-4 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer text-center"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                    ) : (
                                        "Load more"
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedNotification && (
                <NotificationDetailModal
                    notification={selectedNotification}
                    onClose={() => setSelectedNotification(null)}
                />
            )}
        </>
    );
}
