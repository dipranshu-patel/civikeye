import HeroSection from "../../components/home/HeroSection";
import StatsSection from "../../components/home/StatsSection";
import ProcessSection from "../../components/home/ProcessSection";
import FAQSection from "../../components/home/FAQSection";
import CTASection from "../../components/home/CTASection";

export default function HomePage() {
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
