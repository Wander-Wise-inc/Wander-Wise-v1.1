// src/components/ui/Button.jsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold font-sans ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.96] group transform", // Added group, transform, rounded-lg
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/80 shadow-md hover:shadow-lg hover:-translate-y-0.5", // More interactive default
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg hover:shadow-interactive hover:-translate-y-1 hover:animate-pulse-glow", // Playful primary
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/85 shadow-md hover:shadow-lg",
        outline: "border-2 border-input bg-transparent hover:bg-accent/10 hover:text-accent-foreground shadow-sm hover:border-accent hover:-translate-y-0.5", // Thicker border
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-md hover:shadow-lg hover:-translate-y-0.5",
        ghost: "hover:bg-muted/70 hover:text-muted-foreground active:bg-muted", // More subtle ghost
        link: "text-playful-purple underline-offset-4 hover:underline hover:text-playful-pink font-bold", // Fun link color
        accent: "bg-accent text-accent-foreground hover:bg-accent-hover shadow-lg hover:shadow-interactive hover:-translate-y-1 hover:animate-pulse-glow", // Playful accent (same as primary for now)
        subtle: "bg-muted/50 text-muted-foreground hover:bg-muted/90 shadow-sm",
        // NEW FUN VARIANTS
        funky: "bg-gradient-to-r from-playful-pink via-playful-purple to-playful-teal text-white shadow-xl hover:shadow-fun-glow hover:-translate-y-1 hover:scale-105 animate-gradient-wave",
        glow: "bg-primary text-primary-foreground shadow-lg hover:shadow-subtle-glow-primary hover:-translate-y-0.5 focus:shadow-subtle-glow-primary",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-[15px]", // Slightly larger default
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-lg", // Larger and more rounded for fun
        icon: "h-11 w-11 rounded-full p-0", // Consistent icon size
      },
    },
    defaultVariants: {
      variant: "primary", 
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  // Add group-hover effect for icons within buttons
  const childrenWithIconHover = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.props.className && typeof child.props.className === 'string' && child.props.className.includes('lucide-')) {
      return React.cloneElement(child, {
        className: cn(child.props.className, "transition-transform duration-200 group-hover:scale-125 group-hover:rotate-[10deg]") // More playful icon hover
      });
    }
    return child;
  });

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {childrenWithIconHover}
    </Comp>
  );
});
Button.displayName = "Button"

export { Button, buttonVariants }