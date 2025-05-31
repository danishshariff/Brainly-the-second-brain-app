import { ReactNode } from "react";

interface ButtonProps {
    text: string;
    variant?: "primary" | "secondary" | "danger";
    onClick?: () => void;
    loading?: boolean;
    icon?: ReactNode;
    fullWidth?: boolean;
}

export function Button({ text, variant = "primary", onClick, loading, icon, fullWidth }: ButtonProps) {
    const baseClasses = "px-4 py-2 rounded font-medium transition-colors duration-200 flex items-center justify-center gap-2";
    
    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        danger: "bg-red-600 text-white hover:bg-red-700"
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`}
            onClick={onClick}
            disabled={loading}
        >
            {icon}
            {loading ? "Loading..." : text}
        </button>
    );
}