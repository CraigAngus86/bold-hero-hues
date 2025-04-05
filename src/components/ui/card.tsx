
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "primary" | "secondary" | "accent";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-card text-card-foreground",
    primary: "bg-white border-t-4 border-primary-800",
    secondary: "bg-white border-t-4 border-secondary-300",
    accent: "bg-white border-t-4 border-accent-500"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "primary" | "secondary" | "accent";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "",
    primary: "bg-primary-800 text-white",
    secondary: "bg-secondary-300 text-primary-800",
    accent: "bg-accent-500 text-primary-800"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
