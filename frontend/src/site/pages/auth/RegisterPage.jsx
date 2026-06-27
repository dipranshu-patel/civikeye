import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, ShieldCheck, Users, X, User, Mail, Lock, MoveRight, MapPin } from "lucide-react";
import { authService } from "../../services/auth.service";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { OTPInput } from "../../components/auth/OTPInput";
import LogoSVG from "../../assets/logo.svg";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); 
    const [loadingAction, setLoadingAction] = useState(null);
    const [error, setError] = useState(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [consent, setConsent] = useState(false);

    const [touched, setTouched] = useState({
        fullName: false,
        email: false,
        password: false,
    });

    const handleBlur = (field) =>
        setTouched((prev) => ({ ...prev, [field]: true }));

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

    const getValidationErrors = () => {
        const errs = {};
        if (touched.fullName) {
            if (!fullName.trim()) errs.fullName = "Full name is required.";
            else if (fullName.trim().length < 3)
                errs.fullName = "Full name must be at least 3 characters.";
        }
        if (touched.email) {
            if (!email.trim()) errs.email = "Email is required.";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                errs.email = "Please provide a valid email address.";
        }
        return errs;
    };

    const fieldErrors = getValidationErrors();

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async () => {
        setTouched((prev) => ({ ...prev, email: true }));
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return;
        }

        setError(null);
        setLoadingAction("sendOtp");
        try {
            await authService.sendOtp(email);
            setStep(2);
            setTimer(60);
            setOtp("");
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                    err.response?.data?.errors?.[0]?.message ||
                    "Failed to send OTP.",
            );
        } finally {
            setLoadingAction(null);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        setError(null);
        setLoadingAction("verifyOtp");
        try {
            await authService.verifyOtp(email, otp);
            setStep(3);
        } catch (err) {
            setError(
                err.response?.data?.error?.message ||
                    err.response?.data?.errors?.[0]?.message ||
                    "Invalid OTP. Please try again.",
            );
            setOtp("");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleRegister = async () => {
        setTouched((prev) => ({
            ...prev,
            fullName: true,
            email: true,
            password: true,
        }));

        if (
            fullName.trim().length < 3 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            !isPasswordValid
        ) {
            return;
        }

        if (step !== 3) {
            setError("Please verify your email address first.");
            return;
        }
        if (!consent) {
            setError("You must agree to the public ledger terms.");
            return;
        }

        if (!("geolocation" in navigator)) {
            setError(
                "Your browser does not support location access. Please use a modern browser to register.",
            );
            return;
        }

        setError(null);
        setLoadingAction("locating");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                setLoadingAction("register");
                try {
                    await authService.register(fullName, email, password, latitude, longitude);
                    navigate("/login?registered=true");
                } catch (err) {
                    setError(
                        err.response?.data?.error?.message ||
                            err.response?.data?.errors?.[0]?.message ||
                            "Registration failed.",
                    );
                } finally {
                    setLoadingAction(null);
                }
            },
            (geoError) => {
                setLoadingAction(null);
                if (geoError.code === geoError.PERMISSION_DENIED) {
                    setError(
                        "CivikEye requires your location to report nearby civic issues, prevent duplicate reports, and verify completed work. Please enable location access to create your account.",
                    );
                } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
                    setError(
                        "Your location is currently unavailable. Please check your device settings and try again.",
                    );
                } else {
                    setError(
                        "Location request timed out. Please try again.",
                    );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            },
        );
    };

    const [showPassword, setShowPassword] = useState(false);

    const isLoading = loadingAction !== null;
    const buttonLabel =
        loadingAction === "locating"
            ? "Getting your location..."
            : loadingAction === "register"
              ? "Creating account..."
              : (
                    <span className="flex items-center gap-2">
                        Create account <MoveRight className="w-5 h-5" />
                    </span>
                );

    return (
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
                        Join a city built
                        <br />
                        on public accountability.
                    </h1>

                    <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                        Report what matters. Help resolve what others can't.
                        Hold institutions to a public clock.
                    </p>
                </div>

                <div className="relative z-10 flex gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        <span>Public accountability by design</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span>Community verified</span>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 py-12 min-h-screen bg-white">
                <div className="w-full max-w-md">

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
                        Join the public ledger.
                    </h2>

                    <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                        A free account lets you report issues, verify
                        resolutions, and contribute to community accountability.
                    </p>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Your name as on civic records"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    onBlur={() => handleBlur("fullName")}
                                    error={fieldErrors.fullName}
                                    icon={User}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email address
                                </label>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <Input
                                            type="email"
                                            placeholder="user@example.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            onBlur={() => handleBlur("email")}
                                            disabled={step > 1}
                                            icon={Mail}
                                            rightIcon={
                                                step === 3
                                                    ? CheckCircle2
                                                    : undefined
                                            }
                                            error={fieldErrors.email}
                                        />
                                    </div>
                                    {step === 1 && (
                                        <Button
                                            variant="primary"
                                            onClick={handleSendOtp}
                                            isLoading={loadingAction === "sendOtp"}
                                            disabled={!email || loadingAction !== null}
                                        >
                                            {loadingAction === "sendOtp" ? "Verifying..." : "Verify"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Enter OTP
                                    </label>
                                    <div
                                        className={
                                            step > 2
                                                ? "pointer-events-none opacity-60"
                                                : ""
                                        }
                                    >
                                        <OTPInput
                                            length={6}
                                            value={otp}
                                            onChange={setOtp}
                                        />
                                    </div>

                                    {step === 2 && (
                                        <div className="flex items-center justify-between mt-4">
                                            <Button
                                                variant="secondary"
                                                onClick={handleVerifyOtp}
                                                isLoading={loadingAction === "verifyOtp"}
                                                disabled={otp.length !== 6 || loadingAction !== null}
                                            >
                                                {loadingAction === "verifyOtp" ? "Verifying..." : "Verify OTP"}
                                            </Button>

                                            <button
                                                onClick={handleSendOtp}
                                                disabled={timer > 0 || loadingAction !== null}
                                                className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium"
                                            >
                                                {timer > 0
                                                    ? `Resend in ${timer}s`
                                                    : loadingAction === "sendOtp" ? "Sending..." : "Resend OTP"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="At least 8 characters"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        onBlur={() => handleBlur("password")}
                                        icon={Lock}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
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

                            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    checked={consent}
                                    onChange={(e) =>
                                        setConsent(e.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <label
                                    htmlFor="consent"
                                    className="text-sm text-gray-600 leading-relaxed"
                                >
                                    I understand that issues I report and
                                    verifications I cast become part of
                                    CivikEye's{" "}
                                    <span className="font-semibold text-gray-900">
                                        public ledger
                                    </span>
                                    .
                                </label>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 py-1">
                                    <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5 stroke-[3]" />
                                    <p className="text-sm text-red-600 leading-relaxed">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleRegister}
                                isLoading={loadingAction === "locating" || loadingAction === "register"}
                                disabled={loadingAction !== null}
                            >
                                {buttonLabel}
                            </Button>

                            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-700 leading-relaxed">
                                    When you click <span className="font-semibold">Create account</span>, your browser will ask for your location to verify your home address for nearby civic issues. Once registered, you can safely turn off location access until you report an issue.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-gray-900 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
