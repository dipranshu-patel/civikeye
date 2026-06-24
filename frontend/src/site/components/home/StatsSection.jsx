const statsData = [
    { id: 1, value: "48,219", label: "Issues resolved" },
    { id: 2, value: "92.7%", label: "Citizen-verified" },
    { id: 3, value: "4.2d", label: "Avg resolution time" },
    { id: 4, value: "84", label: "Wards on record" },
    { id: 5, value: "1,204", label: "Active volunteers" },
];

export default function StatsSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center mb-16">
                    <h2 className="font-[var(--font-inter)] text-xs sm:text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase">
                        Public accountability, by the numbers
                    </h2>
                    <p className="font-[var(--font-inter)] mt-5 text-[17px] sm:text-lg text-gray-600 max-w-[760px] leading-relaxed">
                        Every metric below is computed from open civic data and updated in real time. No private dashboards, no cherry-picked wins.
                    </p>
                </div>

                {/* ── Stats Container ── */}
                <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                        {statsData.map((stat) => (
                            <div 
                                key={stat.id} 
                                className="flex-1 flex flex-col items-center justify-center p-8 lg:p-10 text-center"
                            >
                                <div className="font-[var(--font-geistmono)] text-4xl lg:text-[42px] font-semibold text-gray-900 tracking-tight leading-none">
                                    {stat.value}
                                </div>
                                <div className="font-[var(--font-inter)] mt-3 sm:mt-4 text-[15px] font-medium text-gray-500">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
