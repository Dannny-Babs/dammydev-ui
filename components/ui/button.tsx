import { ButtonHTMLAttributes } from "react";
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

export default function Button({ className, children, variant = "primary", ...props }: ButtonProps) {
    return (
        <button
            className={clsx(
                "px-6 py-3 rounded-[12px] font-medium",
                className,
                variant === "primary"
                    ? "bg-[#2E2E2E] text-white dark-button hover:bg-[#3D3D3D] animate-all duration-500 hover:scale-95 hover:cursor-pointer hover:text-white "
                    : "bg-white text-neutral-900 light-button hover:bg-neutral-100 hover:shadow-none animate-all duration-500 hover:scale-95 hover:cursor-pointer hover:text-neutral-900 hover:border-neutral-600 hover:border"
            )}
            {...props}
        >

            {children}
        </button>
    )
}



