import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700",
    success: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700",
    warning: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700",
    danger: "bg-gradient-to-r from-red-100 to-pink-100 text-red-700",
    high: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
    medium: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm",
    low: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm",
    completed: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm",
    pending: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm",
    overdue: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;