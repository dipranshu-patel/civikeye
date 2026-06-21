import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden bg-[#F8FAFC] pt-38 pb-38">
            {/* ── Background Grid ── */}
            <div
                className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#00000016_1px,transparent_1px),linear-gradient(to_bottom,#00000016_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_100%)]"
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

                {/* ── Main Heading ── */}
                <h1 className="font-[var(--font-satoshi)] text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
                    <span className="block text-gray-900">Civic accountability,</span>
                    <span className="block text-gray-500 mt-1 md:mt-2">in public view.</span>
                </h1>

                {/* ── Description ── */}
                <p className="font-[var(--font-inter)] mt-6 text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    CivikEye is the public ledger for city issues. Citizens report, communities
                    prioritize, authorities resolve — and every step is verifiable, time-bound,
                    and transparent.
                </p>

                {/* ── CTA Buttons ── */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                    <button className="font-[var(--font-inter)] w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-medium transition-colors duration-200">
                        Report an issue
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="font-[var(--font-inter)] w-full sm:w-auto inline-flex justify-center items-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-3.5 rounded-full font-medium transition-colors duration-200 shadow-sm">
                        See how it works
                    </button>
                </div>
            </div>
        </section>
    );
}
