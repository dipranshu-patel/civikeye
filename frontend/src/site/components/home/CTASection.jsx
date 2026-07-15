import { Link } from "react-router-dom";

export default function CTASection() {
    return (
        <section className="w-full py-32 relative z-10 flex flex-col items-center text-center">
            <div className="max-w-[800px] w-full px-4 sm:px-6 lg:px-8">
                <h2 className="font-[var(--font-satoshi)] text-4xl md:text-5xl font-medium mb-6 text-stone-800">
                    Make your city a{" "}
                    <span className="text-[#ea580c]">public record.</span>
                </h2>

                <p className="font-[var(--font-inter)] text-lg text-stone-500 max-w-xl mx-auto mb-10 leading-relaxed">
                    Every report, every resolution, every overdue day — visible
                    to the people it affects. Start with one issue.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/register"
                        className="inline-flex justify-center items-center bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 py-3.5 rounded-full text-base font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/30"
                    >
                        Report your first issue
                    </Link>
                    <Link
                        to="/register"
                        className="inline-flex justify-center items-center bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 px-8 py-3.5 rounded-full text-base font-semibold transition-colors shadow-sm"
                    >
                        Become a volunteer
                    </Link>
                </div>
            </div>
        </section>
    );
}
