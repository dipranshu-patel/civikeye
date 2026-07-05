import { Trophy } from "lucide-react";

export default function DepartmentsLeaderboard({ departments }) {
    const topDepartments = [...departments]
        .sort((a, b) => (b.resolutionRatePct || 0) - (a.resolutionRatePct || 0))
        .slice(0, 5);

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-emerald-500" />
                <h2 className="font-bold text-gray-900">
                    Top performers
                </h2>
            </div>

            <div className="space-y-1">
                {topDepartments.map((dept, idx) => (
                    <div
                        key={dept.id}
                        className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors"
                    >
                        <div className="w-4 font-mono text-xs text-gray-400">
                            #{idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-gray-900 truncate">
                                {dept.name}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-sm text-gray-900">
                                {dept.resolutionRatePct || 0}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {topDepartments.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-500">
                    No departments available.
                </div>
            )}
        </div>
    );
}
