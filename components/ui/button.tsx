import { ButtonHTMLAttributes } from "react";
import clsx from 'clsx';
import { IOSpinner } from "../spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    loading?: boolean;
}

export default function Button({ className, children, variant = "primary", loading = false, ...props }: ButtonProps) {
    return (
        <button
            className={clsx(
                "px-6 py-3 rounded-[12px] font-medium font-sans",
                className,
                variant === "primary"
                    ? "bg-[#2E2E2E] text-white dark-button hover:bg-[#3D3D3D] animate-all duration-500 hover:scale-95 hover:cursor-pointer hover:text-white "
                    : "bg-white text-neutral-900 light-button hover:bg-neutral-100 hover:shadow-none animate-all duration-500 hover:scale-95 hover:cursor-pointer hover:text-neutral-900"
            )}
            {...props}
        >
            {loading && 
            <div className="flex flex-row gap-3 items-center justify-center px-2">
            <IOSpinner light={variant === "secondary"} />
            <p className={`text-sm font-medium ${variant === "secondary" ? "text-slate-800" : "text-white"} animate-pulse`}>Loading...</p>
            </div>
            }
            {!loading && children}
        </button>
    )
}



