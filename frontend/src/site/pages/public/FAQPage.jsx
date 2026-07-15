import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";

const faqSections = [
    {
        title: "General",
        faqs: [
            {
                question: "What is CivikEye?",
                answer: "CivikEye is a demo app that shows how citizens could report local civic problems like potholes, garbage, broken streetlights, and water issues. It demonstrates how a transparent complaint system could work, with community upvoting, volunteer participation, and accountability tracking. This is a demo project and is not connected to any real government.",
            },
            {
                question: "Is this a real government service?",
                answer: "No. CivikEye is a demo project created for learning and demonstration. It is not connected to any real government, and complaints submitted here will not be sent to actual authorities. It shows how a civic reporting system could work conceptually.",
            },
            {
                question: "Who resolves issues in this demo?",
                answer: 'In the demo, either simulated "departments" or verified volunteers can mark issues as resolved. Every resolution requires verification from other users within the area to show how public accountability would work in a real system.',
            },
        ],
    },
    {
        title: "Reporting & Usage",
        faqs: [
            {
                question: "How do I get started?",
                answer: "Sign up with your email and phone number, verify your identity, and you can immediately start reporting issues. Choose a location, describe the problem, upload a photo, and select the issue category. Your complaint will be visible to other demo users who can upvote or add comments.",
            },
            {
                question: "Can I report any type of issue?",
                answer: "Yes, you can report any civic problem like roads, streetlights, water, garbage, sanitation, or parks. Simply select the category that best fits your issue and provide a clear description with a photo.",
            },
            {
                question: "What happens after I submit a complaint?",
                answer: "Your complaint is posted to the demo app immediately. Other users can see it, upvote it, or comment. Over time, volunteers or simulated departments can work on it, update the status, and eventually mark it as resolved after community verification.",
            },
            {
                question: "Can I edit or delete my complaint?",
                answer: "Yes. You can view, edit, or delete your own complaints anytime from your account. Changes are logged so other users can see the history of edits.",
            },
        ],
    },
    {
        title: "Community & Accountability",
        faqs: [
            {
                question: "How does CivikEye prevent fake or spam complaints?",
                answer: "The system only allows one complaint per location within a 50m radius — nearby reports automatically suggest existing issues for upvoting instead of duplication. Suspected spam is reviewed before being displayed. Users are encouraged to verify their identity to build trust.",
            },
            {
                question: "How is authority accountability shown?",
                answer: "The app tracks how long each complaint takes to resolve and displays this timeline publicly. This demonstrates how a real system could keep departments accountable by showing their response times.",
            },
            {
                question: "Can volunteers join freely?",
                answer: "Yes. You can volunteer to help resolve community-fixable issues and build a public contribution record. After successful verified resolutions, you earn recognition as a trusted community helper.",
            },
        ],
    },
    {
        title: "Privacy & Data",
        faqs: [
            {
                question: "What about privacy and personal data?",
                answer: "Your personal information (name, email, password) is protected and not shared publicly. However, the complaints you submit, their locations, photos, and resolution history remain visible to other users in the demo to demonstrate transparency.",
            },
            {
                question: "How is my location data used?",
                answer: "Your location is used to place your complaint on the map and group similar issues together. You can choose to be precise or just give a general area. Location data is protected but the complaint's location is shown publicly to help others find related issues nearby.",
            },
        ],
    },
];

export default function FAQPage() {
    const [openKey, setOpenKey] = useState(null);
    const [activeSection, setActiveSection] = useState(0);

    const toggleFAQ = (sectionIndex, faqIndex) => {
        const key = `${sectionIndex}-${faqIndex}`;
        setOpenKey((prev) => (prev === key ? null : key));
    };

    const scrollToSection = (index) => {
        const element = document.getElementById(`faq-section-${index}`);
        if (element) {
            const offset = 120;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
            setActiveSection(index);
        }
    };

    return (
        <div className="w-full bg-[#fcfbf7] text-stone-800 min-h-screen font-[var(--font-inter)] py-12 lg:py-20 selection:bg-orange-200 selection:text-orange-900">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-20">
                    <h1 className="font-[var(--font-satoshi)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-800 mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="font-[var(--font-inter)] text-lg text-stone-500 max-w-2xl leading-relaxed">
                        Find answers to all your questions about how CivikEye
                        works, privacy, reporting issues, and community
                        volunteering.
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start relative">
                    <div className="hidden lg:block lg:col-span-4 sticky top-32">
                        <nav className="flex flex-col space-y-2 border-l border-stone-200 pl-6">
                            {faqSections.map((section, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => scrollToSection(idx)}
                                    className={`text-left py-2 px-4 -ml-[25px] border-l-2 transition-all duration-300 font-[var(--font-satoshi)] text-lg ${
                                        activeSection === idx
                                            ? "border-orange-500 text-orange-600 font-semibold cursor-pointer"
                                            : "border-transparent text-stone-400 hover:text-stone-800 cursor-pointer"
                                    }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="lg:col-span-8 space-y-24">
                        {faqSections.map((section, sIndex) => (
                            <div
                                key={sIndex}
                                id={`faq-section-${sIndex}`}
                                className="scroll-mt-32"
                            >
                                <h2 className="font-[var(--font-satoshi)] text-3xl font-bold tracking-tight text-stone-800 mb-8 pb-4 border-b border-stone-200">
                                    {section.title}
                                </h2>
                                <div className="space-y-2">
                                    {section.faqs.map((faq, fIndex) => {
                                        const key = `${sIndex}-${fIndex}`;
                                        const isOpen = openKey === key;
                                        return (
                                            <div
                                                key={fIndex}
                                                className="border-b border-stone-200 last:border-b-0"
                                            >
                                                <button
                                                    onClick={() =>
                                                        toggleFAQ(
                                                            sIndex,
                                                            fIndex,
                                                        )
                                                    }
                                                    className="w-full cursor-pointer text-left py-6 flex justify-between items-start focus:outline-none group"
                                                    aria-expanded={isOpen}
                                                >
                                                    <span
                                                        className={`font-[var(--font-satoshi)] text-[19px] font-medium pr-8 transition-colors ${
                                                            isOpen
                                                                ? "text-orange-600"
                                                                : "text-stone-800 group-hover:text-orange-600"
                                                        }`}
                                                    >
                                                        {faq.question}
                                                    </span>
                                                    <div className="shrink-0 pt-1 text-stone-400 group-hover:text-orange-500 transition-colors">
                                                        {isOpen ? (
                                                            <Minus
                                                                className="w-6 h-6"
                                                                strokeWidth={2}
                                                            />
                                                        ) : (
                                                            <Plus
                                                                className="w-6 h-6"
                                                                strokeWidth={2}
                                                            />
                                                        )}
                                                    </div>
                                                </button>
                                                <div
                                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                        isOpen
                                                            ? "max-h-[500px] opacity-100 pb-8"
                                                            : "max-h-0 opacity-0"
                                                    }`}
                                                >
                                                    <p className="text-stone-500 font-[var(--font-inter)] text-[17px] leading-[1.7] pr-8">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
