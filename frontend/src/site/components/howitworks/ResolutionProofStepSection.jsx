import { AlertTriangle, CheckCircle2, FileText, Upload, Clock3 } from "lucide-react";

const auditLog = [
    { time: "09:45", text: "Resolution submitted by PWD", icon: FileText },
    { time: "09:46", text: "Proof images uploaded (2)", icon: Upload },
    { time: "09:47", text: "Status changed to pending_verification", icon: Clock3 },
];

const resolutionCards = [
    {
        title: "Authority Resolution",
        description: "Department uploads official proof of fix",
    },
    {
        title: "Volunteer Resolution",
        description: "Community members fix and document",
    },
];

export default function ResolutionProofStepSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">

                    {/* ── Left: Content ── */}
                    <div className="flex-1 flex flex-col items-start">

                        {/* Step Heading Block */}
                        <div className="border-l-2 border-[#e4e4e7] pl-5 flex flex-col gap-3 mb-2">
                            <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase">
                                04 // Proof Submission
                            </span>
                            <h2 className="font-[var(--font-satoshi)] text-4xl md:text-[44px] font-bold text-[#18181b] tracking-tight leading-[1.1]">
                                Proof uploaded. Resolution submitted.
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="font-[var(--font-inter)] mt-5 text-[17px] text-gray-500 leading-relaxed max-w-[420px]">
                            Authorities or volunteers upload before/after proof. The system creates a verification-ready state with a full public audit log.
                        </p>

                        {/* Resolution Cards */}
                        <div className="mt-10 flex flex-col gap-3 w-full max-w-[420px]">
                            {resolutionCards.map(({ title, description }) => (
                                <div
                                    key={title}
                                    className="bg-white border border-gray-200/80 rounded-2xl px-5 py-4"
                                >
                                    <p className="font-[var(--font-satoshi)] text-[14px] font-bold text-gray-900">
                                        {title}
                                    </p>
                                    <p className="font-[var(--font-inter)] text-[13px] text-gray-500 mt-1">
                                        {description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Resolution Evidence Card ── */}
                    <div className="flex-1 w-full max-w-[520px]">
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-5">

                            {/* Card Header */}
                            <div className="flex items-center justify-between gap-4">
                                <span className="font-[var(--font-satoshi)] text-[16px] font-bold text-gray-900">
                                    Resolution Evidence
                                </span>
                                <span className="font-[var(--font-inter)] text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                                    Pending Verification
                                </span>
                            </div>

                            {/* Evidence Grid */}
                            <div className="flex flex-col gap-3">
                                {/* Labels */}
                                <div className="grid grid-cols-2 gap-3">
                                    <span className="font-[var(--font-inter)] text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                                        BEFORE
                                    </span>
                                    <span className="font-[var(--font-inter)] text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                                        AFTER
                                    </span>
                                </div>

                                {/* Evidence Cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Before */}
                                    <div className="bg-gray-100/80 border border-gray-200/60 rounded-2xl flex flex-col items-center justify-center py-10 gap-3">
                                        <AlertTriangle className="w-8 h-8 text-orange-400" strokeWidth={1.75} />
                                        <span className="font-[var(--font-inter)] text-[13px] text-gray-500">
                                            Damaged road
                                        </span>
                                    </div>
                                    {/* After */}
                                    <div className="bg-emerald-50/80 border border-emerald-100/60 rounded-2xl flex flex-col items-center justify-center py-10 gap-3">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={1.75} />
                                        <span className="font-[var(--font-inter)] text-[13px] text-emerald-600">
                                            Repaired
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Audit Log Section */}
                            <div className="flex flex-col gap-3">
                                <span className="font-[var(--font-inter)] text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                                    PUBLIC AUDIT LOG
                                </span>
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 flex flex-col gap-3">
                                    {auditLog.map(({ time, text, icon: Icon }) => (
                                        <div key={time + text} className="flex items-center gap-3">
                                            <span className="font-[var(--font-geistmono)] text-[11px] text-gray-400 w-10 shrink-0">
                                                {time}
                                            </span>
                                            <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.75} />
                                            <span className="font-[var(--font-inter)] text-[13px] text-gray-700">
                                                {text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
