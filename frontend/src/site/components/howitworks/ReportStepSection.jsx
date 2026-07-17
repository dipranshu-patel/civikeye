import { Image as ImageIcon, MapPin, Copy, Camera } from "lucide-react";

export default function ReportStepSection() {
    return (
        <section className="relative w-full bg-[#fcfbf7] py-10 lg:py-24">
            <div className="absolute inset-0 w-full max-w-[1440px] mx-auto pointer-events-none hidden lg:block z-0">
                <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                >
                    <path
                        d="M 48 15 C 70 20, 85 80, 50 100"
                        fill="none"
                        stroke="#fed7aa"
                        strokeWidth="3"
                        strokeDasharray="8 8"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="hidden lg:flex absolute top-[15%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 bg-[#fcfbf7] border-4 border-white shadow-[0_0_0_2px_#fed7aa] rounded-full items-center justify-center z-20 hover:bg-orange-500 transition-colors duration-300 group">
                <span className="font-[var(--font-satoshi)] text-xl lg:text-2xl font-bold text-orange-500 group-hover:text-white transition-colors duration-300">
                    1
                </span>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-stretch">
                    {/* ── Left: Content ── */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start justify-center lg:pr-12 xl:pr-20 pb-16 lg:pb-0">
                        <div className="flex lg:hidden w-10 h-10 mb-4 bg-[#fcfbf7] border-4 border-white shadow-[0_0_0_2px_#fed7aa] rounded-full items-center justify-center">
                            <span className="font-[var(--font-satoshi)] text-lg font-bold text-orange-500">
                                1
                            </span>
                        </div>
                        <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-medium text-stone-800 tracking-tight leading-[1.1]">
                            A citizen reports a pothole.
                        </h2>

                        <p className="font-[var(--font-inter)] mt-6 text-lg text-stone-500 leading-relaxed">
                            Snap a photo, drop an address. The system
                            auto-detects duplicates within 100m so issues
                            consolidate, not multiply. Every report is instantly
                            public, capturing GPS data and details without
                            bureaucratic friction.
                        </p>

                        <div className="mt-10 flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-[12px] bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <MapPin
                                        className="w-4 h-4 text-orange-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <span className="font-[var(--font-inter)] text-base font-medium text-stone-700">
                                    GPS location captured automatically
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-[12px] bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <Copy
                                        className="w-4 h-4 text-orange-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <span className="font-[var(--font-inter)] text-base font-medium text-stone-700">
                                    Smart duplicate detection within 100m
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-[12px] bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <Camera
                                        className="w-4 h-4 text-orange-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <span className="font-[var(--font-inter)] text-base font-medium text-stone-700">
                                    Requires photo evidence of the issue
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Image Placeholder ── */}
                    <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center lg:justify-start lg:pl-12 xl:pl-20">
                        <div className="relative shrink-0 w-full max-w-[480px] lg:w-full lg:max-w-[540px]">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/10 blur-[100px] rounded-full" />

                            <div className="relative w-full h-[320px] sm:h-[360px] bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="flex-1 w-full flex p-4 sm:p-5 gap-4 sm:gap-6 overflow-hidden bg-stone-50/30">
                                    {/* Left: Form */}
                                    <div className="flex-1 flex flex-col gap-5">
                                        <div className="space-y-2.5">
                                            <div className="w-1/3 h-2.5 bg-stone-300 rounded-full"></div>
                                            <div className="w-full h-10 bg-white border border-stone-200/80 rounded-xl shadow-sm flex items-center px-3">
                                                <div className="w-2/3 h-2 bg-stone-100 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <div className="w-1/2 h-2.5 bg-stone-300 rounded-full"></div>
                                            <div className="w-full h-24 bg-white border border-stone-200/80 rounded-xl shadow-sm p-3 flex flex-col gap-2">
                                                <div className="w-3/4 h-2 bg-stone-100 rounded-full"></div>
                                                <div className="w-1/2 h-2 bg-stone-100 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="mt-auto w-full h-11 bg-orange-50 rounded-xl border border-orange-100/50 flex items-center justify-center">
                                            <div className="w-1/3 h-2.5 bg-orange-200 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Right: Live Preview */}
                                    <div className="flex-[1.2] bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-200/50 flex flex-col overflow-hidden relative">
                                        <div className="px-3 py-2.5 border-b border-stone-50 flex items-center justify-between bg-stone-50/50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                <div className="w-16 h-2 bg-stone-300 rounded-full"></div>
                                            </div>
                                            <div className="w-8 h-4 bg-orange-50 rounded-full flex items-center justify-center">
                                                <div className="w-4 h-1.5 bg-orange-200 rounded-full"></div>
                                            </div>
                                        </div>

                                        <div className="w-full h-28 sm:h-32 bg-gradient-to-br from-stone-50 to-orange-50/50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlN2U1ZTQiLz48L3N2Zz4=')] opacity-50"></div>
                                            <ImageIcon className="w-10 h-10 text-orange-200 relative z-10 drop-shadow-sm" />
                                        </div>

                                        <div className="p-4 flex flex-col gap-3.5 bg-white relative z-10">
                                            <div className="w-3/4 h-3.5 bg-stone-400 rounded-full"></div>
                                            <div className="space-y-2">
                                                <div className="w-full h-2 bg-stone-200 rounded-full"></div>
                                                <div className="w-4/5 h-2 bg-stone-200 rounded-full"></div>
                                            </div>

                                            <div className="w-full p-2.5 bg-stone-50 rounded-xl mt-1 border border-stone-100 flex items-center gap-2.5">
                                                <div className="w-7 h-7 shrink-0 rounded-full bg-orange-50 flex items-center justify-center">
                                                    <MapPin className="w-3.5 h-3.5 text-orange-300" />
                                                </div>
                                                <div className="flex-1 space-y-1.5">
                                                    <div className="w-1/2 h-2 bg-stone-300 rounded-full"></div>
                                                    <div className="w-1/3 h-1.5 bg-stone-200 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
