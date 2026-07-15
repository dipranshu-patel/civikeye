import { Camera, TrendingUp, CircleCheck, Shield } from "lucide-react";

const stepsData = [
    {
        id: 1,
        number: "01",
        label: "Report",
        icon: Camera,
    },
    {
        id: 2,
        number: "02",
        label: "Prioritize",
        icon: TrendingUp,
    },
    {
        id: 3,
        number: "03",
        label: "Resolve",
        icon: CircleCheck,
    },
    {
        id: 4,
        number: "04",
        label: "Verify",
        icon: Shield,
    },
];

export default function HowItWorksHero() {
    return (
        <section className="relative w-full overflow-hidden bg-[#fcfbf7] pt-32 pb-16">
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <h1 className="font-[var(--font-satoshi)] text-5xl md:text-6xl lg:text-[72px] font-medium text-center tracking-tight leading-[1.05]">
                    <span className="block text-stone-800">
                        How public accountability
                    </span>
                    <span className="block text-[#ea580c] italic mt-2">
                        actually works.
                    </span>
                </h1>

                <p className="font-[var(--font-inter)] mt-8 text-lg text-stone-500 max-w-[800px] text-center leading-relaxed">
                    Every issue becomes publicly visible. Every action is
                    recorded. Every resolution can be verified. Follow one civic
                    issue from report to accountability.
                </p>
            </div>
        </section>
    );
}
