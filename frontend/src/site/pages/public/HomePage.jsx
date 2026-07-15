import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import ProcessSection from "../../components/home/ProcessSection";
import FAQSection from "../../components/home/FAQSection";
import CTASection from "../../components/home/CTASection";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("userRole");
        if (token) {
            navigate(`/${role || "citizen"}/dashboard`);
        }
    }, [navigate]);

    return (
        <div className="w-full bg-[#fcfbf7] text-stone-800 relative flex flex-col min-h-screen font-[var(--font-inter)] selection:bg-orange-200 selection:text-orange-900">
            <HeroSection />
            <StatsSection />
            <ProcessSection />
            <FAQSection />
            <CTASection />
        </div>
    );
}
