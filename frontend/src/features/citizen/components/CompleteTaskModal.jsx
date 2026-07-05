import { useState, useRef } from 'react';
import { X, Upload, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export default function CompleteTaskModal({ task, onClose, onSubmit }) {
    const [note, setNote] = useState("");
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const fileInputRef = useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const url = URL.createObjectURL(file);
            setPhotoPreview(url);
        }
    };

    const handleClearPhoto = (e) => {
        e.stopPropagation();
        setPhoto(null);
        if (photoPreview) URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!photo) {
            setError("A proof photo is required to complete this task.");
            return;
        }

        const formData = new FormData();
        formData.append("proof", photo);
        if (note.trim()) {
            formData.append("note", note.trim());
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to submit completion.");
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={!isSubmitting ? onClose : undefined}
        >
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Complete Task</h2>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5 font-mono">{task.publicCode}</p>
                    </div>
                    <button 
                        onClick={!isSubmitting ? onClose : undefined}
                        disabled={isSubmitting}
                        className="w-8 h-8 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">{task.title}</h3>
                        <p className="text-xs text-gray-500">{task.addressText}</p>
                    </div>

                    <form id="complete-task-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Proof Photo Upload */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Proof Photo <span className="text-red-500">*</span>
                            </label>
                            
                            <div 
                                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                className={clsx(
                                    "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden relative group",
                                    !photoPreview ? "border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer h-40" : "border-gray-200 h-64 cursor-pointer"
                                )}
                            >
                                {photoPreview ? (
                                    <>
                                        <img src={photoPreview} alt="Proof" className="w-full h-full object-cover" />
                                        {!isSubmitting && (
                                            <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    type="button"
                                                    onClick={handleClearPhoto}
                                                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center px-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mx-auto mb-3">
                                            <Upload className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">Upload proof of completion</p>
                                        <p className="text-xs text-gray-500 mt-1">Tap to browse files</p>
                                    </div>
                                )}
                                
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Note Area */}
                        <div>
                            <label htmlFor="note" className="block text-sm font-bold text-gray-900 mb-2">
                                Completion Note (Optional)
                            </label>
                            <textarea
                                id="note"
                                rows="3"
                                placeholder="Describe what you fixed or any issues you encountered..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all text-sm resize-none disabled:opacity-50"
                            ></textarea>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium flex gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}
                    </form>
                </div>

                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="complete-task-form"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-gray-900/10 flex items-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Submit Completion
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
