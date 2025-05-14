// src/components/ui/ImageGallery.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, ZoomIn } from 'lucide-react'; // Added ZoomIn for hover effect

const ImageGallery = ({ images, onImageClick, className, imageClassName, itemClassName }) => {
  if (!images || images.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/30 rounded-lg h-64", className)}>
        <ImageIcon className="w-16 h-16 mb-4 opacity-50 text-muted-foreground/70" />
        <p className="text-lg font-medium font-serif">No Images Available</p>
        <p className="text-sm">This gallery is awaiting beautiful visuals.</p>
      </div>
    );
  }

  const galleryVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 150, damping: 18 } },
  };

  return (
    <motion.div 
      className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 p-1", className)}
      variants={galleryVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map((image, index) => (
        <motion.div
          key={image.url || `gallery-img-${index}`}
          variants={imageVariants}
          className={cn(
            "relative group overflow-hidden rounded-lg shadow-md aspect-w-4 aspect-h-3",
            onImageClick ? "cursor-pointer" : "",
            itemClassName
          )}
          onClick={() => onImageClick && onImageClick(image, index)}
          whileHover={{ scale: 1.03, zIndex: 10, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)"}}
          transition={{ type: "spring", stiffness: 300, damping:10 }}
        >
          <img
            src={image.url}
            alt={image.description || image.alt || `Gallery image ${index + 1}`}
            className={cn(
                "w-full h-full object-cover transform transition-transform duration-300 ease-in-out", // Removed group-hover:scale-110 as it's on motion.div
                imageClassName
            )}
            loading="lazy"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = `https://placehold.co/400x300/E0C8B0/493628?text=Not+Found&font=lato`; 
            }}
          />
          {/* Hover Overlay with Zoom Icon */}
          {onImageClick && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ZoomIn className="w-10 h-10 text-white opacity-80 transform group-hover:scale-110 transition-transform duration-300"/>
            </div>
          )}
          {image.description && !onImageClick && ( // Show description if not clickable (no overlay)
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-xs sm:text-sm font-medium truncate">{image.description}</p>
              {image.type && <span className="text-xs text-white/70 block">{image.type}</span>}
            </div>
          )}
           <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg group-hover:ring-accent transition-all duration-300 pointer-events-none"></div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ImageGallery;
