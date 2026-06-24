import { Clock3, Building2, Activity, AlertTriangle } from "lucide-react";

const countdownUnits = [
    { value: "02", label: "Days" },
    { value: "11", label: "Hours" },
    { value: "58", label: "Minutes" },
];

const timeline = [
    { label: "Reported", meta: "2 days ago", status: "done" },
    { label: "Assigned", meta: "1 day ago", status: "done" },
    { label: "In Progress", meta: "Current", status: "active" },
    { label: "Pending Verification", meta: "—", status: "pending" },
];

export default function ResolveStepSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Top: Header ── */}
                <div className="flex flex-col items-center text-center mb-14">
                    {/* Step Heading Block */}
                    <div className="pl-5 flex flex-col gap-3 mb-7 text-left">
                        <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase mx-auto">
                            03 // SLA Countdown
                        </span>
                        <h2 className="font-[var(--font-satoshi)] text-4xl md:text-[48px] font-bold text-[#18181b] tracking-tight leading-[1.1]">
                            SLA countdown. Department accountability.
                        </h2>
                    </div>

                    {/* Description */}
                    <p className="font-[var(--font-inter)] mt-5 text-[17px] text-gray-500 leading-relaxed max-w-2xl">
                        Every category has predefined deadlines. Pothole? 7 days. Streetlight? 3 days.{" "}
                        If the deadline passes, the status turns overdue — publicly.
                    </p>
                </div>

                {/* ── Main Dashboard Card ── */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-8 flex flex-col gap-6">

                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-[var(--font-inter)] text-[12px] text-gray-400 uppercase tracking-widest mb-1">
                                Active Issue
                            </p>
                            <p className="font-[var(--font-satoshi)] text-[22px] font-bold text-gray-900">
                                Broken streetlight cluster
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 shrink-0">
                            <Clock3 className="w-3.5 h-3.5 text-orange-500" strokeWidth={2} />
                            <span className="font-[var(--font-inter)] text-[12px] font-semibold text-orange-600">
                                SLA Active
                            </span>
                        </div>
                    </div>

                    {/* Countdown Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {countdownUnits.map(({ value, label }) => (
                            <div
                                key={label}
                                className="flex flex-col items-center justify-center bg-gray-50/80 border border-gray-100 rounded-2xl py-6"
                            >
                                <span className="font-[var(--font-geistmono)] text-[40px] font-bold text-gray-900 leading-none tracking-tight">
                                    {value}
                                </span>
                                <span className="font-[var(--font-inter)] text-[13px] text-gray-400 mt-2">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Department Card */}
                        <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                                <span className="font-[var(--font-inter)] text-[12px] text-gray-400">
                                    Assigned Department
                                </span>
                            </div>
                            <p className="font-[var(--font-satoshi)] text-[18px] font-bold text-gray-900 -mt-1">
                                Public Works Department
                            </p>
                            <div className="flex items-center gap-6">
                                <div>
                                    <p className="font-[var(--font-inter)] text-[11px] text-gray-400 mb-1">
                                        Response Rate
                                    </p>
                                    <p className="font-[var(--font-geistmono)] text-[16px] font-bold text-emerald-500">
                                        94.2%
                                    </p>
                                </div>
                                <div>
                                    <p className="font-[var(--font-inter)] text-[11px] text-gray-400 mb-1">
                                        Avg. Resolution
                                    </p>
                                    <p className="font-[var(--font-geistmono)] text-[16px] font-bold text-gray-800">
                                        3.4d
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Card */}
                        <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                                <span className="font-[var(--font-inter)] text-[12px] text-gray-400">
                                    Status Timeline
                                </span>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {timeline.map(({ label, meta, status }) => (
                                    <li key={label} className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className={`w-2 h-2 rounded-full shrink-0 ${
                                                    status === "done"
                                                        ? "bg-emerald-500"
                                                        : status === "active"
                                                        ? "bg-blue-500"
                                                        : "bg-gray-200"
                                                }`}
                                                aria-hidden="true"
                                            />
                                            <span
                                                className={`font-[var(--font-inter)] text-[13px] ${
                                                    status === "active"
                                                        ? "font-semibold text-gray-900"
                                                        : status === "pending"
                                                        ? "text-gray-400"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {label}
                                            </span>
                                        </div>
                                        <span className="font-[var(--font-geistmono)] text-[11px] text-gray-400 shrink-0">
                                            {meta}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Warning Banner */}
                    <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" strokeWidth={2} />
                        <p className="font-[var(--font-inter)] text-[13px] text-red-600 leading-snug">
                            If unresolved by deadline, this issue will be marked{" "}
                            <span className="font-bold">OVERDUE</span> publicly
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
