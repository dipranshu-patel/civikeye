import { Provider } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ScrollToTop from "../../../../shared/components/ScrollToTop";
import { LayoutDashboard, List, Settings as SettingsIcon } from "lucide-react";
import Sidebar from "../../../../shared/components/layout/Sidebar";
import TopNav from "../../../../shared/components/layout/TopNav";
import { store } from "../../store/store";
import { setPageTitle } from "../../../../shared/store/uiSlice";
import api from "../../../../shared/lib/axios";

const deptNavGroups = [
    {
        title: "OPERATIONS",
        items: [
            {
                name: "Dashboard",
                path: "/official/dashboard",
                icon: LayoutDashboard,
            },
            { name: "Complaints", path: "/official/complaints", icon: List },
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

export default function DeptLayout() {
    const [profile, setProfile] = useState(null);
    const mainRef = useRef(null);

    useEffect(() => {
        api.get("/me")
            .then((res) => {
                setProfile(res.data.data.user);
            })
            .catch(console.error);
    }, []);

    return (
        <Provider store={store}>
            <div className="flex min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-200">
                <Sidebar navGroups={deptNavGroups} brandName="CivikEye Dept" />
                <div className="flex-1 flex flex-col min-w-0">
                    <ScrollToTop containerRef={mainRef} />
                    <PageTitleUpdater />
                    <TopNav profile={profile} settingsLink={null} />
                    <main
                        ref={mainRef}
                        className="flex-1 overflow-y-scroll px-[16px] py-6 md:p-8 lg:p-12 xl:p-8 bg-[#F8FAFC]"
                    >
                        <Outlet />
                    </main>
                </div>
            </div>
        </Provider>
    );
}
