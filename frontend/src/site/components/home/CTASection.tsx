import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── CTA Card ── */}
                <div className="relative w-full bg-[#0a0a0b] rounded-2xl overflow-hidden py-24 px-6 sm:px-12 flex flex-col items-center text-center shadow-xl">

                    {/* ── Background Grid ── */}
                    <div
                        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"
                        aria-hidden="true"
                    />

                    {/* ── Content ── */}
                    <div className="relative z-10 w-full max-w-3xl flex flex-col items-center">

                        {/* Heading */}
                        <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl lg:text-[64px] font-bold text-white tracking-tight leading-[1.1]">
                            Make your city a public<br />record.
                        </h2>

                        {/* Description */}
                        <p className="font-[var(--font-inter)] mt-6 text-[15px] md:text-[17px] text-gray-400 max-w-xl mx-auto leading-relaxed">
                            Every report, every resolution, every overdue day — visible to the people it affects. Start with one issue.
                        </p>

                        {/* Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            <button className="font-[var(--font-inter)] w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-8 py-3.5 rounded-full font-medium transition-colors duration-200">
                                Report your first issue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="font-[var(--font-inter)] w-full sm:w-auto inline-flex justify-center items-center border border-white/20 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-medium transition-colors duration-200">
                                Become a volunteer
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
