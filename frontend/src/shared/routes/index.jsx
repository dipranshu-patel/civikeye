import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../site/components/layout/MainLayout";
import HomePage from "../../site/pages/public/HomePage";
import HowItWorksPage from "../../site/pages/public/HowItWorksPage";
import AboutPage from "../../site/pages/public/AboutPage";
import PrivacyPolicyPage from "../../site/pages/public/PrivacyPolicyPage";
import TermsOfServicePage from "../../site/pages/public/TermsOfServicePage";
import FAQPage from "../../site/pages/public/FAQPage";
import RegisterPage from "../../site/pages/auth/RegisterPage";
import LoginPage from "../../site/pages/auth/LoginPage";
import ForgotPasswordPage from "../../site/pages/auth/ForgotPassword";
import ResetPasswordPage from "../../site/pages/auth/ResetPassword";

import CitizenLayout from "../../features/citizen/components/layout/CitizenLayout";
import Dashboard from "../../features/citizen/pages/Dashboard";
import ReportComplaint from "../../features/citizen/pages/ReportComplaint";
import ExploreComplaints from "../../features/citizen/pages/ExploreComplaints";
import MyComplaints from "../../features/citizen/pages/MyComplaints";
import VerificationRequests from "../../features/citizen/pages/VerificationRequests";
import Volunteer from "../../features/citizen/pages/Volunteer";
import LeaderboardPage from "../../features/citizen/pages/LeaderboardPage";
import Departments from "../../features/citizen/pages/Departments";
import Settings from "../../features/citizen/pages/Settings";

import DeptLayout from "../../features/dept/components/layout/DeptLayout";
import DeptDashboard from "../../features/dept/pages/Dashboard";
import DeptComplaints from "../../features/dept/pages/Complaints";

import AdminLayout from "../../features/admin/components/layout/AdminLayout";
import AdminDashboard from "../../features/admin/pages/Dashboard";
import AdminDepartments from "../../features/admin/pages/Departments";
import AdminSlaCategories from "../../features/admin/pages/SLACategories";
import AuditLogs from "../../features/admin/pages/AuditLogs";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFoundPage from "../pages/NotFoundPage";

const router = createBrowserRouter([
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />,
    },
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
            {
                path: "/privacy",
                element: <PrivacyPolicyPage />,
            },
            {
                path: "/terms",
                element: <TermsOfServicePage />,
            },
            {
                path: "/faqs",
                element: <FAQPage />,
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["citizen"]} />,
        children: [
            {
                path: "/citizen",
                element: <CitizenLayout />,
                children: [
                    { path: "dashboard", element: <Dashboard /> },
                    { path: "report-complaint", element: <ReportComplaint /> },
                    {
                        path: "explore-complaints",
                        element: <ExploreComplaints />,
                    },
                    { path: "my-complaints", element: <MyComplaints /> },
                    {
                        path: "verification-requests",
                        element: <VerificationRequests />,
                    },
                    { path: "volunteer", element: <Volunteer /> },
                    { path: "leaderboard", element: <LeaderboardPage /> },
                    { path: "departments", element: <Departments /> },
                    { path: "settings", element: <Settings /> },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["official"]} />,
        children: [
            {
                path: "/official",
                element: <DeptLayout />,
                children: [
                    { path: "dashboard", element: <DeptDashboard /> },
                    { path: "complaints", element: <DeptComplaints /> },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
            {
                path: "/admin",
                element: <AdminLayout />,
                children: [
                    { path: "dashboard", element: <AdminDashboard /> },
                    { path: "departments", element: <AdminDepartments /> },
                    {
                        path: "sla-configuration",
                        element: <AdminSlaCategories />,
                    },
                    { path: "audit-logs", element: <AuditLogs /> },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default router;
