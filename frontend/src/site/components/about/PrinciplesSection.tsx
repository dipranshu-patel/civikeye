import { Eye, Shield, Scale } from "lucide-react";

interface Principle {
    number: string;
    icon: typeof Eye;
    title: string;
    description: string;
}

const principles: Principle[] = [
    {
        number: "01",
        icon: Eye,
        title: "Transparency by default",
        description: "Issues, timelines, and outcomes are public unless there is a clear reason — like personal safety — for them not to be.",
    },
    {
        number: "02",
        icon: Shield,
        title: "Verifiability over claims",
        description: "Every resolution must be confirmed by people who are actually nearby. Self-reported success is not enough.",
    },
    {
        number: "03",
        icon: Scale,
        title: "Time-bound accountability",
        description: "Every category has a deadline. Overdue issues stay visibly overdue — they do not disappear because someone closed a ticket.",
    },
];

export default function PrinciplesSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* ── Left Column ── */}
                    <div className="lg:w-[380px] shrink-0 flex flex-col items-start">

                        {/* ── Left Sidebar Header Block ── */}
                        <div className="border-l-2 border-[#e4e4e7] pl-5 flex flex-col gap-3 mb-8">
                            <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase">
                                The Principle
                            </span>
                            <h2 className="font-[var(--font-satoshi)] text-4xl md:text-[44px] font-bold tracking-tight leading-[1.1]">
                                <span className="block text-[#18181b]">Accountability works best</span>
                                <span className="block text-gray-400">when it is public.</span>
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="font-[var(--font-inter)] text-[16px] text-gray-500 leading-relaxed">
                            CivikEye is built on a small number of design commitments. They are not features — they are the constraints the platform refuses to break.
                        </p>
                    </div>

                    {/* ── Right Column ── */}
                    <div className="flex-1 flex flex-col gap-4">

                        {/* Quote Card */}
                        <div className="bg-white border border-gray-200/80 rounded-2xl p-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] flex flex-col gap-5">
                            <blockquote className="font-[var(--font-satoshi)] text-[22px] md:text-[26px] font-bold text-gray-900 leading-[1.3]">
                                "A civic system that hides its failures cannot be trusted with its successes."
                            </blockquote>
                            <p className="font-[var(--font-inter)] text-[14px] text-gray-400">
                                — CivikEye design principle 01
                            </p>
                        </div>

                        {/* Principle Cards */}
                        {principles.map(({ number, icon: Icon, title, description }) => (
                            <div
                                key={number}
                                className="bg-white border border-gray-200/80 rounded-2xl px-6 py-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] flex items-start gap-5"
                            >
                                {/* Icon Container */}
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200/70 shrink-0 mt-0.5">
                                    <Icon className="w-4 h-4 text-gray-500" strokeWidth={1.75} />
                                </div>

                                {/* Text */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-[var(--font-geistmono)] text-[11px] font-bold text-gray-300 tracking-widest">
                                            {number}
                                        </span>
                                        <p className="font-[var(--font-satoshi)] text-[15px] font-bold text-gray-900">
                                            {title}
                                        </p>
                                    </div>
                                    <p className="font-[var(--font-inter)] text-[13px] text-gray-500 leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </section>
    );
}
