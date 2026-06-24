import { Eye, Shield, CheckCircle, SquarePen, Scale, Globe } from "lucide-react";

const commitments = [
    {
        number: "01",
        icon: Eye,
        title: "Transparency",
        description: "The default is public. Privacy is the documented exception.",
    },
    {
        number: "02",
        icon: Shield,
        title: "Public trust",
        description: "Trust is built by what the system shows, not what it claims.",
    },
    {
        number: "03",
        icon: CheckCircle,
        title: "Verifiable resolution",
        description: "Every fix has evidence and community confirmation attached.",
    },
    {
        number: "04",
        icon: SquarePen,
        title: "Civic participation",
        description: "Reporting, prioritizing, and verifying are first-class actions.",
    },
    {
        number: "05",
        icon: Scale,
        title: "Open accountability",
        description: "Data is queryable. Researchers and journalists are welcome.",
    },
    {
        number: "06",
        icon: Globe,
        title: "Community oversight",
        description: "Resolutions close when nearby citizens agree - not before.",
    },
];

export default function CommitmentsSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Left Sidebar Header Block ── */}
                <div className="border-l-2 border-[#e4e4e7] pl-5 flex flex-col gap-3 mb-8">
                    <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase">
                        Platform values
                    </span>
                    <h2 className="font-[var(--font-satoshi)] text-4xl md:text-[48px] font-bold tracking-tight leading-[1.1]">
                        <span className="block text-[#18181b]">Six commitments,</span>
                        <span className="block text-gray-400">in writing.</span>
                    </h2>
                </div>

                {/* ── Description ── */}
                <p className="font-[var(--font-inter)] text-[17px] text-gray-500 leading-relaxed max-w-[560px] mb-14">
                    These are the guarantees CivikEye makes to every citizen, volunteer, and institution that interacts with the platform.
                </p>

                {/* ── Commitments Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {commitments.map(({ number, icon: Icon, title, description }) => (
                        <div
                            key={number}
                            className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] flex flex-col gap-6"
                        >
                            {/* Top row: icon + number */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 border border-gray-200/70 shrink-0">
                                    <Icon className="w-4 h-4 text-gray-500" strokeWidth={1.75} />
                                </div>
                                <span className="font-[var(--font-geistmono)] text-[12px] font-bold text-gray-200 tracking-widest">
                                    {number}
                                </span>
                            </div>

                            {/* Bottom: title + description */}
                            <div className="flex flex-col gap-1.5">
                                <p className="font-[var(--font-satoshi)] text-[16px] font-bold text-gray-900">
                                    {title}
                                </p>
                                <p className="font-[var(--font-inter)] text-[13px] text-gray-500 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
