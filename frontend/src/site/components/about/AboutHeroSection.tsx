import { Lock, EyeOff, Eye } from "lucide-react";

const closedComplaints = [
    { id: "#4821" },
    { id: "#4822" },
    { id: "#4823" },
];

interface PublicComplaint {
    id: string;
    status: string;
    statusClass: string;
    iconClass: string;
}

const publicComplaints: PublicComplaint[] = [
    { id: "#4821", status: "Resolved", statusClass: "text-emerald-600", iconClass: "text-emerald-500" },
    { id: "#4822", status: "In progress", statusClass: "text-blue-600", iconClass: "text-blue-500" },
    { id: "#4823", status: "Overdue", statusClass: "text-orange-600", iconClass: "text-orange-500" },
];

export default function AboutHeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#F8FAFC] pt-24 pb-20">
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

                {/* ── Main Heading ── */}
                <h1 className="font-[var(--font-satoshi)] text-5xl md:text-6xl lg:text-[72px] font-bold text-center tracking-tight leading-[1.05]">
                    <span className="block text-gray-900">Public problems</span>
                    <span className="block text-gray-400 mt-1">deserve public visibility.</span>
                </h1>

                {/* ── Description ── */}
                <p className="font-[var(--font-inter)] mt-7 text-base md:text-[18px] text-gray-500 max-w-[600px] text-center leading-relaxed">
                    CivikEye exists because civic systems fail when accountability disappears. We are
                    building the public ledger for city issues — visible, verifiable, and time-bound by design.
                </p>

                {/* ── Comparison Cards ── */}
                <div className="mt-16 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* ── Left Card: Closed System ── */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] flex flex-col gap-5">
                        {/* Card Header */}
                        <div className="flex flex-col gap-2">
                            <span className="font-[var(--font-inter)] text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                Before
                            </span>
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 shrink-0">
                                    <Lock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                </div>
                                <span className="font-[var(--font-satoshi)] text-[16px] font-bold text-gray-800">
                                    Closed system
                                </span>
                            </div>
                        </div>

                        {/* Complaint List */}
                        <div className="flex flex-col gap-2">
                            {closedComplaints.map(({ id }) => (
                                <div
                                    key={id}
                                    className="flex items-center justify-between bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-2.5"
                                >
                                    <span className="font-[var(--font-geistmono)] text-[13px] text-gray-500">
                                        Complaint {id}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <EyeOff className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
                                        <span className="font-[var(--font-inter)] text-[12px] text-gray-400">
                                            Hidden
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Right Card: Public Ledger ── */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] flex flex-col gap-5">
                        {/* Card Header */}
                        <div className="flex flex-col gap-2">
                            <span className="font-[var(--font-inter)] text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
                                CivikEye
                            </span>
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 shrink-0">
                                    <Lock className="w-4 h-4 text-emerald-500" strokeWidth={2} />
                                </div>
                                <span className="font-[var(--font-satoshi)] text-[16px] font-bold text-gray-900">
                                    Public ledger
                                </span>
                            </div>
                        </div>

                        {/* Complaint List */}
                        <div className="flex flex-col gap-2">
                            {publicComplaints.map(({ id, status, statusClass, iconClass }) => (
                                <div
                                    key={id}
                                    className="flex items-center justify-between bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-2.5"
                                >
                                    <span className="font-[var(--font-geistmono)] text-[13px] text-gray-700 font-medium">
                                        Complaint {id}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className={`w-3.5 h-3.5 ${iconClass}`} strokeWidth={1.75} />
                                        <span className={`font-[var(--font-inter)] text-[12px] font-semibold ${statusClass}`}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
