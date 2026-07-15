import { Provider } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ScrollToTop from "../../../../shared/components/ScrollToTop";
import {
    LayoutDashboard,
    Megaphone,
    Search,
    List,
    ShieldCheck,
    Users,
    Building2,
    Settings as SettingsIcon,
} from "lucide-react";
import Sidebar from "../../../../shared/components/layout/Sidebar";
import TopNav from "../../../../shared/components/layout/TopNav";
import { store } from "../../store/store";
import { setPageTitle } from "../../../../shared/store/uiSlice";
import { meService } from "../../services/me.service";
import PublicProfileModal from "../PublicProfileModal";

const citizenNavGroups = [
    {
        title: "CIVIC OPERATIONS",
        items: [
            {
                name: "Dashboard",
                path: "/citizen/dashboard",
                icon: LayoutDashboard,
            },
            {
                name: "Report Complaint",
                path: "/citizen/report-complaint",
                icon: Megaphone,
            },
            {
                name: "Explore Complaints",
                path: "/citizen/explore-complaints",
                icon: Search,
            },
            {
                name: "My Complaints",
                path: "/citizen/my-complaints",
                icon: List,
            },
            {
                name: "Verification Requests",
                path: "/citizen/verification-requests",
                icon: ShieldCheck,
            },
            { name: "Volunteer", path: "/citizen/volunteer", icon: Users },
            {
                name: "Departments",
                path: "/citizen/departments",
                icon: Building2,
            },
        ],
    },
    {
        title: "ACCOUNT",
        items: [
            { name: "Settings", path: "/citizen/settings", icon: SettingsIcon },
        ],
    },
];

function PageTitleUpdater() {
    const location = useLocation();

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        const pageSegment =
            pathSegments[pathSegments.length - 1] || "Dashboard";

        const title = pageSegment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        store.dispatch(setPageTitle(title));
    }, [location]);

    return null;
}

export default function CitizenLayout() {
    const [profile, setProfile] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const mainRef = useRef(null);

    useEffect(() => {
        meService
            .getProfile()
            .then((res) => {
                setProfile(res.data.data.user);
            })
            .catch(console.error);
    }, []);

    return (
        <Provider store={store}>
            <div className="flex min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-200">
                <Sidebar navGroups={citizenNavGroups} />
                <div className="flex-1 flex flex-col min-w-0">
                    <ScrollToTop containerRef={mainRef} />
                    <PageTitleUpdater />
                    <TopNav
                        profile={profile}
                        settingsLink="/citizen/settings"
                        leaderboardLink="/citizen/leaderboard"
                        onProfileClick={() => setIsProfileModalOpen(true)}
                    />
                    <main
                        ref={mainRef}
                        className="flex-1 overflow-y-scroll px-[16px] py-6 md:p-8 lg:p-12 xl:p-8 bg-[#F8FAFC]"
                    >
                        <Outlet />
                    </main>
                </div>
            </div>

            {isProfileModalOpen && profile && (
                <PublicProfileModal
                    userId={profile.id}
                    onClose={() => setIsProfileModalOpen(false)}
                />
            )}
        </Provider>
    );
}
