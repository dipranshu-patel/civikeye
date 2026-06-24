import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * MainLayout wraps all public-facing pages.
 * It renders the shared Navbar at the top, the route's page via <Outlet />,
 * and the shared Footer at the bottom — ensuring Navbar/Footer are never
 * duplicated inside individual page components.
 */
export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
