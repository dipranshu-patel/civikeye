import React from "react";
import { FileText, User, AlertTriangle } from "lucide-react";

type StepType = "reporter" | "uncertain";

interface LifecycleStep {
    number: string;
    label: string;
    type: StepType;
}

const lifecycleSteps: LifecycleStep[] = [
    { number: "01", label: "Reported", type: "reporter" },
    { number: "02", label: "Routed", type: "reporter" },
    { number: "03", label: "Internal queue", type: "reporter" },
    { number: "04", label: "Closed", type: "reporter" },
    { number: "05", label: "Citizen?", type: "uncertain" },
];

const stepConfig: Record<StepType, {
    icon: typeof FileText;
    boxClass: string;
    iconClass: string;
    numberClass: string;
    labelClass: string;
}> = {
    reporter: {
        icon: User,
        boxClass: "bg-amber-50 border-amber-100",
        iconClass: "text-amber-400",
        numberClass: "text-gray-400",
        labelClass: "text-gray-400",
    },
    uncertain: {
        icon: AlertTriangle,
        boxClass: "bg-gray-100 border-gray-100",
        iconClass: "text-gray-300",
        numberClass: "text-gray-300",
        labelClass: "text-gray-300",
    },
};

export default function ProblemSection() {
    return (
        <section className="w-full bg-[#F8FAFC] py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Top Badge ── */}
                <div className="border-l-2 border-[#e4e4e7] pl-5 flex flex-col gap-3 mb-8">
                    <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#71717a] uppercase">
                        The Problem
                    </span>
                    <h2 className="font-[var(--font-satoshi)] text-4xl font-bold text-[#18181b]">
                        Civic systems fail when accountability disappears.
                    </h2>
                </div>

                {/* ── Description ── */}
                <p className="font-[var(--font-inter)] text-[17px] text-gray-500 leading-relaxed max-w-[560px] mb-14">
                    The default state of public complaints is private. That single design choice quietly erodes
                    trust between citizens and the institutions meant to serve them.
                </p>

                {/* ── Lifecycle Card ── */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-7 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">

                    {/* Card header row */}
                    <div className="flex items-center justify-between mb-7">
                        <p className="font-[var(--font-inter)] text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                            Typical Complaint Lifecycle
                        </p>
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
                            <User className="w-3 h-3 text-amber-500" strokeWidth={2} />
                            <span className="font-[var(--font-inter)] text-[11px] font-semibold text-amber-600">
                                Visible only to the reporter
                            </span>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="flex items-start mb-7">
                        {lifecycleSteps.map(({ number, label, type }, i) => {
                            const cfg = stepConfig[type];
                            const Icon = cfg.icon;
                            return (
                                <React.Fragment key={number}>
                                    <div className="flex flex-col items-start gap-2 shrink-0">
                                        <div className={`flex items-center justify-center w-9 h-9 rounded-xl border ${cfg.boxClass}`}>
                                            <Icon className={`w-4 h-4 ${cfg.iconClass}`} strokeWidth={1.75} />
                                        </div>
                                        <span className={`font-[var(--font-geistmono)] text-[11px] font-bold tracking-widest ${cfg.numberClass}`}>
                                            {number}
                                        </span>
                                        <span className={`font-[var(--font-inter)] text-[14px] font-semibold ${cfg.labelClass}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {i < lifecycleSteps.length - 1 && (
                                        <div className={`flex-1 h-px mt-[18px] mx-4 ${i === 0 ? "bg-gray-300" : "bg-gray-150 border-solid border-t border-gray-200"}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Legend row */}
                    <div className="flex items-center gap-5 mb-5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-amber-50 border border-amber-100" />
                            <span className="font-[var(--font-inter)] text-[12px] text-gray-400">Reporter only</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200" />
                            <span className="font-[var(--font-inter)] text-[12px] text-gray-400">Unclear</span>
                        </div>
                    </div>

                    {/* Bottom Description */}
                    <div className="border-t border-gray-100 pt-5">
                        <p className="font-[var(--font-inter)] text-[13px] text-gray-400 leading-relaxed max-w-2xl">
                            Everything is only visible to the person who filed it - and invisible to everyone else, including other affected citizens.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}