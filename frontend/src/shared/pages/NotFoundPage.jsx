import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
            <div className="max-w-md sm:max-w-5xl w-full">
                <h1 className="text-[120px] font-black leading-none text-gray-900 select-none">
                    4<span className="text-indigo-500">0</span>4
                </h1>

                <div className="w-16 h-1 bg-indigo-500 rounded-full mx-auto my-6" />

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Page not found
                </h2>
                <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
                    Sorry, we couldn't find the page you're looking for. It may
                    have been moved or deleted.
                </p>

                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go back
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium cursor-pointer"
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
}
