// src/components/custom/CreativeMouseFollower.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CreativeMouseFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Start hidden

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true); // Show when mouse moves
    };

    const handleMouseEnterInteractive = (e) => {
      if (e.target.closest('a, button, [role="button"], [data-interactive="true"]')) {
        setIsHoveringInteractive(true);
      }
    };

    const handleMouseLeaveInteractive = (e) => {
      if (e.target.closest('a, button, [role="button"], [data-interactive="true"]')) {
        setIsHoveringInteractive(false);
      }
    };
    
    // Add event listeners for mouse move and interactive element hovers
    window.addEventListener('mousemove', updateMousePosition);
    document.body.addEventListener('mouseover', handleMouseEnterInteractive, true); // Use capture phase
    document.body.addEventListener('mouseout', handleMouseLeaveInteractive, true); // Use capture phase


    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.body.removeEventListener('mouseover', handleMouseEnterInteractive, true);
      document.body.removeEventListener('mouseout', handleMouseLeaveInteractive, true);
    };
  }, [isVisible]); // Depend on isVisible to add/remove listeners once initially shown

  const followerVariants = {
    default: {
      x: mousePosition.x - 8, // Adjust offset to center the dot
      y: mousePosition.y - 8,
      scale: 1,
      backgroundColor: "hsla(var(--accent-hsl), 0.5)", // Use accent color with alpha
      transition: { type: "spring", stiffness: 500, damping: 30, mass: 0.5 }
    },
    interactive: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1.8,
      backgroundColor: "hsla(var(--primary-hsl), 0.4)", // Change color on interactive hover
      borderWidth: '2px',
      borderColor: "hsla(var(--primary-hsl), 0.7)",
      transition: { type: "spring", stiffness: 600, damping: 20 }
    },
    hidden: {
        opacity: 0,
        scale: 0,
         x: mousePosition.x - 8,
         y: mousePosition.y - 8,
        transition: { duration: 0.2 }
    }
  };

  // Hide on small screens or touch devices where a mouse follower isn't ideal
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <motion.div
    //   className={cn(
    //     "fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999]", // Ensure it's above everything
    //     "mix-blend-difference" // Creative blend mode
    //   )}
    //   variants={followerVariants}
    //   animate={!isVisible ? "hidden" : (isHoveringInteractive ? "interactive" : "default")}
    //   // initial="hidden" // Start hidden
    />
  );
};

export default CreativeMouseFollower;