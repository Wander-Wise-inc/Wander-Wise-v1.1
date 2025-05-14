// src/components/ui/Slider.jsx
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, classNames = {}, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center group py-2", className)} // Added group and py-2 for thumb focus visibility
    {...props}>
    <SliderPrimitive.Track
      className={cn(
        "relative h-2.5 w-full grow overflow-hidden rounded-full bg-secondary/50", // Made track slightly thicker and more muted
        classNames.track
      )}
    >
      <SliderPrimitive.Range 
        className={cn(
            "absolute h-full bg-primary transition-all duration-150 ease-in-out", // Primary color for the range
            classNames.range
        )} 
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md group-hover:scale-110 group-focus-visible:scale-110", // Enhanced thumb
        classNames.thumb
      )} 
    />
    {/* If multiple thumbs are ever needed, map over props.value (if array) to render multiple thumbs */}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
