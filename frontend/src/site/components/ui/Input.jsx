import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(({ className, type, icon: Icon, rightIcon: RightIcon, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <div className="relative w-full">
                {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                        Icon && "pl-10",
                        RightIcon && "pr-10",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {RightIcon && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
                        <RightIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                )}
            </div>
            {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        </div>
    );
});
Input.displayName = "Input";

export { Input };
