import { MapPin, Globe, Eye, AlertTriangle, Upload, Circle } from "lucide-react";

const features = [
    { icon: MapPin, text: "GPS location captured automatically" },
    { icon: Globe, text: "Report in any supported language" },
    { icon: Eye, text: "Instantly visible on public map" },
];

export default function ReportStepSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

                    {/* ── Left: Content ── */}
                    <div className="flex-1 flex flex-col items-start">

                        {/* Step Heading Block */}
                        <div className="border-l-2 border-[#e4e4e7] pl-5 flex flex-col gap-3 mb-2">
                            <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase">
                                01 // Intake Signal
                            </span>
                            <h2 className="font-[var(--font-satoshi)] text-4xl md:text-[44px] font-bold text-[#18181b] tracking-tight leading-[1.1]">
                                A citizen reports a pothole.
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="font-[var(--font-inter)] mt-5 text-[17px] text-gray-500 leading-relaxed max-w-[420px]">
                            Snap a photo, drop a pin. The system auto-detects duplicates within 100m so issues consolidate, not multiply. Every report is instantly public.
                        </p>

                        {/* Feature List */}
                        <ul className="mt-10 flex flex-col gap-6" role="list">
                            {features.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-100 shadow-sm shrink-0">
                                        <Icon className="w-4 h-4 text-gray-500" strokeWidth={1.75} />
                                    </div>
                                    <span className="font-[var(--font-inter)] text-[15px] text-gray-700">
                                        {text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Right: Issue Preview Card ── */}
                    <div className="flex-1 w-full max-w-[520px]">
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-4">

                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-orange-500" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="font-[var(--font-satoshi)] text-[15px] font-bold text-gray-900 leading-tight">
                                            Pothole on Main Street
                                        </p>
                                        <p className="font-[var(--font-inter)] text-[13px] text-gray-400 mt-0.5">
                                            Roads &amp; Infrastructure
                                        </p>
                                    </div>
                                </div>
                                <span className="font-[var(--font-inter)] text-[11px] font-bold tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase shrink-0">
                                    NEW
                                </span>
                            </div>

                            {/* Image Upload Area */}
                            <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center justify-center py-20 gap-3">
                                <Upload className="w-7 h-7 text-gray-300" strokeWidth={1.5} />
                                <span className="font-[var(--font-inter)] text-[13px] text-gray-400">
                                    pothole_img_001.jpg
                                </span>
                            </div>

                            {/* Metadata Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100/80">
                                    <p className="font-[var(--font-inter)] text-[11px] text-gray-400 mb-1">Issue ID</p>
                                    <p className="font-[var(--font-geistmono)] text-[15px] font-semibold text-gray-800 tracking-wide">
                                        #CE-2847
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100/80">
                                    <p className="font-[var(--font-inter)] text-[11px] text-gray-400 mb-1">Reported</p>
                                    <p className="font-[var(--font-satoshi)] text-[15px] font-semibold text-gray-800">
                                        Just now
                                    </p>
                                </div>
                            </div>

                            {/* Tags Row */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 font-[var(--font-inter)] text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                                    <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" strokeWidth={0} />
                                    Public
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-[var(--font-inter)] text-[12px] font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                                    <Globe className="w-3 h-3 text-gray-400" strokeWidth={1.75} />
                                    English
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-[var(--font-inter)] text-[12px] font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                                    <AlertTriangle className="w-3 h-3 text-gray-400" strokeWidth={1.75} />
                                    Authority Required
                                </span>
                            </div>

                            {/* Bottom Alert */}
                            <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                                <Circle className="w-2 h-2 fill-blue-500 text-blue-500 shrink-0" strokeWidth={0} />
                                <span className="font-[var(--font-inter)] text-[13px] font-medium text-blue-700">
                                    2 similar complaints within 100m detected
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
