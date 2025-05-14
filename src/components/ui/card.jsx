// src/components/ui/Card.jsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Card Variants Configuration
const cardVariantsConfig = {
  default: "bg-card text-card-foreground border border-card-border shadow-lg hover:shadow-xl",
  interactive: "bg-card text-card-foreground bg-background border border-card-border shadow-lg hover:shadow-card-hover hover:-translate-y-1.5 transform transition-all duration-300 ease-out",
  flat: "bg-card text-card-foreground border-transparent shadow-none rounded-lg",
  ghost: "bg-transparent text-card-foreground border-transparent shadow-none hover:bg-muted/40 rounded-lg",
  gradientBorder: "p-0.5 relative shadow-lg hover:shadow-xl transition-shadow duration-300 ease-out rounded-xl before:absolute before:inset-0 before:-z-10 before:bg-gradient-primary-accent before:rounded-[calc(var(--radius-xl)-1px)] before:content-['']",
  glass: "glass-effect rounded-xl", // Uses .glass-effect from index.css
  // NEW FUN VARIANT
  fun: "bg-card/70 backdrop-blur-md text-card-foreground border-2 border-playful-teal shadow-fun-glow hover:shadow-playful-purple/50 hover:-translate-y-1 transform transition-all duration-300 ease-out rounded-xl hover:border-playful-pink",
};

const Card = React.forwardRef(({ className, variant = "default", as = "div", children, noAnimation = false, motionProps: customMotionProps, ...props }, ref) => {
  const MotionComponent = motion[as] || motion.div;

  const baseClasses = "overflow-hidden";
  const variantClasses = cardVariantsConfig[variant] || cardVariantsConfig.default;

  const defaultMotionProps = noAnimation ? {} : {
    initial: { opacity: 0, y: 25, scale: 0.95, rotateX: -10 }, // Added rotateX for a slight 3D pop
    whileInView: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.6, ease: [0.25, 0.75, 0.5, 1], delay: 0.1 } // More playful ease
  };
  
  const combinedMotionProps = { ...defaultMotionProps, ...customMotionProps };

  const finalClassName = cn(
    baseClasses,
    variantClasses,
    (variant !== "gradientBorder" && variant !== "fun") && "rounded-lg", // Default rounding if not already handled by variant
    (variant === "fun" || variant === "gradientBorder") && "rounded-xl", // Specific rounding for these
    className
  );

  return (
    <MotionComponent
      ref={ref}
      className={finalClassName}
      {...combinedMotionProps}
      {...props}
    >
      {variant === "gradientBorder" ? <div className="bg-card rounded-[calc(var(--radius-xl)-2px)] h-full w-full p-0">{children}</div> : children}
    </MotionComponent>
  )
});
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 md:p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, as = "h3", ...props }, ref) => {
  const Component = as;
  return (
    <Component
      ref={ref}
      className={cn(
        "text-xl md:text-2xl font-semibold font-serif leading-tight tracking-tight text-primary group-hover:text-playful-purple transition-colors duration-200", // Added group-hover for fun
        className
      )}
      {...props} />
  )
});
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, as = "p", ...props }, ref) => {
  const Component = as;
  return (
    <Component
      ref={ref}
      className={cn("text-sm text-muted-foreground font-sans mt-1", className)}
      {...props} />
  )
});
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-5 md:p-6 pt-0 font-sans flex-grow", className)}
    {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 md:p-6 pt-4 border-t border-card-border/60", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

const CardImage = React.forwardRef(({ className, src, alt, wrapperClassName, ...props }, ref) => (
    <div className={cn("overflow-hidden aspect-video rounded-t-lg group", wrapperClassName)} {...props} ref={ref}> {/* Added group */}
        <motion.img
            src={src}
            alt={alt}
            className={cn("w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105", className)} // group-hover from parent
            // removed whileHover={{ scale: 1.05 }} to rely on parent group hover
        />
    </div>
));
CardImage.displayName = "CardImage";


export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }