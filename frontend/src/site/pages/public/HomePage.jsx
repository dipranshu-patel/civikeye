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
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        if (token) {
            navigate(`/${role || 'citizen'}/dashboard`);
        }
    }, [navigate]);

    return (
        <div className="w-full">
            <HeroSection />
            <StatsSection />
            <ProcessSection />
            <FAQSection />
            <CTASection />
        </div>
    );
}
