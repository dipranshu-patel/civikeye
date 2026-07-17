export default function ProcessSection() {
    const steps = [
        {
            title: "Report",
            desc: "Snap a photo, drop an address. Auto-detect duplicates within 100m so issues consolidate, not multiply.",
        },
        {
            title: "Prioritize",
            desc: "The community upvotes what matters most. Each issue carries a public weight and SLA timer.",
        },
        {
            title: "Resolve",
            desc: "Authorities or volunteers fix it and upload before/after proof to the public record.",
        },
        {
            title: "Verify",
            desc: "Nearby citizens confirm or reject the resolution. Approvals close the loop; rejections reopen it.",
        },
    ];

    return (
        <section className="w-full py-32 relative z-10 overflow-hidden">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-24">
                    <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-medium text-stone-800 mb-6">
                        A four-step civic loop, designed for accountability.
                    </h2>
                    <p className="font-[var(--font-inter)] text-lg text-stone-500 max-w-2xl mx-auto">
                        CivikEye is built around a transparent feedback cycle.
                        No step is invisible. No outcome is unilateral.
                    </p>
                </div>

                <div className="relative">
                    <svg
                        className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] h-full text-orange-200 hidden md:block"
                        preserveAspectRatio="none"
                        viewBox="0 0 2 1000"
                    >
                        <path
                            d="M1,0 L1,1000"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="8 8"
                        />
                    </svg>

                    <div className="space-y-12">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                            >
                                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-[#ea580c] rounded-full z-10 hidden md:flex items-center justify-center shadow-sm">
                                    <span className="text-[#ea580c] font-bold text-base">
                                        {i + 1}
                                    </span>
                                </div>

                                <div
                                    className={`flex-1 w-full md:w-1/2 ${i % 2 !== 0 ? "md:pl-16" : "md:pr-16"}`}
                                >
                                    <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative">
                                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-[#ea580c] font-bold text-xl md:hidden">
                                            {i + 1}
                                        </div>
                                        <h3 className="font-[var(--font-satoshi)] text-2xl font-bold text-stone-800 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="font-[var(--font-inter)] text-stone-500 text-base leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:block flex-1"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
