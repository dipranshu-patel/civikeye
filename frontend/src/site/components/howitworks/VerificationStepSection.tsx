import { CheckCircle2, XCircle } from "lucide-react";

const avatars = ["A", "B", "C", "D", "E", "F", "G", "H"];

export default function VerificationStepSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Top: Header ── */}
                <div className="flex flex-col items-center text-center mb-14">
                    {/* Step Heading Block */}
                    <div className="pl-5 flex flex-col gap-3 mb-7 text-left">
                        <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase mx-auto">
                            05 // Peer Verification
                        </span>
                        <h2 className="font-[var(--font-satoshi)] text-4xl md:text-[48px] font-bold text-[#18181b] tracking-tight leading-[1.1]">
                            Nearby citizens verify the fix.
                        </h2>
                    </div>

                    <p className="font-[var(--font-inter)] mt-5 text-[17px] text-gray-500 leading-relaxed max-w-2xl">
                        Only users within 2km can vote. Approve or reject. If rejected, the issue
                        reopens.{" "}
                        <span className="font-bold text-gray-700">
                            Authorities cannot silently close complaints.
                        </span>
                    </p>
                </div>

                {/* ── Content: Two Columns ── */}
                <div className="flex flex-col lg:flex-row items-stretch gap-6 max-w-5xl mx-auto">

                    {/* ── Left: Community Verification Card ── */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-6 h-full flex flex-col gap-5">

                            {/* Card Header */}
                            <div className="flex items-center justify-between">
                                <span className="font-[var(--font-satoshi)] text-[15px] font-bold text-gray-900">
                                    Community Verification
                                </span>
                                <span className="font-[var(--font-inter)] text-[13px] text-gray-400">
                                    2km radius
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-col gap-1">
                                <span className="font-[var(--font-geistmono)] text-[44px] font-bold text-emerald-500 leading-none">
                                    14
                                </span>
                                <div className="flex items-center justify-between">
                                    <span className="font-[var(--font-inter)] text-[13px] text-gray-500">
                                        of 16 nearby citizens
                                    </span>
                                    <span className="font-[var(--font-geistmono)] text-[15px] font-bold text-emerald-500">
                                        87.5%
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: "87.5%" }}
                                />
                            </div>

                            {/* Voting Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button className="inline-flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 font-[var(--font-inter)] text-[13px] font-semibold rounded-xl py-3 hover:bg-emerald-100 transition-colors duration-150">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" strokeWidth={2} />
                                    Approve Fix
                                </button>
                                <button className="inline-flex items-center justify-center gap-2 bg-red-50 border border-red-100 text-red-600 font-[var(--font-inter)] text-[13px] font-semibold rounded-xl py-3 hover:bg-red-100 transition-colors duration-150">
                                    <XCircle className="w-4 h-4 text-red-500" strokeWidth={2} />
                                    Still Broken
                                </button>
                            </div>

                            {/* Recent Verifications */}
                            <div className="flex flex-col gap-3">
                                <span className="font-[var(--font-inter)] text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                                    Recent Verifications
                                </span>
                                <div className="flex items-center">
                                    {avatars.map((letter, i) => (
                                        <div
                                            key={letter}
                                            className={`w-8 h-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center shrink-0 ${i > 0 ? "-ml-2" : ""}`}
                                        >
                                            <span className="font-[var(--font-inter)] text-[12px] font-semibold text-gray-500">
                                                {letter}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-gray-900 ring-2 ring-white -ml-2 flex items-center justify-center shrink-0">
                                        <span className="font-[var(--font-inter)] text-[11px] font-bold text-white">
                                            +6
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Right: Decision Cards + Banner ── */}
                    <div className="flex-1 flex flex-col gap-4">

                        {/* Approve Card */}
                        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 flex flex-col gap-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" strokeWidth={2} />
                            <p className="font-[var(--font-satoshi)] text-[16px] font-bold text-gray-900">
                                Approve &gt; Reject
                            </p>
                            <p className="font-[var(--font-inter)] text-[14px] text-gray-500 leading-relaxed">
                                Issue is marked as{" "}
                                <span className="font-semibold text-emerald-600">VERIFIED</span>{" "}
                                and closed permanently with full public record.
                            </p>
                        </div>

                        {/* Reject Card */}
                        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 flex flex-col gap-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                            <XCircle className="w-7 h-7 text-red-500" strokeWidth={2} />
                            <p className="font-[var(--font-satoshi)] text-[16px] font-bold text-gray-900">
                                Reject &gt; Approve
                            </p>
                            <p className="font-[var(--font-inter)] text-[14px] text-gray-500 leading-relaxed">
                                Issue is{" "}
                                <span className="font-semibold text-red-500">REOPENED</span>{" "}
                                automatically. Department accountability resets. Public record shows rejection.
                            </p>
                        </div>

                        {/* Info Banner */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                            <p className="font-[var(--font-inter)] text-[13px] text-blue-700 leading-relaxed">
                                <span className="font-semibold">No silent closures.</span>{" "}
                                Every resolution attempt is publicly recorded and community-verified.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
