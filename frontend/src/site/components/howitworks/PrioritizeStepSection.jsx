import { TrendingUp } from "lucide-react";

const issues = [
    {
        title: "Broken streetlight cluster",
        subtitle: "Sector 45",
        votes: "247",
        change: "+38%",
        highlighted: true,
    },
    {
        title: "Open drainage hazard",
        subtitle: "Ring Road",
        votes: "189",
        change: "+24%",
        highlighted: false,
    },
    {
        title: "Pothole on Main Street",
        subtitle: "Central",
        votes: "156",
        change: "+12%",
        highlighted: false,
    },
];

// Decorative dashed chart bars — heights roughly mimic the wave pattern in the screenshot
const chartBars = [3, 5, 4, 6, 5, 7, 6, 8, 7, 9, 8, 7, 9, 8, 10, 9, 8, 7, 6, 8];

export default function PrioritizeStepSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-26 lg:gap-46">

                    {/* ── Left: Trending Issues Card ── */}
                    <div className="flex-1 w-full max-w-[520px]">
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-4">

                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-[var(--font-satoshi)] text-[15px] font-bold text-gray-900">
                                    Trending Issues
                                </span>
                                <span className="font-[var(--font-inter)] text-[13px] text-gray-400">
                                    This week
                                </span>
                            </div>

                            {/* Issue List */}
                            <div className="flex flex-col gap-2">
                                {issues.map((issue) => (
                                    <div
                                        key={issue.title}
                                        className={`flex items-center justify-between gap-4 rounded-xl px-3 py-3 ${
                                            issue.highlighted
                                                ? "bg-blue-50/70 border border-blue-100"
                                                : "bg-gray-50/60 border border-gray-100"
                                        }`}
                                    >
                                        {/* Icon + Text */}
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                                                issue.highlighted
                                                    ? "bg-blue-500"
                                                    : "bg-white border border-gray-200"
                                            }`}>
                                                <TrendingUp
                                                    className={`w-4 h-4 ${issue.highlighted ? "text-white" : "text-gray-400"}`}
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`font-[var(--font-inter)] text-[13px] font-semibold truncate ${
                                                    issue.highlighted ? "text-gray-900" : "text-gray-700"
                                                }`}>
                                                    {issue.title}
                                                </p>
                                                <p className="font-[var(--font-inter)] text-[12px] text-gray-400 mt-0.5">
                                                    {issue.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Votes + Change */}
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="font-[var(--font-geistmono)] text-[15px] font-bold text-gray-900">
                                                {issue.votes}
                                            </span>
                                            <span className="font-[var(--font-inter)] text-[11px] font-semibold text-emerald-500 mt-0.5">
                                                {issue.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Community Engagement Chart */}
                            <div className="mt-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 pt-4 pb-3">
                                <div className="flex items-end gap-[3px] h-10">
                                    {chartBars.map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-sm bg-blue-200/60 border-t-2 border-dashed border-blue-300/70"
                                            style={{ height: `${h * 10}%` }}
                                        />
                                    ))}
                                </div>
                                <p className="font-[var(--font-inter)] text-[12px] text-gray-400 text-center mt-3">
                                    Community engagement over 12 weeks
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* ── Right: Content ── */}
                    <div className="flex-1 flex flex-col items-start">

                        {/* Step Heading Block */}
                        <div className="border-l-2 border-[#e4e4e7] pl-5 flex flex-col gap-3 mb-2">
                            <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase">
                                02 // Aggregate Vote
                            </span>
                            <h2 className="font-[var(--font-satoshi)] text-4xl md:text-[44px] font-bold text-[#18181b] tracking-tight leading-[1.1]">
                                Communities decide what matters most.
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="font-[var(--font-inter)] mt-5 text-[17px] text-gray-500 leading-relaxed max-w-[440px]">
                            Citizens upvote issues publicly. Each issue carries a public weight and SLA timer. No private dashboards. No cherry-picked wins. Priority is determined transparently.
                        </p>

                        {/* Info Card */}
                        <div className="mt-8 bg-white border border-gray-200 rounded-2xl px-5 py-4 max-w-[440px]">
                            <p className="font-[var(--font-inter)] text-[14px] text-gray-600 leading-relaxed">
                                <span className="font-semibold text-gray-900">How it works:</span>{" "}
                                One user = one vote. The most upvoted issues rise to the top, creating{" "}
                                <span className="text-emerald-600">natural pressure</span> for resolution.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
