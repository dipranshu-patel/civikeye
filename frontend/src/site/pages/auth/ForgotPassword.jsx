import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ShieldCheck, Users, MoveRight, ArrowLeft } from "lucide-react";
import { authService } from "../../services/auth.service";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import LogoSVG from "../../assets/logo.svg";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({});
    const [globalError, setGlobalError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        if (hasError) {
            setFieldErrors(errs);
            return;
        }

        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            if (!err.response || err.response.status >= 500) {
                setGlobalError(
                    "Server is currently unavailable. Please try again later.",
                );
            } else {
                setSuccess(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfbf7] font-[var(--font-inter)] text-stone-800 selection:bg-orange-200 selection:text-orange-900">
            <div className="flex min-h-screen">
                {/* Left Panel */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#f4f3ed] relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-10">
                            <img
                                src={LogoSVG}
                                alt="CivikEye Logo"
                                className="h-16"
                            />
                            <span className="font-[var(--font-satoshi)] font-bold text-3xl tracking-tight text-stone-800">
                                CivikEye
                            </span>
                        </div>

                        <h1 className="font-[var(--font-satoshi)] text-5xl font-bold tracking-tight text-stone-800 mb-6 max-w-xl leading-[1.1]">
                            Every civic issue
                            <br />
                            deserves public visibility.
                        </h1>
                        <p className="text-lg text-stone-500 max-w-md leading-relaxed">
                            Track issues. Verify resolutions. Build
                            accountability - together.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-8 text-sm font-medium text-stone-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-orange-500" />
                            Public accountability by design
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-orange-500" />
                            Community verified
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 py-12 min-h-screen bg-[#fcfbf7]">
                    <div className="w-full max-w-md">
                        <h2 className="font-[var(--font-satoshi)] text-3xl font-bold tracking-tight text-stone-800 mb-3">
                            Forgot your password?
                        </h2>
                        <p className="text-stone-500 mb-8 text-sm leading-relaxed">
                            Enter your email address and we'll send you a
                            password reset link.
                        </p>

                        {success ? (
                            <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 mb-6">
                                <p className="text-sm font-medium">
                                    If an account exists, we've sent a password
                                    reset link. Please check your inbox.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                        Email address
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        icon={Mail}
                                        error={fieldErrors.email}
                                        disabled={loading}
                                    />
                                </div>

                                {globalError && (
                                    <p className="text-sm text-red-500 font-medium text-center">
                                        {globalError}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                    size="lg"
                                    isLoading={loading}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        "Sending..."
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Send Reset Link{" "}
                                            <MoveRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        )}

                        <div className="mt-8 text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
