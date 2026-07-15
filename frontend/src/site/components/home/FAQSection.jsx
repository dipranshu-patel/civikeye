import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: "What is CivikEye?",
            a: "CivikEye is a demo app that shows how citizens could report local civic problems like potholes, garbage, broken streetlights, and water issues. It demonstrates how a transparent complaint system could work, with community upvoting, volunteer participation, and accountability tracking. This is a demo project and is not connected to any real government.",
        },
        {
            q: "How do I get started?",
            a: "Sign up with your email and phone number, verify your identity, and you can immediately start reporting issues. Choose a location, describe the problem, upload a photo, and select the issue category. Your complaint will be visible to other demo users who can upvote or add comments.",
        },
        {
            q: "How does CivikEye prevent fake or spam complaints?",
            a: "The system only allows one complaint per location within a 50m radius — nearby reports automatically suggest existing issues for upvoting instead of duplication. Suspected spam is reviewed before being displayed. Users are encouraged to verify their identity to build trust.",
        },
        {
            q: "Can I report any type of issue?",
            a: "Yes, you can report any civic problem like roads, streetlights, water, garbage, sanitation, or parks. Simply select the category that best fits your issue and provide a clear description with a photo.",
        },
        {
            q: "Who resolves issues in this demo?",
            a: 'In the demo, either simulated "departments" or verified volunteers can mark issues as resolved. Every resolution requires verification from other users within the area to show how public accountability would work in a real system.',
        },
    ];

    return (
        <section className="w-full py-24 relative z-10">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="font-[var(--font-satoshi)] text-4xl font-medium text-stone-800 mb-4">
                        Questions, answered in public.
                    </h2>
                    <p className="font-[var(--font-inter)] text-lg text-stone-500 max-w-2xl mx-auto">
                        Transparency starts with how we explain ourselves. If
                        something here is unclear, write to us — and we'll add
                        it.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() =>
                                    setOpenIndex(openIndex === i ? -1 : i)
                                }
                                className="w-full cursor-pointer text-left p-6 sm:px-8 flex justify-between items-center focus:outline-none"
                            >
                                <span
                                    className={`font-[var(--font-satoshi)] text-lg font-semibold pr-8 text-stone-800`}
                                >
                                    {faq.q}
                                </span>
                                <div
                                    className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-colors ${openIndex === i ? "bg-orange-50" : "bg-stone-50"}`}
                                >
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-300 text-orange-500 ${openIndex === i ? "rotate-180" : "text-stone-400"}`}
                                    />
                                </div>
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                            >
                                <p className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 text-stone-500 font-[var(--font-inter)] text-base leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
