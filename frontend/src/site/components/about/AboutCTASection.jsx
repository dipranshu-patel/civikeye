import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutCTASection() {
    return (
        <section className="relative w-full bg-[#0a0a0b] overflow-hidden py-28 lg:py-36">

            {/* ── Dotted background pattern ── */}
            <div
                className="absolute inset-0 z-0"
                aria-hidden="true"
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* ── Blue radial glow ── */}
            <div
                className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                aria-hidden="true"
            >
                <div className="w-[600px] h-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
            </div>

            {/* ── Content ── */}
            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

                {/* Heading */}
                <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.1] mb-6">
                    <span className="block text-white">Cities improve when accountability</span>
                    <span className="block text-gray-500">becomes visible.</span>
                </h2>

                {/* Description */}
                <p className="font-[var(--font-inter)] text-[17px] text-gray-400 leading-relaxed max-w-[520px] mb-10">
                    Public infrastructure deserves public transparency. Start with one issue — and watch what changes when an entire city can see it.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-white text-gray-900 font-[var(--font-inter)] text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-150"
                    >
                        Report your first issue
                        <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </Link>
                    <Link
                        to="/how-it-works"
                        className="inline-flex items-center gap-2 bg-transparent text-white font-[var(--font-inter)] text-[14px] font-semibold px-6 py-3 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors duration-150"
                    >
                        See how it works
                    </Link>
                </div>

            </div>
        </section>
    );
}
