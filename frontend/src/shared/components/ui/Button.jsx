import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const variantClasses = {
    default: "bg-gray-900 text-white hover:bg-gray-800 shadow-md",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-900",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 shadow-md",
};

const sizeClasses = {
    default: "rounded-md px-4 py-2.5",
    sm: "rounded-md px-3 py-1.5",
    lg: "rounded-lg px-8 py-3.5 text-base",
    icon: "rounded-md h-10 w-10",
};

const Button = forwardRef(
    ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={isLoading || props.disabled}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                style={{
                    backgroundColor: variant === "default" ? "#111827" : variant === "primary" ? "#2563eb" : variant === "secondary" ? "#4b5563" : undefined,
                    color: (variant === "default" || variant === "primary" || variant === "secondary") ? "#ffffff" : undefined,
                    paddingTop: size === "lg" ? "0.875rem" : size === "sm" ? "0.375rem" : size === "icon" ? undefined : "0.625rem",
                    paddingBottom: size === "lg" ? "0.875rem" : size === "sm" ? "0.375rem" : size === "icon" ? undefined : "0.625rem",
                }}
                {...props}
            >
                {isLoading && (
                    <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
