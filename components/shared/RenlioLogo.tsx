"use client"

import { cn } from "@/lib/utils"

interface RenlioLogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "dark" | "light"
  className?: string
}

export function RenlioLogo({ size = "md", variant = "dark", className }: RenlioLogoProps) {
  const sizeClasses = {
    sm: { accent: "h-4 w-4", text: "text-lg" },
    md: { accent: "h-5 w-5", text: "text-xl" },
    lg: { accent: "h-6 w-6", text: "text-2xl" },
  }

  const colorClasses = {
    dark: "text-slate-900",
    light: "text-white",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "bg-blue-600 rounded-sm flex-shrink-0",
          sizeClasses[size].accent
        )} 
      />
      <span className={cn("font-bold", sizeClasses[size].text, colorClasses[variant])}>
        Renlio
      </span>
    </div>
  )
}
