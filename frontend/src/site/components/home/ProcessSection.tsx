import { Camera, Users, Wrench, BadgeCheck } from "lucide-react";

const stepsData = [
    {
        id: 1,
        number: "01",
        title: "Report",
        description: "Snap a photo, drop a pin. Auto-detect duplicates within 100m so issues consolidate, not multiply.",
        icon: Camera,
    },
    {
        id: 2,
        number: "02",
        title: "Prioritize",
        description: "The community upvotes what matters most. Each issue carries a public weight and SLA timer.",
        icon: Users,
    },
    {
        id: 3,
        number: "03",
        title: "Resolve",
        description: "Authorities or vetted volunteers fix it and upload before/after proof to the public record.",
        icon: Wrench,
    },
    {
        id: 4,
        number: "04",
        title: "Verify",
        description: "Nearby citizens confirm or reject the resolution. Approvals close the loop; rejections reopen it.",
        icon: BadgeCheck,
    },
];

export default function ProcessSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-16">

                    {/* Heading */}
                    <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                        A four-step civic loop, designed<br className="hidden sm:block" /> for accountability.
                    </h2>

                    {/* Description */}
                    <p className="font-[var(--font-inter)] mt-6 text-[17px] md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        CivikEye is built around a transparent feedback cycle. No step is invisible. No outcome is unilateral.
                    </p>
                </div>

                {/* ── Steps Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {stepsData.map((step, index) => (
                        <div key={step.id} className="relative group flex">
                            {/* Card */}
                            <div className="flex-1 bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
                                <div className="flex justify-between items-start mb-8">
                                    {/* Icon Container */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-gray-100/60">
                                        <step.icon className="w-5 h-5 text-gray-700" strokeWidth={2} />
                                    </div>
                                    {/* Step Number */}
                                    <span className="font-[var(--font-geistmono)] text-xs font-semibold text-slate-400/80 tracking-widest mt-1">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="font-[var(--font-satoshi)] text-[22px] font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="font-[var(--font-inter)] text-[15px] text-gray-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Connector Line (Desktop Only) */}
                            {index < stepsData.length - 1 && (
                                <div
                                    className="hidden lg:block absolute top-[50%] -right-6 w-6 border-t border-gray-200"
                                    aria-hidden="true"
                                />
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
