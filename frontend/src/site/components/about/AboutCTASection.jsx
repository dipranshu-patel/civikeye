import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutCTASection() {
    return (
        <section className="relative w-full bg-transparent overflow-hidden py-28 lg:py-36">
            <div
                className="absolute inset-0 z-0"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(234,88,12,0.1) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1] mb-6">
                    <span className="block text-stone-800">
                        Cities improve when accountability
                    </span>
                    <span className="block text-[#ea580c]">
                        becomes visible.
                    </span>
                </h2>

                <p className="font-[var(--font-inter)] text-[17px] text-stone-500 leading-relaxed max-w-[520px] mb-10">
                    Public infrastructure deserves public transparency. Start
                    with one issue - and watch what changes when an entire city
                    can see it.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
                    <Link
                        to="/register"
                        className="inline-flex justify-center items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/30"
                    >
                        Report your first issue
                        <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </Link>
                    <Link
                        to="/how-it-works"
                        className="inline-flex justify-center items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 px-8 py-3.5 rounded-full text-base font-semibold transition-colors shadow-sm"
                    >
                        See how it works
                    </Link>
                </div>
            </div>
        </section>
    );
}
