import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Users, Lock, Eye, EyeOff, MoveRight, ArrowLeft, CheckCircle2, X } from "lucide-react";
import { authService } from "../../services/auth.service";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import LogoSVG from "../../assets/logo.svg";

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    // Form Data
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Errors
    const [fieldErrors, setFieldErrors] = useState({});
    const [globalError, setGlobalError] = useState(null);

    const [touched, setTouched] = useState({
        password: false,
        confirmPassword: false,
    });

    const handleBlur = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

    const passwordRules = [
        {
            id: "lower",
            label: "At least one lower case letter",
            passed: /[a-z]/.test(password),
        },
        {
            id: "upper",
            label: "At least one upper letter",
            passed: /[A-Z]/.test(password),
        },
        {
            id: "number",
            label: "At least one number",
            passed: /[0-9]/.test(password),
        },
        {
            id: "special",
            label: "At least one special character",
            passed: /[^A-Za-z0-9]/.test(password),
        },
        {
            id: "length",
            label: "Be at least 8 characters",
            passed: password.length >= 8,
        },
    ];

    const isPasswordValid = passwordRules.every((r) => r.passed);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset errors
        setFieldErrors({});
        setGlobalError(null);
        
        let hasError = false;
        const errs = {};
        
        if (!password) {
            errs.password = "Password is required.";
            hasError = true;
        } else if (!isPasswordValid) {
            errs.password = "Password does not meet all requirements.";
            hasError = true;
        }

        if (!confirmPassword) {
            errs.confirmPassword = "Please confirm your password.";
            hasError = true;
        } else if (password !== confirmPassword) {
            errs.confirmPassword = "Passwords do not match.";
            hasError = true;
        }
        
        if (hasError) {
            setFieldErrors(errs);
            setTouched({ password: true, confirmPassword: true });
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            if (!err.response || err.response.status >= 500) {
                setGlobalError("Server is currently unavailable. Please try again later.");
            } else {
                setGlobalError(
                    err.response?.data?.error?.message ||
                    err.response?.data?.errors?.[0]?.message ||
                    "Invalid or expired reset link. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
                    <p className="text-gray-600 mb-6">
                        Invalid password reset link. It may be missing or malformed.
                    </p>
                    <Link to="/forgot-password">
                        <Button className="w-full">Go to Forgot Password</Button>
                    </Link>
                </div>
            </div>
        );
    }

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
                            Reset Password
                        </h2>
                        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                            Create a strong new password for your account.
                        </p>

                        {success ? (
                            <div className="bg-green-50 text-green-800 p-6 rounded-lg border border-green-200 text-center space-y-3">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg">Password reset successfully.</h3>
                                <p className="text-sm">Redirecting to login...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onBlur={() => handleBlur("password")}
                                            icon={Lock}
                                            error={fieldErrors.password}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    
                                    {(!isPasswordValid && (password.length > 0 || touched.password)) && (
                                        <div className="mt-3 p-4 bg-white border border-gray-100 rounded-lg shadow-sm space-y-2">
                                            <p className="text-sm font-semibold text-gray-900 mb-2">
                                                Password requirements:
                                            </p>
                                            {passwordRules.map((rule) => (
                                                <div
                                                    key={rule.id}
                                                    className="flex items-center text-sm"
                                                >
                                                    {rule.passed ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                                                    ) : (
                                                        <X className="w-4 h-4 text-red-500 mr-2 shrink-0 stroke-[3]" />
                                                    )}
                                                    <span
                                                        className={
                                                            rule.passed
                                                                ? "text-green-700"
                                                                : "text-red-500"
                                                        }
                                                    >
                                                        {rule.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onBlur={() => handleBlur("confirmPassword")}
                                            icon={Lock}
                                            error={fieldErrors.confirmPassword || (touched.confirmPassword && confirmPassword && password !== confirmPassword ? "Passwords do not match." : undefined)}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                                    disabled={loading || (touched.password && !isPasswordValid)}
                                >
                                    {loading ? "Resetting..." : (
                                        <span className="flex items-center gap-2">
                                            Reset Password <MoveRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        )}
                        
                        {!success && (
                            <div className="mt-8 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:underline"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
