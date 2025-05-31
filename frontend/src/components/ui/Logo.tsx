export function Logo() {
    return (
        <div className="flex items-center space-x-2">
            <img 
                src="/logo.png" 
                alt="Brainly Logo" 
                className="h-8 w-8"
            />
            <span className="text-xl font-bold text-white">Brainly</span>
        </div>
    );
} 