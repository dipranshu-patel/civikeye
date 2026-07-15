import React from "react";
import { FileText, User, AlertTriangle } from "lucide-react";

const lifecycleSteps = [
    { number: "01", label: "Reported", type: "reporter" },
    { number: "02", label: "Routed", type: "reporter" },
    { number: "03", label: "Internal queue", type: "reporter" },
    { number: "04", label: "Closed", type: "reporter" },
    { number: "05", label: "Citizen?", type: "uncertain" },
];

const stepConfig = {
    reporter: {
        icon: User,
        boxClass: "bg-orange-50 border-orange-100",
        iconClass: "text-orange-500",
        numberClass: "text-stone-400",
        labelClass: "text-stone-600",
    },
    uncertain: {
        icon: AlertTriangle,
        boxClass: "bg-stone-100 border-stone-200",
        iconClass: "text-stone-400",
        numberClass: "text-stone-400",
        labelClass: "text-stone-400",
    },
};

export default function ProblemSection() {
    return (
        <section className="w-full bg-transparent py-24 lg:py-32">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-l-2 border-[#ea580c] pl-5 flex flex-col gap-3 mb-8">
                    <span className="font-[var(--font-inter)] text-[14px] font-semibold tracking-[0.2em] text-[#ea580c] uppercase">
                        The Problem
                    </span>
                    <h2 className="font-[var(--font-satoshi)] text-4xl font-bold text-stone-800">
                        Civic systems fail when accountability disappears.
                    </h2>
                </div>

                <p className="font-[var(--font-inter)] text-[17px] text-stone-500 leading-relaxed max-w-[560px] mb-14">
                    The default state of public complaints is private. That
                    single design choice quietly erodes trust between citizens
                    and the institutions meant to serve them.
                </p>

                <div className="bg-white rounded-[2rem] border border-stone-200 p-8 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-7 relative z-10">
                        <p className="font-[var(--font-inter)] text-[11px] font-bold text-stone-400 tracking-widest uppercase">
                            Typical Complaint Lifecycle
                        </p>
                        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-full px-3 py-1">
                            <User
                                className="w-3 h-3 text-orange-500"
                                strokeWidth={2}
                            />
                            <span className="font-[var(--font-inter)] text-[11px] font-semibold text-orange-600">
                                Visible only to the reporter
                            </span>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto pb-4">
                        <div className="flex items-start mb-2 min-w-[640px] md:min-w-0">
                            {lifecycleSteps.map(
                                ({ number, label, type }, i) => {
                                    const cfg = stepConfig[type];
                                    const Icon = cfg.icon;
                                    return (
                                        <React.Fragment key={number}>
                                            <div className="flex flex-col items-start gap-2 shrink-0">
                                                <div
                                                    className={`flex items-center justify-center w-9 h-9 rounded-xl border ${cfg.boxClass}`}
                                                >
                                                    <Icon
                                                        className={`w-4 h-4 ${cfg.iconClass}`}
                                                        strokeWidth={1.75}
                                                    />
                                                </div>
                                                <span
                                                    className={`font-[var(--font-geistmono)] text-[11px] font-bold tracking-widest ${cfg.numberClass}`}
                                                >
                                                    {number}
                                                </span>
                                                <span
                                                    className={`font-[var(--font-inter)] text-[14px] font-semibold ${cfg.labelClass}`}
                                                >
                                                    {label}
                                                </span>
                                            </div>
                                            {i < lifecycleSteps.length - 1 && (
                                                <div
                                                    className={`flex-1 h-px mt-[18px] mx-4 ${i === 0 ? "bg-stone-300" : "bg-stone-200 border-solid border-t border-stone-200/60"}`}
                                                />
                                            )}
                                        </React.Fragment>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-5 mb-5 relative z-10">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-orange-50 border border-orange-100" />
                            <span className="font-[var(--font-inter)] text-[12px] text-stone-500">
                                Reporter only
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-stone-100 border border-stone-200" />
                            <span className="font-[var(--font-inter)] text-[12px] text-stone-500">
                                Unclear
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-stone-200/60 pt-5 relative z-10">
                        <p className="font-[var(--font-inter)] text-[13px] text-stone-500 leading-relaxed max-w-2xl">
                            Everything is only visible to the person who filed
                            it - and invisible to everyone else, including other
                            affected citizens.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
