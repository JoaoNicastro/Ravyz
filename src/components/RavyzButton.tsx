import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Loader2 } from "lucide-react";

interface RavyzButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function RavyzButton({ 
  variant = 'primary', 
  size = 'default', 
  loading = false, 
  className, 
  children, 
  disabled,
  ...props 
}: RavyzButtonProps) {
  const baseClasses = "h-12 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-ravyz-orange hover:bg-ravyz-orange/90 text-white border-0 shadow-sm hover:shadow-md",
    secondary: "bg-ravyz-gray-200 hover:bg-ravyz-gray-200/80 text-ravyz-black border-0",
    outline: "border-2 border-ravyz-orange text-ravyz-orange hover:bg-ravyz-orange hover:text-white bg-transparent",
    ghost: "text-ravyz-orange hover:bg-ravyz-orange/10 bg-transparent border-0"
  };

  const sizeClasses = {
    sm: "px-4 text-sm h-10",
    default: "px-6 text-base h-12",
    lg: "px-8 text-lg h-14"
  };

  return (
    <Button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}