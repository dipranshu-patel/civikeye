const statsData = [
    { id: 1, value: "48,219", label: "Issues resolved" },
    { id: 2, value: "92.7%", label: "Citizen-verified" },
    { id: 3, value: "4.2d", label: "Avg resolution time" },
    { id: 4, value: "84", label: "Departments on record" },
    { id: 5, value: "1,204", label: "Active volunteers" },
];

export default function StatsSection() {
    return (
        <section className="w-full py-20 relative z-10">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-[var(--font-inter)] text-xs font-bold tracking-[0.2em] text-[#ea580c] uppercase mb-3">
                        Public accountability, by the numbers
                    </h2>
                    <p className="font-[var(--font-inter)] text-lg text-stone-500 max-w-3xl mx-auto leading-relaxed">
                        Every metric below is computed from open civic data and
                        updated in real time. No private dashboards, no
                        cherry-picked wins.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {statsData.map((stat) => (
                        <div
                            key={stat.id}
                            className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-[2rem] border border-stone-200 shadow-sm hover:shadow-md transition-shadow min-w-[200px] flex-1"
                        >
                            <div className="font-[var(--font-satoshi)] text-4xl lg:text-5xl font-bold text-[#ea580c] mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-stone-500 uppercase tracking-widest">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
