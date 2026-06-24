import HowItWorksHero from "../../components/howitworks/HowItWorksHero";
import ReportStepSection from "../../components/howitworks/ReportStepSection";
import PrioritizeStepSection from "../../components/howitworks/PrioritizeStepSection";
import ResolveStepSection from "../../components/howitworks/ResolveStepSection";
import ResolutionProofStepSection from "../../components/howitworks/ResolutionProofStepSection";
import VerificationStepSection from "../../components/howitworks/VerificationStepSection";

export default function HowItWorksPage() {
    return (
        <div className="w-full">
            <HowItWorksHero />
            <ReportStepSection />
            <PrioritizeStepSection />
            <ResolveStepSection />
            <ResolutionProofStepSection />
            <VerificationStepSection />
        </div>
    );
}
