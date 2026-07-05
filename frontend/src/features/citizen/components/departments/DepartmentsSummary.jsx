import { Building2, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DepartmentsSummary({ stats }) {
    if (!stats) return null;

    const summaryCards = [
        {
            title: "Departments",
            value: stats.totalDepartments,
            desc: "publicly tracked",
            icon: Building2,
            gradient: "from-purple-500 to-fuchsia-600",
            shadow: "shadow-purple-900/20",
            textLight: "text-purple-100"
        },
        {
            title: "Avg Response",
            value: stats.avgResponseDays ? `${stats.avgResponseDays}d` : "N/A",
            desc: "across all depts",
            icon: Clock,
            gradient: "from-blue-500 to-cyan-600",
            shadow: "shadow-blue-900/20",
            textLight: "text-blue-100"
        },
        {
            title: "Resolution",
            value: stats.avgResolutionRatePct ? `${stats.avgResolutionRatePct}%` : "0%",
            desc: "system-wide avg",
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-teal-600",
            shadow: "shadow-emerald-900/20",
            textLight: "text-emerald-100"
        },
        {
            title: "Overdue",
            value: stats.totalOverdue,
            desc: "total pending",
            icon: AlertTriangle,
            gradient: "from-amber-500 to-orange-600",
            shadow: "shadow-amber-900/20",
            textLight: "text-amber-100"
        },
        {
            title: "Verified",
            value: stats.publicVerificationPct ? `${stats.publicVerificationPct}%` : "0%",
            desc: "by community",
            icon: ShieldCheck,
            gradient: "from-indigo-500 to-blue-600",
            shadow: "shadow-indigo-900/20",
            textLight: "text-indigo-100"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {summaryCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div 
                        key={idx} 
                        className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 text-white shadow-lg ${card.shadow} relative overflow-hidden`}
                    >
                        <div className="relative z-10">
                            <p className={`${card.textLight} font-medium text-sm mb-1`}>{card.title}</p>
                            <div className="flex flex-col">
                                <h3 className="text-3xl font-bold">{card.value}</h3>
                                <p className={`text-[10px] uppercase tracking-wider mt-1 opacity-70 ${card.textLight}`}>
                                    {card.desc}
                                </p>
                            </div>
                        </div>
                        <Icon className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                    </div>
                );
            })}
        </div>
    );
}
