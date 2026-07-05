import React from 'react';
import { X, Calendar } from 'lucide-react';
import clsx from 'clsx';

export default function NotificationDetailModal({ notification, onClose }) {
    if (!notification) return null;

    const formattedDate = new Date(notification.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">Notification Details</h3>
                    <button 
                        onClick={onClose}
                        className="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <div className="mb-4">
                        <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md uppercase tracking-wide mb-3">
                            {notification.type.replace(/_/g, ' ')}
                        </span>
                        <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {notification.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {formattedDate}
                        </div>
                    </div>
                    
                    <div className="prose prose-sm prose-gray max-w-none border-t border-gray-100 pt-5 mt-5">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{notification.body}</p>
                    </div>

                </div>
                
                <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
