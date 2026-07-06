import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
