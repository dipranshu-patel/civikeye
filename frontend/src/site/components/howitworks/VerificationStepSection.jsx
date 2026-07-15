import { Image as ImageIcon, Check, X } from "lucide-react";

export default function VerificationStepSection() {
    return (
        <section className="relative w-full bg-[#fcfbf7] py-24 pb-32">
            <div className="absolute inset-0 w-full max-w-[1440px] mx-auto pointer-events-none hidden lg:block z-0">
                <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                >
                    <path
                        d="M 50 0 C 70 33, 70 66, 60 70"
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
                    5
                </span>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-stretch">
                    {/* ── Left: Content ── */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start justify-center lg:pr-12 xl:pr-20 pb-16 lg:pb-0">
                        <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-medium text-stone-800 tracking-tight leading-[1.1]">
                            Nearby citizens verify the fix.
                        </h2>

                        <p className="font-[var(--font-inter)] mt-6 text-lg text-stone-500 leading-relaxed">
                            Only users within 2km can vote. Approve or reject.
                            If rejected, the issue reopens.{" "}
                            <span className="font-semibold text-stone-800">
                                Authorities cannot silently close complaints.
                            </span>{" "}
                            Every resolution attempt is community-verified.
                        </p>

                        <div className="mt-10 flex flex-col gap-8 w-full max-w-[480px]">
                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-[14px] bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                    <Check
                                        className="w-6 h-6 text-emerald-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-[var(--font-satoshi)] text-lg font-bold text-stone-800">
                                        Majority Approves
                                    </h4>
                                    <p className="font-[var(--font-inter)] text-base text-stone-500 mt-1.5 leading-relaxed">
                                        Issue is marked as verified and closed
                                        permanently with a full public record.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-[14px] bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                    <X
                                        className="w-6 h-6 text-red-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-[var(--font-satoshi)] text-lg font-bold text-stone-800">
                                        Majority Rejects
                                    </h4>
                                    <p className="font-[var(--font-inter)] text-base text-stone-500 mt-1.5 leading-relaxed">
                                        Issue is reopened automatically.
                                        Accountability resets. Record shows
                                        rejection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Image Placeholder ── */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center lg:justify-start lg:pl-12 xl:pl-20">
                        <div className="relative shrink-0 w-full max-w-[480px] lg:w-full lg:max-w-[540px]">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/10 blur-[100px] rounded-full" />

                            <div className="relative w-full h-[320px] sm:h-[360px] bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="px-5 py-4 border-b border-stone-200/50 flex justify-between items-center bg-white/50 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                            <Check
                                                className="w-4 h-4 text-emerald-500"
                                                strokeWidth={3}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="w-32 h-2.5 bg-stone-500 rounded-full"></div>
                                            <div className="w-20 h-1.5 bg-stone-300 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-16 h-6 bg-stone-300 rounded-full flex items-center justify-center">
                                        <div className="w-8 h-1.5 bg-white/80 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="flex-1 p-5 sm:p-6 bg-stone-50/30 flex flex-col justify-between">
                                    <div className="flex justify-center gap-4 sm:gap-6 mt-2">
                                        <div className="flex flex-col gap-2 items-center">
                                            <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl bg-gradient-to-br from-stone-200 to-stone-100 border border-stone-200/80 shadow-sm flex items-center justify-center relative overflow-hidden">
                                                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/80 backdrop-blur-sm rounded flex items-center justify-center">
                                                    <div className="w-6 h-1 bg-stone-400 rounded-full"></div>
                                                </div>
                                                <div className="w-6 h-6 bg-stone-300 rounded-md"></div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 items-center">
                                            <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100/80 shadow-sm flex items-center justify-center relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-500">
                                                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/80 backdrop-blur-sm rounded flex items-center justify-center">
                                                    <div className="w-6 h-1 bg-emerald-500 rounded-full"></div>
                                                </div>
                                                <div className="w-6 h-6 bg-emerald-200 rounded-md"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full bg-white rounded-xl border border-stone-200/60 p-2 sm:p-3 shadow-sm flex gap-3">
                                        <div className="flex-1 h-10 sm:h-12 rounded-lg border-2 border-rose-100 bg-rose-50 flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-100 transition-colors">
                                            <X
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500"
                                                strokeWidth={2.5}
                                            />
                                            <div className="w-12 sm:w-16 h-2 bg-rose-300 rounded-full"></div>
                                        </div>

                                        <div className="flex-1 h-10 sm:h-12 rounded-lg border-2 border-emerald-400 bg-emerald-500 flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40">
                                            <Check
                                                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                                                strokeWidth={2.5}
                                            />
                                            <div className="w-12 sm:w-16 h-2 bg-white/90 rounded-full"></div>
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
