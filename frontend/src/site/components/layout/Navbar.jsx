import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import logo from "../../assets/logo.svg";

const navLinks = [
    { label: "Home", to: "/" },
    { label: "How it works", to: "/how-it-works" },
    { label: "About", to: "/about" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="w-full bg-white/20 backdrop-blur-md sticky border-b border-[#e4e4e7] top-0 z-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link
                        to="/"
                        className="font-[var(--font-satoshi)] font-semibold flex items-center gap-1.5 shrink-0"
                        aria-label="CivikEye home"
                    >
                        <img
                            src={logo}
                            alt="CivikEye logo"
                            className="h-12 w-auto"
                        />
                        <span className="text-lg font-bold tracking-[0.15em] uppercase text-slate-600">
                            CivikEye
                        </span>
                    </Link>

                    <nav
                        aria-label="Primary navigation"
                        className="hidden md:flex items-center gap-8"
                    >
                        {navLinks.map(({ label, to }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === "/"}
                                className={({ isActive }) =>
                                    [
                                        "font-[var(--font-inter)] text-sm font-medium transition-colors duration-150",
                                        isActive
                                            ? "text-gray-900"
                                            : "text-gray-500 hover:text-gray-900",
                                    ].join(" ")
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        {localStorage.getItem('accessToken') ? (
                            <Link
                                to={`/${localStorage.getItem('userRole') || 'citizen'}/dashboard`}
                                className="font-[var(--font-inter)] inline-flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-150"
                            >
                                Dashboard
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="font-[var(--font-inter)] text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="font-[var(--font-inter)] inline-flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-150"
                                >
                                    Report an issue
                                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        className="font-[var(--font-inter)] md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150"
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            <Menu className={`absolute w-5 h-5 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
                            <X className={`absolute w-5 h-5 transition-all duration-300 ${mobileOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} />
                        </div>
                    </button>
                </div>
            </div>

            <div
                id="mobile-menu"
                className={`md:hidden grid transition-all duration-300 ease-in-out bg-white ${
                    mobileOpen ? "grid-rows-[1fr] opacity-100 border-t border-gray-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <nav
                        aria-label="Mobile navigation"
                        className="flex flex-col px-4 py-4 gap-1"
                    >
                        {navLinks.map(({ label, to }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === "/"}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    [
                                        "font-[var(--font-inter)] text-sm font-medium px-3 py-2 rounded-md transition-colors duration-150",
                                        isActive
                                            ? "text-gray-900 bg-gray-50"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                                    ].join(" ")
                                }
                            >
                                {label}
                            </NavLink>
                        ))}

                        <hr className="my-2 border-gray-100" />

                        {localStorage.getItem('accessToken') ? (
                            <Link
                                to={`/${localStorage.getItem('userRole') || 'citizen'}/dashboard`}
                                onClick={() => setMobileOpen(false)}
                                className="font-[var(--font-inter)] inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors duration-150 mt-1"
                            >
                                Dashboard
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="font-[var(--font-inter)] text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-150"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="font-[var(--font-inter)] inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors duration-150 mt-1"
                                >
                                    Report an issue
                                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
