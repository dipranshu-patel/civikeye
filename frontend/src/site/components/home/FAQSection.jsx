import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqData = [
    {
        question: "How does CivikEye prevent fake or spam complaints?",
        answer: "Citizens can submit only one complaint per location within a 50m radius, and nearby reports auto-suggest existing issues for upvoting instead of duplication. Resolutions require multi-citizen verification within a 2km radius — single actors cannot close issues unilaterally. Suspected spam is reviewed by administrators without changing public history."
    },
    {
        question: "Who actually resolves issues — authorities or volunteers?",
        answer: "Both. Authority-required issues are handled by departments, while community-fixable issues can be resolved by verified volunteers. Every resolution requires public verification."
    },
    {
        question: "How is authority accountability enforced?",
        answer: "Every complaint receives an SLA deadline. Missed deadlines become publicly visible, and department performance metrics remain visible to all citizens."
    },
    {
        question: "Which languages are supported?",
        answer: "CivikEye supports English, Hindi, and additional regional languages through multilingual content and translation support."
    },
    {
        question: "Can volunteers join freely?",
        answer: "Yes. Citizens can volunteer for community-fixable issues and build public contribution records through successful verified resolutions."
    },
    {
        question: "What about privacy and personal data?",
        answer: "Personal information is protected while issue reports, status changes, verification activity, and accountability records remain publicly transparent."
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
                    <div className="flex-1">
                        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-gray-100">
                            {faqData.map((faq, index) => {
                                const isOpen = openIndex === index;
                                return (
                                    <div key={index} className="flex flex-col">
                                        <button
                                            onClick={() => toggleFAQ(index)}
                                            className="flex items-center justify-between w-full text-left px-6 py-6 md:px-8 md:py-7 hover:bg-gray-50/50 transition-colors duration-200 focus:outline-none"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="font-[var(--font-satoshi)] text-[17px] font-semibold text-gray-900 pr-8">
                                                {faq.question}
                                            </span>
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 bg-white">
                                                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                            </div>
                                        </button>
                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="font-[var(--font-inter)] text-[15px] text-gray-500 leading-relaxed pb-6 md:pb-8 px-6 md:px-8">
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
