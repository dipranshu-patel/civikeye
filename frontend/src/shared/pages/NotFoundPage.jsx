import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fcfbf7] font-[var(--font-inter)] text-stone-800 selection:bg-orange-200 selection:text-orange-900 flex flex-col items-center justify-center px-6 text-center">
            <div className="max-w-md sm:max-w-5xl w-full">
                <h1 className="font-[var(--font-satoshi)] text-[120px] md:text-[150px] font-bold leading-none tracking-tight text-stone-800 select-none">
                    4<span className="text-orange-600">0</span>4
                </h1>

                <div className="w-16 h-1.5 bg-orange-500 rounded-full mx-auto my-6 md:my-8" />

                <h2 className="font-[var(--font-satoshi)] text-3xl md:text-4xl font-bold tracking-tight text-stone-800 mb-4">
                    Page not found
                </h2>
                <p className="text-stone-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                    Sorry, we couldn't find the page you're looking for. It may
                    have been moved or deleted.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-6 py-3 rounded-full border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:border-stone-300 shadow-sm transition-all text-sm md:text-base font-medium cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go back
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-600 text-white hover:bg-orange-700 shadow-sm shadow-orange-200 transition-all text-sm md:text-base font-medium cursor-pointer"
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
}
