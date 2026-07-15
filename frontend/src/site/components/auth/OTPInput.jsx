import { useState, useRef, useEffect } from "react";
import { cn } from "../../../shared/lib/utils";

export function OTPInput({ length = 6, value = "", onChange, error }) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (value) {
            const newOtp = value.split("").slice(0, length);
            while (newOtp.length < length) newOtp.push("");
            setOtp(newOtp);
        } else {
            setOtp(Array(length).fill(""));
        }
    }, [value, length]);

    const handleChange = (e, index) => {
        const text = e.target.value;
        if (!/^[0-9]*$/.test(text)) return;

        const val = text.substring(text.length - 1);
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);
        onChange(newOtp.join(""));

        if (val && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                onChange(newOtp.join(""));
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData
            .getData("text/plain")
            .slice(0, length)
            .replace(/[^0-9]/g, "");
        if (!pasteData) return;

        const newOtp = [...otp];
        for (let i = 0; i < pasteData.length; i++) {
            newOtp[i] = pasteData[i];
        }
        setOtp(newOtp);
        onChange(newOtp.join(""));

        const nextIndex = Math.min(pasteData.length, length - 1);
        inputRefs.current[nextIndex].focus();
    };

    return (
        <div>
            <div className="flex gap-2 justify-between">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className={cn(
                            "w-12 h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all",
                            error && "border-red-500 focus:ring-red-500",
                        )}
                    />
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
}
