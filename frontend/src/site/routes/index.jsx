import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/public/HomePage";
import HowItWorksPage from "../pages/public/HowItWorksPage";
import AboutPage from "../pages/public/AboutPage";

/**
 * Application route tree.
 *
 * MainLayout is a layout route — it renders Navbar + Footer once
 * and delegates page content to <Outlet />.  All public pages are
 * children of this layout route so they automatically inherit the
 * shared shell without needing to import Navbar/Footer themselves.
 */
const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/how-it-works",
                element: <HowItWorksPage />,
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
        ],
    },
]);

export default router;
