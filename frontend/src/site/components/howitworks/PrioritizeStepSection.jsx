import { Image as ImageIcon } from "lucide-react";

export default function PrioritizeStepSection() {
    return (
        <section className="relative w-full bg-[#fcfbf7] py-24">
            <div className="absolute inset-0 w-full max-w-[1440px] mx-auto pointer-events-none hidden lg:block z-0">
                <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                >
                    <path
                        d="M 50 0 C 30 10, 10 66, 50 100"
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
                    2
                </span>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col-reverse lg:flex-row items-center lg:items-stretch">
                    {/* ── Left: Image Placeholder ── */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center lg:justify-end lg:pr-12 xl:pr-20 pt-16 lg:pt-0">
                        <div className="relative shrink-0 w-full max-w-[480px] lg:w-full lg:max-w-[540px]">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/10 blur-[100px] rounded-full" />

                            <div className="relative w-full h-[320px] sm:h-[360px] bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="w-[28%] max-w-[130px] bg-white/50 border-r border-stone-200/50 p-4 flex flex-col gap-6 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-stone-400 to-stone-500 shadow-sm flex items-center justify-center shrink-0">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                        </div>
                                        <div className="w-12 h-2.5 bg-stone-400 rounded-full"></div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="w-2/3 h-2 bg-stone-300 rounded-full ml-1"></div>
                                        <div className="w-3/4 h-2 bg-stone-300 rounded-full ml-1 mt-2"></div>
                                        <div className="w-full h-7 bg-orange-500/10 rounded-lg flex items-center px-2 mt-2">
                                            <div className="w-3 h-3 rounded-sm bg-orange-500/20 mr-2 shrink-0"></div>
                                            <div className="w-1/2 h-2 bg-orange-500 rounded-full"></div>
                                        </div>
                                        <div className="w-1/2 h-2 bg-stone-300 rounded-full ml-1 mt-2"></div>
                                    </div>
                                </div>

                                <div className="flex-1 bg-stone-50/30 p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 overflow-hidden">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="w-1/3 h-3.5 bg-stone-400 rounded-full"></div>
                                        <div className="flex gap-2 shrink-0">
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-stone-200"></div>
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-stone-400"></div>
                                        </div>
                                    </div>

                                    <div className="w-full h-9 bg-white border border-stone-200/80 rounded-xl shadow-sm flex items-center px-3 gap-2 shrink-0">
                                        <div className="w-3 h-3 rounded-full border-2 border-stone-300"></div>
                                        <div className="w-1/3 h-1.5 bg-stone-200 rounded-full"></div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="space-y-1.5">
                                            <div className="w-1/3 h-3 bg-stone-400 rounded-full"></div>
                                            <div className="w-1/2 h-1.5 bg-stone-300 rounded-full"></div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-36 sm:w-40 shrink-0 bg-white border border-stone-200/80 rounded-xl p-2.5 sm:p-3 shadow-sm flex flex-col gap-3 group-hover:-translate-y-1 transition-transform duration-500">
                                                <div className="flex justify-between items-start">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-stone-200 rounded-md"></div>
                                                    </div>
                                                    <div className="px-1.5 py-0.5 rounded-full bg-red-50 border border-red-100 flex items-center gap-1 shrink-0">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                        <div className="w-5 h-1 sm:h-1.5 bg-red-400 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="w-full h-1.5 sm:h-2 bg-stone-400 rounded-full"></div>
                                                    <div className="w-2/3 h-1.5 sm:h-2 bg-stone-400 rounded-full"></div>
                                                </div>
                                                <div className="w-full h-5 sm:h-6 bg-stone-50 border border-stone-100 rounded-md sm:rounded-lg mt-auto"></div>
                                            </div>

                                            <div className="w-36 sm:w-40 shrink-0 bg-white border border-stone-200/80 rounded-xl p-2.5 sm:p-3 shadow-sm flex flex-col gap-3 group-hover:-translate-y-1 transition-transform duration-500 delay-75">
                                                <div className="flex justify-between items-start">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-stone-200 rounded-md"></div>
                                                    </div>
                                                    <div className="px-1.5 py-0.5 rounded-full bg-red-50 border border-red-100 flex items-center gap-1 shrink-0">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                        <div className="w-5 h-1 sm:h-1.5 bg-red-400 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="w-full h-1.5 sm:h-2 bg-stone-400 rounded-full"></div>
                                                    <div className="w-3/4 h-1.5 sm:h-2 bg-stone-400 rounded-full"></div>
                                                </div>
                                                <div className="w-full h-5 sm:h-6 bg-stone-50 border border-stone-100 rounded-md sm:rounded-lg mt-auto"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Content ── */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start justify-center lg:pl-12 xl:pl-20">
                        <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-medium text-stone-800 tracking-tight leading-[1.1]">
                            Communities decide what matters most.
                        </h2>

                        <p className="font-[var(--font-inter)] mt-6 text-lg text-stone-500 leading-relaxed">
                            Citizens upvote issues publicly. Each issue carries
                            a public weight and SLA timer. No private
                            dashboards. No cherry-picked wins. Priority is
                            determined transparently by the people affected.
                        </p>

                        <div className="mt-8 bg-white border border-orange-100 rounded-2xl px-6 py-5 max-w-[480px] shadow-sm">
                            <p className="font-[var(--font-inter)] text-[15px] text-stone-600 leading-relaxed">
                                <span className="font-semibold text-orange-600">
                                    How it works:
                                </span>{" "}
                                One user = one vote. The most upvoted issues
                                naturally rise to the top of the queue, creating{" "}
                                <span className="font-semibold text-stone-800">
                                    undeniable public pressure
                                </span>{" "}
                                for resolution.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
