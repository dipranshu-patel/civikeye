import AboutHeroSection from "../../components/about/AboutHeroSection";
import ProblemSection from "../../components/about/ProblemSection";
import PrinciplesSection from "../../components/about/PrinciplesSection";
import CommitmentsSection from "../../components/about/CommitmentsSection";
import AboutCTASection from "../../components/about/AboutCTASection";

export default function AboutPage() {
    return (
        <div className="w-full">
            <AboutHeroSection />
            <ProblemSection />
            <PrinciplesSection />
            <CommitmentsSection />
            <AboutCTASection />
        </div>
    );
}
