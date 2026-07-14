import { useState } from "react";
import { Plus } from "lucide-react";

const faqData = [
    {
        question: "What is CivikEye?",
        answer: "CivikEye is a demo app that shows how citizens could report local civic problems like potholes, garbage, broken streetlights, and water issues. It demonstrates how a transparent complaint system could work, with community upvoting, volunteer participation, and accountability tracking. This is a demo project and is not connected to any real government."
    },
    {
        question: "How do I get started?",
        answer: "Sign up with your email and phone number, verify your identity, and you can immediately start reporting issues. Choose a location, describe the problem, upload a photo, and select the issue category. Your complaint will be visible to other demo users who can upvote or add comments."
    },
    {
        question: "How does CivikEye prevent fake or spam complaints?",
        answer: "The system only allows one complaint per location within a 50m radius — nearby reports automatically suggest existing issues for upvoting instead of duplication. Suspected spam is reviewed before being displayed. Users are encouraged to verify their identity to build trust."
    },
    {
        question: "Can I report any type of issue?",
        answer: "Yes, you can report any civic problem like roads, streetlights, water, garbage, sanitation, or parks. Simply select the category that best fits your issue and provide a clear description with a photo."
    },
    {
        question: "Who resolves issues in this demo?",
        answer: "In the demo, either simulated \"departments\" or verified volunteers can mark issues as resolved. Every resolution requires verification from other users within the area to show how public accountability would work in a real system."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

                    {/* ── Left Column ── */}
                    <div className="lg:w-[420px] shrink-0">
                        {/* Wrap your whole left text column inside this div container */}
                        <div className="border-l-2 border-[#e4e4e7] pl-5 flex flex-col gap-3">
                            <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase">
                                Common Questions
                            </span>
                            <h2 className="font-[var(--font-satoshi)] text-4xl font-bold text-[#18181b]">
                                Questions, answered in public.
                            </h2>
                        </div>

                        <p className="font-[var(--font-inter)] mt-6 text-base md:text-[17px] text-gray-500 leading-relaxed">
                            Transparency starts with how we explain ourselves. If something here is unclear, write to us — and we'll add it.
                        </p>
                    </div>

                    {/* ── Right Column (Accordion) ── */}
                    <div className="flex-1 mt-6 lg:mt-0">
                        <div className="flex flex-col">
                            {faqData.map((faq, index) => {
                                const isOpen = openIndex === index;
                                return (
                                    <div 
                                        key={index} 
                                        className="border-b border-dotted border-gray-300 last:border-b-0"
                                    >
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className="flex items-center w-full text-left py-4 md:py-5 hover:opacity-70 transition-opacity focus:outline-none cursor-pointer"
                                            aria-expanded={isOpen}
                                        >
                                            <div className="flex-shrink-0 w-6 flex items-center justify-start text-gray-400 mr-2 md:mr-3">
                                                <Plus className={`w-[16px] h-[16px] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-[15.5px] font-medium text-[#111]">
                                                {faq.question}
                                            </span>
                                        </button>
                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mb-4 md:mb-5" : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="text-[15px] text-gray-600 leading-relaxed pl-8 md:pl-9">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
