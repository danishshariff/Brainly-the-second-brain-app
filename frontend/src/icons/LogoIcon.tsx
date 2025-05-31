interface LogoIconProps {
    className?: string;
}

export function LogoIcon({ className = "h-6 w-6 text-purple-600" }: LogoIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 17L12 22L20 17" />
            <path d="M4 12L12 17L20 12" />
            <path d="M12 2L4 7V17" />
            <path d="M12 2L20 7V17" />
        </svg>
    );
} 