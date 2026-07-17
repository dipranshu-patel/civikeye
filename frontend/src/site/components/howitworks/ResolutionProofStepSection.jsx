import { Image as ImageIcon, ShieldCheck, Users } from "lucide-react";

export default function ResolutionProofStepSection() {
    return (
        <section className="relative w-full bg-[#fcfbf7] py-10 lg:py-24">
            <div className="absolute inset-0 w-full max-w-[1440px] mx-auto pointer-events-none hidden lg:block z-0">
                <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                >
                    <path
                        d="M 50 0 C 30 33, 30 66, 50 100"
                        fill="none"
                        stroke="#fed7aa"
                        strokeWidth="3"
                        strokeDasharray="8 8"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="hidden lg:flex absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 lg:w-16 lg:h-16 bg-[#fcfbf7] border-4 border-white shadow-[0_0_0_2px_#fed7aa] rounded-full items-center justify-center z-10 hover:bg-orange-500 transition-colors duration-300 group">
                <span className="font-[var(--font-satoshi)] text-xl lg:text-2xl font-bold text-orange-500 group-hover:text-white transition-colors duration-300">
                    4
                </span>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col-reverse lg:flex-row items-center lg:items-stretch">
                    {/* ── Left: Image Placeholder ── */}
                    <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center lg:justify-end lg:pr-12 xl:pr-20 pt-16 lg:pt-0">
                        <div className="relative shrink-0 w-full max-w-[480px] lg:w-full lg:max-w-[540px]">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500/10 blur-[100px] rounded-full" />

                            <div className="relative w-full h-[320px] sm:h-[360px] bg-white/70 backdrop-blur-xl rounded-2xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                                <div className="px-5 py-4 border-b border-stone-200/50 flex justify-between items-center bg-white/50 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                            <ShieldCheck className="w-4 h-4 text-orange-400" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="w-24 h-2.5 bg-stone-500 rounded-full"></div>
                                            <div className="w-16 h-1.5 bg-stone-300 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-16 h-6 bg-stone-300 rounded-full flex items-center justify-center">
                                        <div className="w-8 h-1.5 bg-white/80 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="flex-1 p-5 sm:p-6 bg-stone-50/30 flex flex-col gap-4">
                                    <div className="w-full bg-white border border-stone-200/60 rounded-xl p-3 flex items-center gap-4 shadow-sm shrink-0">
                                        <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                                            <div className="w-4 h-4 bg-stone-300 rounded-sm"></div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="w-1/3 h-2 bg-stone-400 rounded-full"></div>
                                            <div className="w-1/2 h-1.5 bg-stone-300 rounded-full"></div>
                                        </div>
                                        <div className="px-2 py-1 bg-stone-100 rounded border border-stone-200">
                                            <div className="w-8 h-1.5 bg-stone-400 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-emerald-300 group-hover:bg-emerald-50/80 transition-colors duration-500">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                                            <svg
                                                className="w-5 h-5 text-emerald-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                                />
                                            </svg>
                                        </div>
                                        <div className="w-32 h-2.5 bg-emerald-600/40 rounded-full mb-2"></div>
                                        <div className="w-24 h-1.5 bg-emerald-600/30 rounded-full"></div>

                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 z-10">
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                                                <svg
                                                    className="w-3.5 h-3.5 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <ImageIcon className="w-12 h-12 text-emerald-300 drop-shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Content ── */}
                    <div className="w-full lg:w-1/2 flex flex-col items-start justify-center lg:pl-12 xl:pl-20">
                        <div className="flex lg:hidden w-10 h-10 mb-4 bg-[#fcfbf7] border-4 border-white shadow-[0_0_0_2px_#fed7aa] rounded-full items-center justify-center">
                            <span className="font-[var(--font-satoshi)] text-lg font-bold text-orange-500">
                                4
                            </span>
                        </div>
                        <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-medium text-stone-800 tracking-tight leading-[1.1]">
                            Proof uploaded. Resolution submitted.
                        </h2>

                        <p className="font-[var(--font-inter)] mt-6 text-lg text-stone-500 leading-relaxed">
                            Authorities or volunteers upload before/after proof.
                            The system creates a verification-ready state with a
                            full public audit log showing exactly who fixed what
                            and when.
                        </p>

                        <div className="mt-10 flex flex-col gap-8 w-full max-w-[480px]">
                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-[14px] bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck
                                        className="w-6 h-6 text-orange-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-[var(--font-satoshi)] text-lg font-bold text-stone-800">
                                        Authority Resolution
                                    </h4>
                                    <p className="font-[var(--font-inter)] text-base text-stone-500 mt-1.5 leading-relaxed">
                                        Department uploads official proof of
                                        fix.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="w-12 h-12 rounded-[14px] bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <Users
                                        className="w-6 h-6 text-orange-500"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-[var(--font-satoshi)] text-lg font-bold text-stone-800">
                                        Volunteer Resolution
                                    </h4>
                                    <p className="font-[var(--font-inter)] text-base text-stone-500 mt-1.5 leading-relaxed">
                                        Community members fix and document.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
