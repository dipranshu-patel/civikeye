import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clsx } from "clsx";
import { PanelLeft } from "lucide-react";
import LogoSVG from "../../../site/assets/logo.svg";
import { toggleSidebar } from "../../store/uiSlice";

export default function Sidebar({ navGroups }) {
    const location = useLocation();
    const dispatch = useDispatch();
    const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/20 z-[90] transition-opacity md:hidden"
                    onClick={() => dispatch(toggleSidebar())}
                />
            )}

            <aside
                className={clsx(
                    "bg-gray-50 h-screen top-0 left-0 flex flex-col transition-all duration-300 z-[100] shrink-0",
                    isSidebarOpen
                        ? "w-64 fixed md:sticky shadow-xl md:shadow-none border-r border-gray-200"
                        : "w-0 overflow-hidden md:w-14 md:overflow-visible fixed md:sticky border-none md:border-r md:border-solid md:border-gray-200",
                )}
            >
                <div
                    className={clsx(
                        "h-16 flex items-center",
                        isSidebarOpen
                            ? "justify-between px-4"
                            : "justify-center",
                    )}
                >
                    {isSidebarOpen && (
                        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                            <img
                                src={LogoSVG}
                                alt="CivikEye Logo"
                                className="h-8 w-8 shrink-0"
                            />
                            <span className="font-bold text-xl tracking-tight text-gray-900">
                                CivikEye
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors shrink-0 cursor-pointer"
                    >
                        <PanelLeft className="w-5 h-5" />
                    </button>
                </div>

                <nav
                    className={clsx(
                        "flex-1 overflow-y-auto py-4",
                        !isSidebarOpen && "hidden md:block",
                    )}
                >
                    {navGroups.map((group, idx) => (
                        <div
                            key={idx}
                            className={clsx(
                                "mb-6",
                                isSidebarOpen ? "px-3" : "px-0",
                            )}
                        >
                            {isSidebarOpen && group.title && (
                                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 tracking-wider uppercase">
                                    {group.title}
                                </h3>
                            )}
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        location.pathname === item.path ||
                                        location.pathname.startsWith(
                                            item.path + "/",
                                        );
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                to={item.path}
                                                title={
                                                    !isSidebarOpen
                                                        ? item.name
                                                        : undefined
                                                }
                                                className={clsx(
                                                    "flex items-center rounded-lg text-sm font-medium transition-colors cursor-pointer",
                                                    isSidebarOpen
                                                        ? "gap-3 px-3 py-2.5"
                                                        : "justify-center w-10 h-10 mx-auto",
                                                    isActive
                                                        ? "bg-blue-50 text-blue-700 font-semibold"
                                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                                )}
                                            >
                                                <Icon
                                                    className={clsx(
                                                        "w-5 h-5 shrink-0 transition-all",
                                                        isActive
                                                            ? "text-blue-700"
                                                            : "text-gray-500",
                                                    )}
                                                />
                                                {isSidebarOpen && (
                                                    <span>{item.name}</span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
}
