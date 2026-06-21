import { Link } from "react-router-dom";
import { SiGithub, SiX, SiLinkerd } from "@icons-pack/react-simple-icons";
import logo from "../../assets/logo.svg";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FooterLink {
    label: string;
    to: string;
}

interface FooterColumn {
    heading: string;
    links: FooterLink[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const columns: FooterColumn[] = [
    {
        heading: "PRODUCT",
        links: [
            { label: "Features", to: "/features" },
            { label: "How it works", to: "/how-it-works" },
            { label: "Transparency", to: "/transparency" },
            { label: "Pricing", to: "/pricing" },
        ],
    },
    {
        heading: "FOR",
        links: [
            { label: "Citizens", to: "/for/citizens" },
            { label: "Volunteers", to: "/for/volunteers" },
            { label: "Departments", to: "/for/departments" },
            { label: "Administrators", to: "/for/administrators" },
        ],
    },
    {
        heading: "RESOURCES",
        links: [
            { label: "Documentation", to: "/docs" },
            { label: "API reference", to: "/docs/api" },
            { label: "Open data", to: "/open-data" },
            { label: "Changelog", to: "/changelog" },
        ],
    },
    {
        heading: "COMPANY",
        links: [
            { label: "About", to: "/about" },
            { label: "Blog", to: "/blog" },
            { label: "Press", to: "/press" },
            { label: "Contact", to: "/contact" },
        ],
    },
];

const socialLinks = [
    { label: "Twitter / X", icon: SiX, href: "https://twitter.com" },
    { label: "GitHub", icon: SiGithub, href: "https://github.com" },
    { label: "LinkedIn", icon: SiLinkerd, href: "https://linkedin.com" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function LinkColumn({ heading, links }: FooterColumn) {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="font-[var(--font-inter)] font-medium text-[11px] tracking-widest text-[#71717a] uppercase">
                {heading}
            </h3>
            <ul className="flex flex-col gap-3.5">
                {links.map(({ label, to }) => (
                    <li key={to}>
                        <Link
                            to={to}
                            className="font-[var(--font-inter)] text-[13px] text-[#18181b] hover:text-[#71717a] transition-colors duration-150"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Footer() {
    return (
        <footer className="w-full bg-[#F8FAFC] border-t border-[#e4e4e7]" aria-label="Site footer">

            {/* ── Main footer body ── */}
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between">

                    {/* ── Left: Brand block ── */}
                    <div className="flex flex-col gap-3 max-w-[300px] shrink-0">
                        {/* Logo & Brand Name */}
                        <Link
                            to="/"
                            className="font-[var(--font-satoshi)] font-bold text-lg text-[#18181b] flex items-center gap-2.5 w-fit tracking-tight"
                            aria-label="CivikEye home"
                        >
                            <img
                                src={logo}
                                alt="CivikEye logo"
                                className="h-10 w-auto"
                            />
                            <span className="text-xl">CivikEye</span>
                        </Link>

                        {/* Description */}
                        <p className="font-[var(--font-inter)] text-[13px] text-[#71717a] leading-relaxed">
                            Public infrastructure for civic accountability. Built for citizens,
                            volunteers, and the institutions that serve them.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-2 pt-1">
                            {socialLinks.map(({ label, icon: Icon, href }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-[#e4e4e7] text-[#71717a] bg-white hover:text-[#18181b] hover:border-[#d4d4d8] transition-all duration-150"
                                >
                                    <Icon className="h-4 w-4" color="currentColor" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: Link columns ── */}
                    <nav
                        aria-label="Footer navigation"
                        className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-10 lg:gap-x-20"
                    >
                        {columns.map((col) => (
                            <LinkColumn key={col.heading} {...col} />
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
