// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import your page components
import Hero from './components/custom/Hero';
import CreateTrip from './create-trip';
import Itinerary from './itin';
import Header from './components/custom/Header';
import MyTrips from './components/custom/MyTrips';
import Destinations from './components/custom/Destinations';
import Experiences from './components/custom/Experiences';
import AboutUs from './components/custom/AboutUs';
import Footer from './components/custom/Footer';
import CreativeMouseFollower from './components/custom/CreativeMouseFollower'; // Keep for fun
import { Button } from './components/ui/button';
import { cn } from './lib/utils'; // For combining classNames

// Placeholder for NotFound page
const NotFound = () => (
  <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-8">
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "backOut", type: "spring", stiffness:120 }} // Fun spring animation
    >
      <h1 className="text-7xl md:text-9xl font-bold font-cursive text-playful-purple mb-4 opacity-60 animate-wiggle">404</h1> {/* Cursive and wiggle! */}
      <h2 className="text-3xl md:text-4xl font-semibold font-serif text-foreground mb-3">Page Lost in a Daydream!</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Oops! It seems this path has wandered off the map. Let's get you back to exploring amazing India!
      </p>
      <Link to="/">
        <Button variant="accent" size="lg" className="shadow-interactive hover:scale-105 transition-transform animate-bounce-light">
          Return to Home Base
        </Button>
      </Link>
    </motion.div>
  </div>
);

function App() {
  const location = useLocation();

  // Page transition variants - made a bit more playful
   const pageVariants = {
    initial: { opacity: 0, filter: "blur(5px) saturate(0.5)", y: 20 },
    in: { opacity: 1, filter: "blur(0px) saturate(1)", y: 0 },
    // Ensure the 'out' state also uses non-negative blur.
    // If it's meant to fade and blur out, ending at blur(5px) is fine.
    out: { opacity: 0, filter: "blur(5px) saturate(0.5)", y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94],
    duration: 0.55
  };

  return (
    // Added a wrapper div for the global blur effect
    <div className="bg-background text-foreground min-h-screen font-sans flex flex-col">
      <CreativeMouseFollower />
      <Header />
      {/* Main content area with backdrop blur */}
      <main className={cn(
        "flex-grow relative",
        // Apply backdrop blur here. Adjust blur amount as needed (e.g., backdrop-blur-md, backdrop-blur-lg)
        // This will blur content *behind* this main element if it were transparent.
        // To blur the background of App.jsx itself, the App's background needs to be semi-transparent
        // and the blur applied to an element behind it, or App.jsx has a blurred ::before pseudo-element.
        // For now, let's assume elements *within* main might have semi-transparent backgrounds
        // and we want the main content area to have a general subtle blur on its own background sections if they are distinct.
        // If the goal is to blur the *entire page background (e.g. a body background image)*,
        // this would be handled differently, likely on a pseudo-element or a fixed background div.
        // For now, we'll make the main content area itself slightly blurred if its background is distinct.
        "backdrop-filter backdrop-blur-sm" // Subtle blur on main content, reduced if needed
      )}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {[
              { path: "/", element: <Hero /> },
              { path: "/destinations", element: <Destinations /> },
              { path: "/create-trip", element: <CreateTrip /> },
              { path: "/itin", element: <Itinerary /> },
              { path: "/my-trips", element: <MyTrips /> },
              { path: "/experiences", element: <Experiences /> },
              { path: "/about", element: <AboutUs /> },
              { path: "*", element: <NotFound /> }
            ].map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="w-full"
                  >
                    {element}
                  </motion.div>
                }
              />
            ))}
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;