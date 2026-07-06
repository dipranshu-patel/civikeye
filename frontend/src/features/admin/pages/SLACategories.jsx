import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Clock,
    Info,
    Pencil,
    ChevronRight,
    ListTodo,
    Zap,
    AlertCircle,
} from "lucide-react";
import { adminService } from "../services/admin.service";
import CreateSLACategoryModal from "../components/CreateSLACategoryModal";
import EditSLACategoryModal from "../components/EditSLACategoryModal";

export default function SLACategories() {
    const [categories, setCategories] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await adminService.getSlaCategories();
            setCategories(res.data.data.categories || []);
            setSummary(res.data.data.summary || null);
        } catch (err) {
            console.error("Failed to load SLA data:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const filteredCategories = categories.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.department?.name
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        SLA Configuration
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Configure complaint resolution timelines and
                        accountability rules.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium text-sm mb-1 whitespace-nowrap">
                            CONFIGURED CATEGORIES
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary?.total || 0}
                            </h3>
                        </div>
                    </div>
                    <ListTodo className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-emerald-100 font-medium text-sm mb-1 whitespace-nowrap">
                            AVERAGE SLA
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary?.avgSlaDays
                                    ? summary.avgSlaDays.toFixed(1)
                                    : 0}
                                d
                            </h3>
                            <span className="text-emerald-100 text-sm font-medium">
                                city-wide
                            </span>
                        </div>
                    </div>
                    <Clock className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-amber-100 font-medium text-sm mb-1 whitespace-nowrap">
                            FASTEST SLA
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary?.fastestDays || 0}d
                            </h3>
                        </div>
                    </div>
                    <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-5 text-white shadow-lg shadow-rose-900/20 relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <p className="text-rose-100 font-medium text-sm mb-1 whitespace-nowrap">
                            LONGEST SLA
                        </p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold">
                                {summary?.longestDays || 0}d
                            </h3>
                        </div>
                    </div>
                    <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20" />
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-medium text-blue-900">
                        SLA rules determine public accountability
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                        When complaints exceed their SLA deadline, they become
                        overdue and publicly visible as delayed. This directly
                        affects department performance metrics and public trust
                        scores.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                            Configured SLA Categories
                        </h2>
                        <span className="text-sm text-gray-500">
                            {filteredCategories.length} categories
                        </span>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    SLA Duration
                                </th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="py-8 text-center text-gray-500 text-sm"
                                    >
                                        Loading categories...
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="py-8 text-center text-gray-500 text-sm"
                                    >
                                        No SLA categories found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() =>
                                            setEditingCategory(category)
                                        }
                                    >
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">
                                                {category.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {category.department?.name ||
                                                    "Unassigned"}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1.5 text-gray-900 text-sm font-medium">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {category.slaDurationDays} Days
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-600">
                                                {formatDate(
                                                    category.updatedAt ||
                                                        category.createdAt,
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() =>
                                                        setEditingCategory(
                                                            category,
                                                        )
                                                    }
                                                    className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-1.5 transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    Edit / View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateSLACategoryModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreated={() => {
                        setIsCreateModalOpen(false);
                        loadData();
                    }}
                />
            )}

            {editingCategory && (
                <EditSLACategoryModal
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onUpdated={() => {
                        setEditingCategory(null);
                        loadData();
                    }}
                />
            )}
        </div>
    );
}
