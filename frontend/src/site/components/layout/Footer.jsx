import { Link } from "react-router-dom";
import { SiGithub } from "@icons-pack/react-simple-icons";
import logo from "../../assets/logo.svg";

const columns = [
    {
        heading: "Explore",
        links: [
            { label: "Home", to: "/" },
            { label: "How it works", to: "/how-it-works" },
            { label: "About", to: "/about" },
        ],
    },
    {
        heading: "Resources",
        links: [
            { label: "API Docs", to: "/docs/api" },
            { label: "FAQs", to: "/faqs" },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms of Service", to: "/terms" },
        ],
    },
];

const socialLinks = [
    {
        label: "GitHub",
        icon: SiGithub,
        href: "https://github.com/dipranshu-patel/civikeye",
    },
];

function LinkColumn({ heading, links }) {
    return (
        <div className="flex flex-col gap-5 min-w-[120px]">
            <h3 className="font-[var(--font-satoshi)] font-bold text-[16px] text-stone-800">
                {heading}
            </h3>
            <ul className="flex flex-col gap-4">
                {links.map(({ label, to }) => (
                    <li key={to}>
                        <Link
                            to={to}
                            className="font-[var(--font-inter)] text-[15px] font-medium text-stone-500 hover:text-[#ea580c] transition-colors duration-150"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <footer
            className="w-full bg-[#fcfbf7] px-4 pt-12 sm:px-8 pb-0 relative overflow-hidden flex flex-col items-center"
            aria-label="Site footer"
        >
            <div className="max-w-[1200px] w-full mx-auto bg-white rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-stone-200 relative z-10">
                <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-32 justify-between">
                    {/* ── Left: Brand block ── */}
                    <div className="flex flex-col gap-6 max-w-[340px] shrink-0">
                        <Link
                            to="/"
                            className="font-[var(--font-satoshi)] font-bold text-stone-800 flex items-center gap-3 w-fit tracking-tight"
                            aria-label="CivikEye home"
                        >
                            <img
                                src={logo}
                                alt="CivikEye logo"
                                className="h-8 w-auto"
                            />
                            <span className="text-2xl tracking-[0.05em]">
                                CivikEye
                            </span>
                        </Link>

                        <p className="font-[var(--font-inter)] text-base font-medium text-stone-500 leading-relaxed">
                            Public infrastructure for civic accountability.
                            Built for citizens, volunteers, and the institutions
                            that serve them.
                        </p>

                        <div className="flex items-center gap-5 pt-2">
                            {socialLinks.map(({ label, icon: Icon, href }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 transition-colors duration-150"
                                >
                                    <Icon
                                        className="h-5 w-5"
                                        color="currentColor"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Link columns ── */}
                    <nav
                        aria-label="Footer navigation"
                        className="flex flex-wrap md:flex-nowrap gap-12 lg:gap-24"
                    >
                        {columns.map((col) => (
                            <LinkColumn key={col.heading} {...col} />
                        ))}
                    </nav>
                </div>
            </div>

            {/* ── Bottom Watermark Text ── */}
            <div className="-mt-2 md:-mt-6 pointer-events-none select-none flex justify-center w-full translate-y-6 sm:translate-y-10 md:translate-y-16 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]">
                <span className="font-[var(--font-satoshi)] font-bold text-[24vw] md:text-[22vw] leading-none text-orange-100/50 tracking-tight">
                    CivikEye
                </span>
            </div>
        </footer>
    );
}
