import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Building2,
    Calendar,
    Mail,
    Tag,
    Activity,
    MoreHorizontal,
} from "lucide-react";
import { adminService } from "../services/admin.service";
import ViewDepartmentModal from "../components/ViewDepartmentModal";
import CreateDepartmentForm from "../components/CreateDepartmentForm";

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [viewDepartment, setViewDepartment] = useState(null);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const res = await adminService.getDepartments();
            setDepartments(res.data.data.departments || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load departments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const total = departments.length;
    const active = departments.filter((d) => d.isActive).length;
    const inactive = departments.filter((d) => !d.isActive).length;

    const filteredDepartments = departments.filter(
        (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading && departments.length === 0) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                Loading departments...
            </div>
        );
    }

    if (error && departments.length === 0) {
        return <div className="text-red-500 text-sm font-medium">{error}</div>;
    }

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto min-h-[60vh] animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Departments
                    </h2>
                    <p className="text-gray-500">
                        Manage department accounts and operational scope.
                    </p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Create Department
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium text-sm mb-1 whitespace-nowrap">
                            TOTAL DEPARTMENTS
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">{total}</h3>
                        </div>
                    </div>
                    <Building2 className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium text-sm mb-1 whitespace-nowrap">
                            ACTIVE
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">{active}</h3>
                        </div>
                    </div>
                    <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl p-5 text-white shadow-lg shadow-gray-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-gray-100 font-medium text-sm mb-1 whitespace-nowrap">
                            INACTIVE
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">{inactive}</h3>
                        </div>
                    </div>
                    <Tag className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>
            </div>

            {isCreating && (
                <CreateDepartmentForm
                    onCancel={() => setIsCreating(false)}
                    onCreated={() => {
                        setIsCreating(false);
                        fetchDepartments();
                    }}
                />
            )}

            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex justify-between items-center">
                    <span>EXISTING DEPARTMENTS</span>
                    <span className="font-medium lowercase text-gray-400">
                        {filteredDepartments.length} departments
                    </span>
                </p>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search departments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black text-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Created</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredDepartments.map((dept) => (
                                    <tr
                                        key={dept.id}
                                        className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                        onClick={() => setViewDepartment(dept)}
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {dept.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {dept.code || "No code"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {dept.category || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {dept.email || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                    dept.isActive
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {dept.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(dept.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() =>
                                                    setViewDepartment(dept)
                                                }
                                                className="text-gray-500 hover:text-black font-medium transition-colors flex items-center justify-end gap-2 w-full cursor-pointer"
                                            >
                                                View{" "}
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    &rarr;
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredDepartments.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            No departments found matching your
                                            criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {viewDepartment && (
                <ViewDepartmentModal
                    department={viewDepartment}
                    onClose={() => setViewDepartment(null)}
                    onUpdate={() => {
                        fetchDepartments();
                        setViewDepartment(null); 
                    }}
                />
            )}
        </div>
    );
}
