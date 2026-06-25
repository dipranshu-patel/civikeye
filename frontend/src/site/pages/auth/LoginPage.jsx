import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, ShieldCheck, Users, Mail, Lock, MoveRight } from "lucide-react";
import { authService } from "../../services/auth.service";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import LogoSVG from "../../assets/logo.svg";

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Form Data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Errors (submission only validation)
    const [fieldErrors, setFieldErrors] = useState({});
    const [globalError, setGlobalError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Reset errors
        setFieldErrors({});
        setGlobalError(null);
        
        let hasError = false;
        const errs = {};
        
        if (!email.trim()) {
            errs.email = "Email is required.";
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = "Please provide a valid email address.";
            hasError = true;
        }
        
        if (!password) {
            errs.password = "Password is required.";
            hasError = true;
        }

        if (hasError) {
            setFieldErrors(errs);
            return;
        }

        setLoading(true);
        try {
            // Note: backend login logic should issue cookies/tokens
            await authService.login(email, password);
            navigate("/");
        } catch (err) {
            setGlobalError(
                err.response?.data?.error?.message ||
                err.response?.data?.errors?.[0]?.message ||
                "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-200">
            <div className="flex min-h-screen">
                {/* Left Panel */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gray-50 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-10">
                            <img
                                src={LogoSVG}
                                alt="CivikEye Logo"
                                className="h-16"
                            />
                            <span className="font-bold text-3xl tracking-tight">
                                CivikEye
                            </span>
                        </div>

                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6 max-w-xl leading-[1.1]">
                            Every civic issue<br />
                            deserves public visibility.
                        </h1>
                        <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                            Track issues. Verify resolutions. Build accountability - together.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-8 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-gray-400" />
                            Public accountability by design
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            Community verified
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 py-12 min-h-screen bg-white">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
                            Welcome back.
                        </h2>
                        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                            Continue tracking issues, verifying resolutions, and holding your city to a public clock.
                        </p>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={Mail}
                                    error={fieldErrors.email}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {}}
                                        className="text-sm font-medium text-gray-900 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        icon={Lock}
                                        error={fieldErrors.password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {globalError && (
                                <p className="text-sm text-red-500 font-medium text-center">
                                    {globalError}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={loading}
                            >
                                {loading ? "Signing in..." : (
                                    <span className="flex items-center gap-2">
                                        Sign in <MoveRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                New to CivikEye?{" "}
                                <Link
                                    to="/register"
                                    className="font-semibold text-gray-900 hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>

                        <div className="mt-8 text-center space-y-1">
                            <p className="text-xs text-gray-500">Protected by community-verified workflows.</p>
                            <p className="text-xs text-gray-500">Issue records remain part of the public ledger after sign-in.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
