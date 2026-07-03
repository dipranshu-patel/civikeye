import { useState } from "react";
import { Plus } from "lucide-react";

const faqSections = [
    {
        title: "General",
        faqs: [
            {
                question: "What is CivikEye?",
                answer: "CivikEye is a demo app that shows how citizens could report local civic problems like potholes, garbage, broken streetlights, and water issues. It demonstrates how a transparent complaint system could work, with community upvoting, volunteer participation, and accountability tracking. This is a demo project and is not connected to any real government."
            },
            {
                question: "Is this a real government service?",
                answer: "No. CivikEye is a demo project created for learning and demonstration. It is not connected to any real government, and complaints submitted here will not be sent to actual authorities. It shows how a civic reporting system could work conceptually."
            },
            {
                question: "Who resolves issues in this demo?",
                answer: "In the demo, either simulated \"departments\" or verified volunteers can mark issues as resolved. Every resolution requires verification from other users within the area to show how public accountability would work in a real system."
            }
        ]
    },
    {
        title: "Reporting & Usage",
        faqs: [
            {
                question: "How do I get started?",
                answer: "Sign up with your email and phone number, verify your identity, and you can immediately start reporting issues. Choose a location, describe the problem, upload a photo, and select the issue category. Your complaint will be visible to other demo users who can upvote or add comments."
            },
            {
                question: "Can I report any type of issue?",
                answer: "Yes, you can report any civic problem like roads, streetlights, water, garbage, sanitation, or parks. Simply select the category that best fits your issue and provide a clear description with a photo."
            },
            {
                question: "What happens after I submit a complaint?",
                answer: "Your complaint is posted to the demo app immediately. Other users can see it, upvote it, or comment. Over time, volunteers or simulated departments can work on it, update the status, and eventually mark it as resolved after community verification."
            },
            {
                question: "Can I edit or delete my complaint?",
                answer: "Yes. You can view, edit, or delete your own complaints anytime from your account. Changes are logged so other users can see the history of edits."
            }
        ]
    },
    {
        title: "Community & Accountability",
        faqs: [
            {
                question: "How does CivikEye prevent fake or spam complaints?",
                answer: "The system only allows one complaint per location within a 50m radius — nearby reports automatically suggest existing issues for upvoting instead of duplication. Suspected spam is reviewed before being displayed. Users are encouraged to verify their identity to build trust."
            },
            {
                question: "How is authority accountability shown?",
                answer: "The app tracks how long each complaint takes to resolve and displays this timeline publicly. This demonstrates how a real system could keep departments accountable by showing their response times."
            },
            {
                question: "Can volunteers join freely?",
                answer: "Yes. You can volunteer to help resolve community-fixable issues and build a public contribution record. After successful verified resolutions, you earn recognition as a trusted community helper."
            }
        ]
    },
    {
        title: "Privacy & Data",
        faqs: [
            {
                question: "What about privacy and personal data?",
                answer: "Your personal information (name, email, password) is protected and not shared publicly. However, the complaints you submit, their locations, photos, and resolution history remain visible to other users in the demo to demonstrate transparency."
            },
            {
                question: "How is my location data used?",
                answer: "Your location is used to place your complaint on the map and group similar issues together. You can choose to be precise or just give a general area. Location data is protected but the complaint's location is shown publicly to help others find related issues nearby."
            }
        ]
    }
];

export default function FAQPage() {
    const [openKey, setOpenKey] = useState(null);

    const toggleFAQ = (sectionIndex, faqIndex) => {
        const key = `${sectionIndex}-${faqIndex}`;
        setOpenKey(prev => prev === key ? null : key);
    };

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] py-16 px-6 lg:px-8 font-sans selection:bg-gray-200">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-[32px] font-bold tracking-tight text-[#111] mb-2">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-[16px] text-gray-500">
                        Everything you need to know about how CivikEye works, privacy, reporting issues, and community volunteering.
                    </p>
                </div>

                <div className="space-y-10">
                    {faqSections.map((section, sIndex) => (
                        <div key={sIndex}>
                            <h2 className="text-[17.5px] font-bold text-[#111] mb-2">
                                {section.title}
                            </h2>
                            <div className="flex flex-col">
                                {section.faqs.map((faq, fIndex) => {
                                    const key = `${sIndex}-${fIndex}`;
                                    const isOpen = openKey === key;
                                    return (
                                        <div 
                                            key={fIndex} 
                                            className="border-b border-dotted border-gray-300 last:border-b-0"
                                        >
                                            <button
                                                onClick={() => toggleFAQ(sIndex, fIndex)}
                                                className="flex items-center w-full text-left py-4 hover:opacity-70 transition-opacity focus:outline-none"
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
                                                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0"
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
                    ))}
                </div>
            </div>
        </div>
    );
}
