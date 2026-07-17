import { Eye, Shield, Scale } from "lucide-react";

const principles = [
    {
        number: "01",
        icon: Eye,
        title: "Transparency by default",
        description:
            "Issues, timelines, and outcomes are public unless there is a clear reason - like personal safety - for them not to be.",
    },
    {
        number: "02",
        icon: Shield,
        title: "Verifiability over claims",
        description:
            "Every resolution must be confirmed by people who are actually nearby. Self-reported success is not enough.",
    },
    {
        number: "03",
        icon: Scale,
        title: "Time-bound accountability",
        description:
            "Every category has a deadline. Overdue issues stay visibly overdue - they do not disappear because someone closed a ticket.",
    },
];

export default function PrinciplesSection() {
    return (
        <section className="w-full bg-transparent py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* ── Left Column ── */}
                    <div className="lg:w-[380px] shrink-0 flex flex-col items-start">
                        <div className="border-l-2 border-stone-200 pl-5 flex flex-col gap-3 mb-8">
                            <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#ea580c] uppercase">
                                The Principle
                            </span>
                            <h2 className="font-[var(--font-satoshi)] text-4xl md:text-[44px] font-bold tracking-tight leading-[1.1]">
                                <span className="block text-stone-800">
                                    Accountability works best
                                </span>
                                <span className="block text-stone-400">
                                    when it is public.
                                </span>
                            </h2>
                        </div>

                        <p className="font-[var(--font-inter)] text-[16px] text-stone-500 leading-relaxed">
                            CivikEye is built on a small number of design
                            commitments. They are not features - they are the
                            constraints the platform refuses to break.
                        </p>
                    </div>

                    {/* ── Right Column ── */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm relative overflow-hidden">
                            <blockquote className="font-[var(--font-satoshi)] text-[22px] md:text-[26px] font-bold text-stone-800 leading-[1.3] relative z-10">
                                "A civic system that hides its failures cannot
                                be trusted with its successes."
                            </blockquote>
                            <p className="font-[var(--font-inter)] text-[14px] text-stone-500 relative z-10">
                                - CivikEye design principle 01
                            </p>
                        </div>

                        {principles.map(
                            ({ number, icon: Icon, title, description }) => (
                                <div
                                    key={number}
                                    className="bg-white rounded-[2rem] border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5 relative overflow-hidden group"
                                >
                                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-stone-50 border border-stone-200/70 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors shrink-0 mt-0.5 relative z-10">
                                        <Icon
                                            className="w-4 h-4 text-stone-500 group-hover:text-orange-500 transition-colors"
                                            strokeWidth={1.75}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <span className="font-[var(--font-geistmono)] text-[11px] font-bold text-stone-400 tracking-widest">
                                                {number}
                                            </span>
                                            <p className="font-[var(--font-satoshi)] text-[15px] font-bold text-stone-800">
                                                {title}
                                            </p>
                                        </div>
                                        <p className="font-[var(--font-inter)] text-[13px] text-stone-500 leading-relaxed">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
