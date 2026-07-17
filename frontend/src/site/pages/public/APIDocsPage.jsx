import { useState, useEffect } from "react";
import {
    ChevronDown,
    ChevronUp,
    Lock,
    Globe,
    Copy,
    Check,
    ChevronsUpDown,
} from "lucide-react";
import { apiCategories } from "../../data/api-docs";

const getMethodColor = (method) => {
    switch (method.toUpperCase()) {
        case "GET":
            return "bg-green-100 text-green-700 border-green-200";
        case "POST":
            return "bg-orange-100 text-orange-700 border-orange-200";
        case "PATCH":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "DELETE":
            return "bg-red-100 text-red-700 border-red-200";
        default:
            return "bg-stone-100 text-stone-700 border-stone-200";
    }
};

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
            title="Copy to clipboard"
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-400" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
};

const EndpointCard = ({ endpoint, globalExpand }) => {
    const [showJson, setShowJson] = useState(false);

    useEffect(() => {
        if (globalExpand !== null) {
            setShowJson(globalExpand);
        }
    }, [globalExpand]);

    return (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${getMethodColor(
                            endpoint.method,
                        )} uppercase tracking-wider`}
                    >
                        {endpoint.method}
                    </span>
                    <code className="font-mono text-sm sm:text-base font-semibold text-stone-800 bg-stone-50 px-2 py-1 rounded">
                        {endpoint.path}
                    </code>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200 shrink-0">
                    {endpoint.requiresAuth ? (
                        <>
                            <Lock className="w-3 h-3" />
                            Requires Auth
                        </>
                    ) : (
                        <>
                            <Globe className="w-3 h-3" />
                            Public
                        </>
                    )}
                </div>
            </div>

            <p className="text-stone-500 text-sm leading-relaxed mb-4">
                {endpoint.description}
            </p>

            <button
                onClick={() => setShowJson(!showJson)}
                className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
            >
                {showJson ? (
                    <>
                        <ChevronUp className="w-4 h-4" /> Hide JSON Payload
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4" /> Show JSON Payload
                    </>
                )}
            </button>

            {showJson && (
                <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                            Request Body (JSON)
                        </div>
                        <div className="bg-stone-900 rounded-xl p-4 flex-1 relative">
                            {endpoint.requestBody && (
                                <CopyButton
                                    text={JSON.stringify(
                                        endpoint.requestBody,
                                        null,
                                        2,
                                    )}
                                />
                            )}
                            <pre className="text-sm font-mono text-stone-300 overflow-x-auto pr-8">
                                {endpoint.requestBody
                                    ? JSON.stringify(
                                          endpoint.requestBody,
                                          null,
                                          2,
                                      )
                                    : "// No request body required"}
                            </pre>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            Response Body (200 OK)
                        </div>
                        <div className="bg-stone-900 rounded-xl p-4 flex-1 relative">
                            {endpoint.responseBody && (
                                <CopyButton
                                    text={JSON.stringify(
                                        endpoint.responseBody,
                                        null,
                                        2,
                                    )}
                                />
                            )}
                            <pre className="text-sm font-mono text-stone-300 overflow-x-auto pr-8">
                                {endpoint.responseBody
                                    ? JSON.stringify(
                                          endpoint.responseBody,
                                          null,
                                          2,
                                      )
                                    : "// No response body"}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function APIDocsPage() {
    const [activeCategory, setActiveCategory] = useState(apiCategories[0]?.id);
    const [globalExpand, setGlobalExpand] = useState(null);
    const [allExpanded, setAllExpanded] = useState(false);

    const handleToggleAll = () => {
        const next = !allExpanded;
        setAllExpanded(next);
        setGlobalExpand(next);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveCategory(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -70% 0px" },
        );

        apiCategories.forEach((cat) => {
            const element = document.getElementById(cat.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-[#fcfbf7] font-[var(--font-inter)] text-stone-800 selection:bg-orange-200 selection:text-orange-900">
            <div className="bg-[#fcfbf7] border-b border-stone-200 pt-20 pb-16 px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">
                    <h1 className="font-[var(--font-satoshi)] text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 mb-4">
                        API Documentation
                    </h1>
                    <p className="text-lg text-stone-500 leading-relaxed">
                        Integrate with CivikEye to build custom dashboards, pull
                        data, or automate community verifications.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-12">
                <div className="md:w-64 shrink-0">
                    <div className="sticky top-24 space-y-1">
                        <h3 className="font-[var(--font-satoshi)] font-bold text-stone-900 mb-4 px-3 uppercase tracking-wider text-sm">
                            Categories
                        </h3>
                        {apiCategories.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <a
                                    key={cat.id}
                                    href={`#${cat.id}`}
                                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                        isActive
                                            ? "text-orange-800 bg-orange-100 font-bold"
                                            : "font-medium text-stone-500 hover:text-orange-600 hover:bg-orange-50"
                                    }`}
                                >
                                    {cat.title}
                                </a>
                            );
                        })}

                        <div className="mt-6 pt-5 border-t border-stone-200">
                            <button
                                onClick={handleToggleAll}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm font-semibold text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                            >
                                <ChevronsUpDown className="w-4 h-4 shrink-0" />
                                {allExpanded
                                    ? "Collapse All"
                                    : "Expand All Payloads"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-16">
                    {apiCategories.map((category) => (
                        <div
                            key={category.id}
                            id={category.id}
                            className="scroll-mt-24"
                        >
                            <div className="mb-6">
                                <h2 className="font-[var(--font-satoshi)] text-2xl font-bold text-stone-900 mb-2">
                                    {category.title}
                                </h2>
                                <p className="text-stone-500">
                                    {category.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {category.endpoints.map((endpoint, idx) => (
                                    <EndpointCard
                                        key={idx}
                                        endpoint={endpoint}
                                        globalExpand={globalExpand}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
