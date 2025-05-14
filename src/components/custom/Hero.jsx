// src/components/custom/Hero.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { MapPin, Search, ArrowRight, Sparkles, Compass, Users2, Award, ChevronDown, MountainSnow, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Import cn

const featuredContent = [
  { id: 1, title: "Enchanting Kerala Backwaters", description: "Glide through serene canals on a traditional houseboat, surrounded by lush greenery.", image: "/images/featured/kerala-featured.jpg", link: "/destinations", icon: <Compass className="w-8 h-8 text-accent"/> },
  { id: 2, title: "Majestic Forts of Rajasthan", description: "Step back in time exploring the grandeur of Indian royalty and formidable architecture.", image: "/images/featured/rajasthan-featured.jpg", link: "/destinations", icon: <Award className="w-8 h-8 text-accent"/> },
  { id: 3, title: "Spiritual Ganges in Varanasi", description: "Witness ancient rituals, vibrant ghats, and the profound pulse of life in India's holiest city.", image: "/images/featured/varanasi-featured.jpg", link: "/destinations", icon: <Sparkles className="w-8 h-8 text-accent"/> },
];

function Hero() {
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(!!window.google?.maps?.places);
  
  const { scrollY } = useScroll();
  
  // Adjusted overlay for potentially less blur on the direct hero background if desired
  const heroOverlayOpacity = useTransform(scrollY, [0, 300, 500], [0.55, 0.7, 0.8]); // Slightly less intense
  const heroTextOpacity = useTransform(scrollY, [0, 150, 250], [1, 0.3, 0]); 
  const heroTextY = useTransform(scrollY, [0, 250], [0, -60]); 
  
  // Google Maps Autocomplete (keeping existing logic)
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google?.maps?.places) { setIsScriptLoaded(true); return; }
      if (document.getElementById('google-maps-script-hero')) return;
      const script = document.createElement('script');
      script.id = 'google-maps-script-hero';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_Maps_API_KEY}&libraries=places&callback=initAutocompleteHero`;
      script.async = true; script.defer = true;
      window.initAutocompleteHero = () => setIsScriptLoaded(true);
      script.onerror = () => console.error("Hero: Google Maps script could not be loaded.");
      document.head.appendChild(script);
      return () => { delete window.initAutocompleteHero; };
    };
    if (!isScriptLoaded) loadGoogleMapsScript();
  }, [isScriptLoaded]);

  useEffect(() => {
    if (!isScriptLoaded || !inputRef.current || !window.google?.maps?.places?.Autocomplete) return;
    let autocomplete;
    try {
      autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'], componentRestrictions: { country: 'in' }, fields: ['name', 'formatted_address']
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address || place?.name) setDestination(place.formatted_address || place.name);
      });
    } catch (error) { console.error('Hero: Error initializing Autocomplete:', error); }
    const keydownListener = (e) => { if (e.key === 'Enter' && e.target === inputRef.current) e.preventDefault(); };
    const currentInputRef = inputRef.current;
    currentInputRef?.addEventListener('keydown', keydownListener);
    return () => {
      if (autocomplete) window.google.maps.event.clearInstanceListeners(autocomplete);
      currentInputRef?.removeEventListener('keydown', keydownListener);
    };
  }, [isScriptLoaded]);


  const handleSearch = () => {
    if (destination.trim() === '') { alert('Please enter a destination.'); return; }
    navigate('/create-trip', { state: { destination } });
  };

  const popularPlaces = ["Goa", "Jaipur", "Kerala", "Manali", "Udaipur", "Rishikesh"];
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.15 } }
  };

  return (
    <>
      {/* Main Hero Viewport Section */}
      <div className="relative h-screen min-h-[650px] md:min-h-[700px] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Animated Blurred Gradient Background */}
        <motion.div
          className="absolute inset-0 -z-20 animated-gradient-hero" // Uses fun gradient from index.css
          initial={{ opacity: 0.9 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, ease: "circOut" }}
        />
        {/* Blur overlay for the gradient - THIS IS THE MAIN BLUR FOR THE HERO BACKGROUND */}
        <div className="absolute inset-0 -z-10 backdrop-filter backdrop-blur-xl md:backdrop-blur-2xl"></div> {/* Increased blur */}

        {/* Darkening Overlay for text contrast (can be reduced if blur provides enough contrast) */}
        <motion.div 
            className="absolute inset-0 bg-black" 
            style={{ opacity: heroOverlayOpacity }} 
        />

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          className="relative z-10 p-6 md:p-8 max-w-3xl mx-auto"
        >
           <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 10 }}>
            <MountainSnow className="w-20 h-20 md:w-24 md:h-24 text-accent mx-auto mb-5 animate-pulse-glow" />
          </motion.div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-serif text-white mb-6 leading-tight shadow-text">
            Your <span className="text-gradient-primary-accent drop-shadow-[0_3px_8px_rgba(var(--accent-rgb),0.8)] animate-wiggle inline-block">Indian</span> Dream Trip Starts Here!
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 font-sans max-w-xl mx-auto shadow-text-sm">
            Just whisper your destination, and our AI magic will craft an unforgettable itinerary for you. Adventure awaits!
          </p>
          <motion.div 
            initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{delay:0.3, duration:0.5, type:"spring", stiffness:120, damping:15}}
            // Apply glass effect to the search bar container for a fun, modern look
            className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto p-3.5 rounded-xl shadow-2xl glass-effect border border-white/25" 
          >
            <div className="relative w-full flex items-center">
              <MapPin className="absolute left-4 h-6 w-6 text-playful-purple" /> {/* Fun color for icon */}
              <input
                ref={inputRef} type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Magical Manali, Sunny Goa" // More playful placeholder
                className="w-full pl-12 pr-4 py-3.5 text-lg text-foreground bg-background rounded-lg focus:ring-2 focus:ring-playful-pink focus:border-transparent placeholder-muted-foreground"
              />
            </div>
            <Button onClick={handleSearch} size="lg" variant="accent" className="w-full sm:w-auto px-8 py-3.5 text-lg shadow-interactive hover:shadow-xl transform hover:scale-105 animate-pulse-glow">
              <Zap className="h-5 w-5 mr-2" /> Go!
            </Button>
          </motion.div>
          {!isScriptLoaded && <p className="text-xs text-white/60 mt-2.5">Finding amazing places...</p>}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            <span className="text-white/70 font-sans text-sm mr-2 self-center">Quick Picks:</span>
            {popularPlaces.map((place) => (
              <Button key={place} variant="outline" size="sm"
                className="bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-sm rounded-full text-xs sm:text-sm px-3.5 py-1.5 shadow-md hover:shadow-lg transition-all hover:border-white/40 transform hover:scale-105"
                onClick={() => setDestination(place)} >
                {place}
              </Button>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.9, repeat: Infinity, repeatType: "reverse", ease:"easeInOut" }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer p-2 group"
          onClick={() => document.getElementById('featured-content-section')?.scrollIntoView({ behavior: 'smooth' })}
          title="Scroll to discover more"
        >
          <ChevronDown className="h-8 w-8 sm:h-10 sm:w-10 text-white/40 group-hover:text-white/70 transition-colors duration-300 animate-bounce-light" /> {/* Changed animation */}
        </motion.div>
      </div>

      {/* Scrollable Content Sections - Applying blur and consistent theme */}
      {/* Section 1: Featured Journeys */}
      <section 
        id="featured-content-section" 
        className="py-16 md:py-24 relative overflow-hidden bg-background"
      >
        {/* Ensure this section's background is not overly blurred by App.jsx if App.jsx applies a strong global blur */}
        {/* The glass-effect on cards will provide their own blur */}
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-playful-pink/15 to-playful-teal/15 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-accent/15 to-supporting-green/15 rounded-full filter blur-3xl opacity-50 animate-pulse-slow animation-delay-2000"></div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary text-center mb-4">Featured Journeys</h2>
            <p className="text-lg text-muted-foreground text-center mb-12 md:mb-16 max-w-2xl mx-auto">
              Get inspired by curated experiences and popular travel themes across India.
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
          >
            {featuredContent.map((item) => (
              <motion.div key={item.id} variants={sectionVariants}> 
                <Card variant="interactive" className="h-full flex flex-col group/featurecard overflow-hidden glass-effect"> {/* Using glass-effect for fun */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                    <img src={item.image || `https://placehold.co/600x375/muted/foreground?text=${item.title.replace(/\s/g,'+')}`} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover/featurecard:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 p-2.5 bg-accent/90 text-accent-foreground rounded-full shadow-lg backdrop-blur-sm">
                        {item.icon}
                    </div>
                  </div>
                  <CardHeader className="pb-3 pt-5">
                    <CardTitle className="text-xl lg:text-2xl group-hover/featurecard:text-playful-purple transition-colors">{item.title}</CardTitle> {/* Fun color on hover */}
                  </CardHeader>
                  <CardContent className="flex-grow pt-0">
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-3 pb-5">
                    <RouterLink to={item.link} className="w-full">
                      <Button variant="outline" className="w-full hover:border-playful-pink hover:text-playful-pink group">
                        Discover More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                      </Button>
                    </RouterLink>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 2: Why WanderWise? */}
      <section className="py-16 md:py-24 bg-muted/20 relative overflow-hidden">
        <div className="absolute -bottom-1/3 -left-1/4 w-2/3 h-2/3 opacity-[0.04] blur-3xl pointer-events-none animate-pulse-slow" style={{animationDuration: '12s'}}>
            <MountainSnow className="w-full h-full text-playful-teal" /> {/* Fun color */}
        </div>
         <div className="absolute -top-1/3 -right-1/4 w-2/3 h-2/3 opacity-[0.04] blur-3xl pointer-events-none animate-pulse-slow" style={{animationDelay: '3s', animationDuration: '15s'}}>
            <Compass className="w-full h-full text-playful-pink" /> {/* Fun color */}
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center max-w-3xl mx-auto">
            <Users2 className="w-16 h-16 text-accent mx-auto mb-6 animate-bounce-light"/> {/* Fun animation */}
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-6">Why WanderWise?</h2>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Planning a trip to India can be complex. WanderWise simplifies this with AI-powered personalization, curated local insights, and seamless itinerary generation. We focus on authentic experiences, helping you connect with the diverse culture, history, and beauty of India like never before.
            </p>
            <RouterLink to="/about">
              <Button variant="primary" size="lg" className="text-base shadow-lg hover:shadow-xl transform hover:scale-105">
                Our Awesome Mission <Zap className="ml-2 w-4 h-4"/> {/* Added Zap icon */}
              </Button>
            </RouterLink>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Hero;