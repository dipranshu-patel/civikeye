import { Link } from "react-router-dom";
import heroIllustration from "../../assets/images/hero-illustration.png";

export default function HeroSection() {
    return (
        <section className="relative w-full pt-0 pb-24 overflow-hidden z-10">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
                    <div className="w-full lg:w-[47%] text-center lg:text-left">
                        <h1 className="font-[var(--font-satoshi)] text-5xl md:text-6xl lg:text-[5.5rem] font-medium text-stone-800 tracking-tight leading-[1.1]">
                            Civic accountability, <br />
                            <span className="text-[#ea580c] italic pr-2">
                                in public view.
                            </span>
                        </h1>

                        <p className="mt-8 text-lg md:text-xl text-stone-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            CivikEye is the public ledger for city issues.
                            Citizens report, communities prioritize, authorities
                            resolve — and every step is verifiable, time-bound,
                            and transparent.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                            <Link
                                to="/register"
                                className="inline-flex justify-center items-center bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/30"
                            >
                                Report an issue
                            </Link>
                            <Link
                                to="/how-it-works"
                                className="inline-flex justify-center items-center bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 px-8 py-3.5 rounded-full text-base font-semibold transition-colors shadow-sm"
                            >
                                See how it works
                            </Link>
                        </div>
                    </div>

                    <div className="w-full lg:w-[45%] relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-orange-100/60 rounded-full blur-3xl -z-10"></div>

                        <div
                            className="w-full relative group"
                            style={{
                                WebkitMaskImage:
                                    "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                                WebkitMaskComposite: "source-in",
                                maskImage:
                                    "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                                maskComposite: "intersect",
                            }}
                        >
                            <img
                                src={heroIllustration}
                                alt="CivikEye Platform"
                                className="w-full h-auto object-contain block mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
