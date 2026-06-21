import { Camera, TrendingUp, CircleCheck, Shield } from "lucide-react";

const stepsData = [
    {
        id: 1,
        number: "01",
        label: "Report",
        icon: Camera,
        bgClass: "bg-blue-50/80",
        textClass: "text-blue-500",
        borderClass: "border-blue-100/50"
    },
    {
        id: 2,
        number: "02",
        label: "Prioritize",
        icon: TrendingUp,
        bgClass: "bg-purple-50/80",
        textClass: "text-purple-500",
        borderClass: "border-purple-100/50"
    },
    {
        id: 3,
        number: "03",
        label: "Resolve",
        icon: CircleCheck,
        bgClass: "bg-emerald-50/80",
        textClass: "text-emerald-500",
        borderClass: "border-emerald-100/50"
    },
    {
        id: 4,
        number: "04",
        label: "Verify",
        icon: Shield,
        bgClass: "bg-orange-50/80",
        textClass: "text-orange-500",
        borderClass: "border-orange-100/50"
    }
];

export default function HowItWorksHero() {
    return (
        <section className="relative w-full overflow-hidden bg-[#F8FAFC] pt-24 pb-32">
            {/* ── Background Dotted Grid ── */}
            <div 
                className="absolute inset-0 z-0 bg-[radial-gradient(#00000025_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                
                {/* ── Main Heading ── */}
                <h1 className="font-[var(--font-satoshi)] text-5xl md:text-6xl lg:text-[72px] font-bold text-center tracking-tight leading-[1.05]">
                    <span className="block text-gray-900">How public accountability</span>
                    <span className="block text-gray-500 mt-2">actually works.</span>
                </h1>

                {/* ── Description ── */}
                <p className="font-[var(--font-inter)] mt-8 text-base md:text-lg lg:text-[19px] text-gray-500 max-w-[800px] text-center leading-relaxed">
                    Every issue becomes publicly visible. Every action is recorded. Every 
                    resolution can be verified. Follow one civic issue from report to accountability.
                </p>

                {/* ── Process Overview Card ── */}
                <div className="w-full max-w-5xl mt-16 bg-white border border-gray-200/80 rounded-2xl py-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 w-full">
                        
                        {/* Continuous Background Line (Desktop Only) */}
                        <div 
                            className="hidden md:block absolute top-[2.25rem] left-[5%] right-[5%] h-px bg-gray-200 z-0" 
                            aria-hidden="true"
                        />

                        {stepsData.map((step) => (
                            <div key={step.id} className="relative z-10 flex flex-col items-center bg-white md:px-6">
                                {/* Icon Container */}
                                <div className={`flex items-center justify-center w-[72px] h-[72px] rounded-[1.25rem] ${step.bgClass} border ${step.borderClass} shadow-sm`}>
                                    <step.icon className={`w-7 h-7 ${step.textClass}`} strokeWidth={2} />
                                </div>
                                
                                {/* Step Details */}
                                <span className="font-[var(--font-geistmono)] mt-6 text-[11px] font-bold text-gray-300 tracking-[0.2em] uppercase">
                                    {step.number}
                                </span>
                                <span className="font-[var(--font-inter)] mt-1.5 text-[15px] font-semibold text-gray-900">
                                    {step.label}
                                </span>
                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </section>
    );
}
