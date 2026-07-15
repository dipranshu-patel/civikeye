import {
    Image as ImageIcon,
    Clock,
    AlertTriangle,
    Activity,
} from "lucide-react";

export default function ResolveStepSection() {
    return (
        <section className="relative w-full bg-[#fcfbf7] py-24">
            <div className="absolute inset-0 w-full max-w-[1440px] mx-auto pointer-events-none hidden lg:block z-0">
                <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                >
                    <path
                        d="M 50 0 C 75 33, 80 66, 50 100"
                        fill="none"
                        stroke="#fed7aa"
                        strokeWidth="3"
                        strokeDasharray="8 8"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-12 h-12 lg:w-16 lg:h-16 bg-[#fcfbf7] border-4 border-white shadow-[0_0_0_2px_#fed7aa] rounded-full items-center justify-center z-10 hover:bg-orange-500 transition-colors duration-300 group">
                <span className="font-[var(--font-satoshi)] text-xl lg:text-2xl font-bold text-orange-500 group-hover:text-white transition-colors duration-300">
                    3
                </span>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-stretch">
                    {/* ── Left: Content ── */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start justify-center lg:pr-12 xl:pr-20 pb-16 lg:pb-0">
                        <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-medium text-stone-800 tracking-tight leading-[1.1]">
                            SLA countdown. Department accountability.
                        </h2>

                        <p className="font-[var(--font-inter)] mt-6 text-lg text-stone-500 leading-relaxed">
                            Every category has predefined deadlines. Pothole? 7
                            days. Streetlight? 3 days. If the deadline passes,
                            the status turns overdue — publicly marking the
                            department's delay.
                        </p>

                        <div className="mt-10 flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-[12px] bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <Clock
                                        className="w-4 h-4 text-orange-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <span className="font-[var(--font-inter)] text-base font-medium text-stone-700">
                                    Strict category-based deadlines
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-[12px] bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <AlertTriangle
                                        className="w-4 h-4 text-orange-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <span className="font-[var(--font-inter)] text-base font-medium text-stone-700">
                                    Visual markers for overdue issues
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-[12px] bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <Activity
                                        className="w-4 h-4 text-orange-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <span className="font-[var(--font-inter)] text-base font-medium text-stone-700">
                                    Department response rate tracking
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Image Placeholder ── */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center lg:justify-start lg:pl-12 xl:pl-20">
                        <div className="relative shrink-0 w-full max-w-[480px] lg:w-full lg:max-w-[540px]">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/10 blur-[100px] rounded-full" />

                            <div className="relative w-full h-[320px] sm:h-[360px] bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="w-full px-5 py-3 border-b border-stone-200/50 flex items-center justify-between bg-white/50 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-2.5 bg-stone-300 rounded-full"></div>
                                        <div className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <div className="w-10 h-1.5 bg-emerald-400 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-stone-300"></div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full flex overflow-hidden bg-stone-50/30">
                                    {/* Left Column (Details) */}
                                    <div className="flex-[1.2] p-4 sm:p-5 flex flex-col gap-4 overflow-hidden border-r border-stone-200/50">
                                        <div className="space-y-2">
                                            <div className="w-full h-3 sm:h-3.5 bg-stone-500 rounded-full"></div>
                                            <div className="w-4/5 h-3 sm:h-3.5 bg-stone-500 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center gap-2.5 mt-1">
                                            <div className="w-5 h-5 rounded-full bg-stone-200 shrink-0"></div>
                                            <div className="space-y-1.5 w-full">
                                                <div className="w-full h-1.5 bg-stone-300 rounded-full"></div>
                                                <div className="w-2/3 h-1.5 bg-stone-300 rounded-full"></div>
                                            </div>
                                        </div>

                                        <div className="w-full bg-stone-100 rounded-xl p-3 border border-stone-200/50 space-y-2 mt-1">
                                            <div className="w-1/4 h-2 bg-stone-300 rounded-full mb-1"></div>
                                            <div className="w-full h-1.5 bg-stone-400 rounded-full"></div>
                                            <div className="w-full h-1.5 bg-stone-400 rounded-full"></div>
                                            <div className="w-3/4 h-1.5 bg-stone-400 rounded-full"></div>
                                        </div>

                                        <div className="mt-auto flex gap-3 sm:gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="w-10 h-1.5 bg-stone-300 rounded-full"></div>
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-stone-200 to-stone-100 border border-stone-200/80 shadow-sm flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-stone-300 rounded-sm"></div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-end pb-4 sm:pb-5">
                                                <div className="w-3 h-0.5 bg-stone-200 rounded-full"></div>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <div className="w-12 h-1.5 bg-emerald-200 rounded-full"></div>
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100/80 shadow-sm flex items-center justify-center relative">
                                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white"></div>
                                                    <div className="w-4 h-4 bg-emerald-200 rounded-sm"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column (Timeline) */}
                                    <div className="flex-1 p-4 sm:p-5 flex flex-col gap-0 overflow-hidden">
                                        <div className="w-3/4 h-2.5 bg-stone-500 rounded-full mb-4"></div>

                                        <div className="relative flex-1">
                                            <div className="absolute left-[9px] top-2 bottom-4 w-0.5 bg-stone-200"></div>

                                            <div className="flex flex-col gap-4 sm:gap-5">
                                                <div className="relative pl-6">
                                                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                                                    </div>
                                                    <div className="space-y-1.5 pt-1">
                                                        <div className="w-2/3 h-1.5 bg-stone-400 rounded-full"></div>
                                                        <div className="w-1/3 h-1.5 bg-stone-300 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="relative pl-6">
                                                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center z-10">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                                    </div>
                                                    <div className="space-y-1.5 pt-1">
                                                        <div className="w-1/2 h-1.5 bg-stone-400 rounded-full"></div>
                                                        <div className="w-2/5 h-1.5 bg-stone-300 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="relative pl-6">
                                                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center z-10">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                                    </div>
                                                    <div className="space-y-1.5 pt-1">
                                                        <div className="w-3/4 h-1.5 bg-stone-400 rounded-full"></div>
                                                        <div className="w-full h-8 sm:h-10 bg-stone-100 rounded-lg mt-2 border border-stone-200/50 p-2 flex flex-col gap-1.5">
                                                            <div className="w-full h-1.5 bg-stone-300 rounded-full"></div>
                                                            <div className="w-2/3 h-1.5 bg-stone-300 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="relative pl-6 group-hover:-translate-y-0.5 transition-transform">
                                                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center z-10">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                    </div>
                                                    <div className="space-y-1.5 pt-1">
                                                        <div className="w-1/2 h-1.5 bg-stone-500 rounded-full"></div>
                                                        <div className="w-1/3 h-1.5 bg-stone-300 rounded-full"></div>
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
            </div>
        </section>
    );
}
