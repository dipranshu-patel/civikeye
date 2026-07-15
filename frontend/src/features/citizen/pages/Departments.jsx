import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../shared/store/uiSlice";
import { departmentService } from "../services/departments.service";
import {
    Building2,
    Search,
    SlidersHorizontal,
    AlertTriangle,
    ShieldCheck,
    Clock,
    CheckCircle2,
    ChevronDown,
} from "lucide-react";
import DepartmentsSummary from "../components/departments/DepartmentsSummary";
import DepartmentsLeaderboard from "../components/departments/DepartmentsLeaderboard";
import DepartmentCard from "../components/departments/DepartmentCard";
import DepartmentReportModal from "../components/departments/DepartmentReportModal";

export default function Departments() {
    const dispatch = useDispatch();
    const [stats, setStats] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle("Departments"));

        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsData, deptsData, catsData] = await Promise.all([
                    departmentService.getStats(),
                    departmentService.getDepartments(),
                    departmentService.getCategories(),
                ]);
                setStats(statsData);
                setDepartments(deptsData);
                setFilteredDepartments(deptsData);
                setCategories(catsData);
            } catch (error) {
                console.error("Failed to fetch departments data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        let result = departments;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (d) =>
                    d.name.toLowerCase().includes(query) ||
                    (d.description &&
                        d.description.toLowerCase().includes(query)),
            );
        }

        if (selectedCategory !== "All") {
            result = result.filter((d) => d.category === selectedCategory);
        }

        setFilteredDepartments(result);
    }, [searchQuery, selectedCategory, departments]);

    const handleOpenReport = (dept) => {
        setSelectedDepartment(dept);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50/50">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50/50 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8">
                {stats && <DepartmentsSummary stats={stats} />}

                <div className="flex gap-8">
                    <div className="flex-1 min-w-0 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search departments..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="flex items-center gap-2 text-gray-400 mr-2 text-sm">
                                    <SlidersHorizontal className="w-4 h-4" />
                                </div>

                                <button
                                    onClick={() => setSelectedCategory("All")}
                                    className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors cursor-pointer ${
                                        selectedCategory === "All"
                                            ? "bg-gray-900 text-white font-medium"
                                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    All
                                    <span
                                        className={`ml-2 text-xs ${selectedCategory === "All" ? "text-gray-300" : "text-gray-400"}`}
                                    >
                                        {departments.length}
                                    </span>
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setIsCategoryOpen(!isCategoryOpen)
                                        }
                                        className={`flex items-center justify-between gap-2 px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors cursor-pointer ${
                                            selectedCategory !== "All"
                                                ? "bg-gray-900 text-white font-medium border border-gray-900"
                                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span>
                                            {selectedCategory === "All"
                                                ? "Select Category"
                                                : selectedCategory}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-300 ${
                                                isCategoryOpen
                                                    ? "rotate-180"
                                                    : ""
                                            } ${selectedCategory !== "All" ? "text-white" : "text-gray-400"}`}
                                        />
                                    </button>

                                    {isCategoryOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() =>
                                                    setIsCategoryOpen(false)
                                                }
                                            ></div>
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-50/95 backdrop-blur-sm border border-gray-200 shadow-xl text-gray-900 rounded-xl py-2 z-20 overflow-hidden ring-1 ring-black/5">
                                                {categories.map((category) => {
                                                    const isSelected =
                                                        selectedCategory ===
                                                        category;
                                                    return (
                                                        <button
                                                            key={category}
                                                            onClick={() => {
                                                                setSelectedCategory(
                                                                    category,
                                                                );
                                                                setIsCategoryOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className={`group w-full text-left px-5 py-2.5 text-sm transition-all duration-300 relative cursor-pointer ${
                                                                isSelected
                                                                    ? "text-gray-900 font-bold bg-slate-100/80"
                                                                    : "text-gray-600 font-medium hover:text-gray-900 hover:bg-slate-100/50"
                                                            }`}
                                                        >
                                                            {category}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500 py-2 border-b border-gray-100">
                            <div>
                                Showing{" "}
                                <span className="font-semibold text-gray-900">
                                    {filteredDepartments.length}
                                </span>{" "}
                                of {departments.length} departments
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium text-right">
                                Sorted by resolution rate
                            </div>
                        </div>

                        <div className="space-y-4 pb-12">
                            {filteredDepartments.map((dept) => (
                                <DepartmentCard
                                    key={dept.id}
                                    department={dept}
                                    onOpenReport={() => handleOpenReport(dept)}
                                />
                            ))}

                            {filteredDepartments.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-gray-900 font-medium">
                                        No departments found
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Try adjusting your search or filters.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:block w-96 flex-shrink-0">
                        <div className="sticky top-0">
                            <DepartmentsLeaderboard departments={departments} />
                        </div>
                    </div>
                </div>
            </div>

            <DepartmentReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                department={selectedDepartment}
            />
        </div>
    );
}
