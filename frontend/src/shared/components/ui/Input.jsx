import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(
    (
        { className, type, icon: Icon, rightIcon: RightIcon, error, ...props },
        ref,
    ) => {
        return (
            <div className="w-full">
                <div className="relative flex items-center w-full h-10">
                    {Icon && (
                        <div
                            className="pointer-events-none absolute flex items-center justify-center text-gray-500 z-10"
                            style={{ left: "0.75rem" }}
                        >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "absolute inset-0 h-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                            Icon ? "pl-11" : "pl-4",
                            RightIcon ? "pr-11" : "pr-4",
                            error && "border-red-500 focus:ring-red-500",
                            className,
                        )}
                        style={{
                            paddingLeft: Icon ? "2.75rem" : "1rem",
                            paddingRight: RightIcon ? "2.75rem" : "1rem",
                        }}
                        ref={ref}
                        {...props}
                    />
                    {RightIcon && (
                        <div
                            className="pointer-events-none absolute flex items-center justify-center text-green-500 z-10"
                            style={{ right: "0.75rem" }}
                        >
                            <RightIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    },
);
Input.displayName = "Input";

export { Input };
