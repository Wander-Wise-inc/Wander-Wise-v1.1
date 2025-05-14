// src/components/custom/Destinations.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Briefcase, PlusCircle, ImageIcon as GalleryIcon, AlertTriangle, Search, Filter, XCircle } from 'lucide-react';
import { tripsService } from '../../services/tripsService';
import { auth } from '../../service/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, CardImage } from '@/components/ui/card';
import { fetchDestinationCardImages } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';

const staticPopularDestinations = [
  { name: 'Goa', description: 'Sun-kissed beaches, vibrant nightlife, and historic Portuguese architecture.', tags: ['Beach', 'Nightlife', 'Culture'], placeholderImageUrl: '/images/destinations/goa-placeholder.jpg' },
  { name: 'Jaipur', description: 'The Pink City, famed for its majestic palaces, intricate forts, and bustling bazaars.', tags: ['History', 'Culture', 'Shopping'], placeholderImageUrl: '/images/destinations/jaipur-placeholder.jpg' },
  { name: 'Kerala', description: 'Known as "God\'s Own Country", offering serene backwaters and lush tea plantations.', tags: ['Nature', 'Wellness', 'Relaxation'], placeholderImageUrl: '/images/destinations/kerala-placeholder.jpg' },
  { name: 'Varanasi', description: 'An ancient spiritual city on the banks of the holy Ganges, offering profound experiences.', tags: ['Spiritual', 'Culture', 'History'], placeholderImageUrl: '/images/destinations/varanasi-placeholder.jpg' },
  { name: 'Agra', description: 'Home to the iconic Taj Mahal, a testament to eternal love, and Mughal wonders.', tags: ['History', 'Architecture', 'Iconic'], placeholderImageUrl: '/images/destinations/agra-placeholder.jpg' },
  { name: 'Mumbai', description: 'The vibrant "City of Dreams", a bustling metropolis with colonial charm and Bollywood.', tags: ['City Life', 'Food', 'Culture'], placeholderImageUrl: '/images/destinations/mumbai-placeholder.jpg' },
  { name: 'Ladakh', description: 'A land of breathtaking high-altitude landscapes and serene Buddhist monasteries.', tags: ['Adventure', 'Mountains', 'Spiritual'], placeholderImageUrl: '/images/destinations/ladakh-placeholder.jpg' },
  { name: 'Shimla', description: 'The "Queen of Hills", known for its colonial charm and scenic Himalayan views.', tags: ['Hill Station', 'Colonial', 'Nature'], placeholderImageUrl: '/images/destinations/shimla-placeholder.jpg' },
  { name: 'Rishikesh', description: 'Yoga capital of the world, nestled in the Himalayas by the Ganges river.', tags: ['Yoga', 'Adventure', 'Spiritual'], placeholderImageUrl: '/images/destinations/rishikesh-placeholder.jpg' },
  { name: 'Udaipur', description: 'The city of lakes, known for its romantic palaces and vibrant culture.', tags: ['Royalty', 'Lakes', 'Culture'], placeholderImageUrl: '/images/destinations/udaipur-placeholder.jpg' },
  { name: 'Darjeeling', description: 'Famous for its tea gardens, colonial architecture, and views of Kanchenjunga.', tags: ['Tea', 'Mountains', 'Colonial'], placeholderImageUrl: '/images/destinations/darjeeling-placeholder.jpg' },
  { name: 'Hampi', description: 'A UNESCO World Heritage site with ancient ruins and unique boulder-strewn landscapes.', tags: ['History', 'Ruins', 'UNESCO'], placeholderImageUrl: '/images/destinations/hampi-placeholder.jpg' },
];

const DestinationDisplayCard = ({ destination, onClick, existingTripData, isLoadingImage }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, duration: 0.35 }}
      className="h-full"
    >
      <Card 
        variant="interactive" // This variant already has hover effects
        onClick={onClick}
        className="h-full flex flex-col cursor-pointer group glass-effect" // Added glass-effect
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
          {isLoadingImage && !destination.imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/60 backdrop-blur-sm">
              <Loader2 className="w-10 h-10 animate-spin text-primary/60" />
            </div>
          )}
          <img 
            src={destination.imageUrl || destination.placeholderImageUrl || `https://placehold.co/600x375/E0C8B0/493628?text=${destination.name.replace(/\s/g,'+')}&font=playfairdisplay`} 
            alt={destination.altText || `Scenic view of ${destination.name}`}
            className={cn(
                "w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105",
                isLoadingImage && !destination.imageUrl ? "opacity-0" : "opacity-100" 
            )}
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = `https://placehold.co/600x375/D1C7BA/493628?text=${destination.name.replace(/\s/g,'+')}+Not+Found&font=lato`;
            }}
          />
          {existingTripData && (
            <span className="absolute top-2.5 right-2.5 text-xs bg-accent text-accent-foreground px-2.5 py-1.5 rounded-full shadow-md font-semibold z-10">
              Viewed
            </span>
          )}
           {/* Subtle gradient overlay on image hover for text pop */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardContent className="p-4 md:p-5 flex-grow flex flex-col">
          <h3 className="text-xl lg:text-2xl font-bold font-serif text-primary mb-1.5 flex items-center group-hover:text-accent transition-colors">
            <MapPin className="w-5 h-5 mr-2 shrink-0 text-accent/80 group-hover:text-accent transition-colors" />
            {destination.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-grow">{destination.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {destination.tags?.map(tag => (
              <span key={tag} className="text-[11px] bg-secondary/70 text-secondary-foreground px-2.5 py-1 rounded-full font-medium hover:bg-secondary transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 border-t border-card-border/50">
          <Button 
            variant={existingTripData ? "secondary" : "primary"} 
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            size="default"
          >
            {existingTripData ? <Briefcase className="w-4 h-4 mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
            {existingTripData ? "View Saved Trip" : "Plan This Trip"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const Destinations = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [destinations, setDestinations] = useState(
    staticPopularDestinations.map(d => ({ ...d, isLoadingImage: true, imageUrl: null, altText: `Image of ${d.name}` }))
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiError, setApiError] = useState(null);

  const fetchAllImages = useCallback(async () => {
    setIsInitialLoad(true);
    setApiError(null);
    const updatedDestinations = await Promise.all(
      staticPopularDestinations.map(async (dest) => {
        try {
          const images = await fetchDestinationCardImages(dest.name, 1);
          return {
            ...dest,
            imageUrl: images.length > 0 ? images[0].url : dest.placeholderImageUrl,
            altText: images.length > 0 ? images[0].alt : `Placeholder image for ${dest.name}`,
            isLoadingImage: false,
            fetchError: images.length === 0 && !dest.placeholderImageUrl,
          };
        } catch (err) {
          console.error(`Failed to fetch image for ${dest.name}:`, err);
          return { ...dest, imageUrl: dest.placeholderImageUrl, isLoadingImage: false, fetchError: true };
        }
      })
    );
    setDestinations(updatedDestinations);
    setIsInitialLoad(false);
  }, []);

  useEffect(() => { fetchAllImages(); }, [fetchAllImages]);

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (auth.currentUser) {
        try {
          const trips = await tripsService.getUserTrips(auth.currentUser.uid);
          setUserTrips(trips);
        } catch (error) {
          console.error('Error fetching user trips:', error);
          setApiError(prev => prev ? `${prev} Also failed to load your saved trips.` : 'Failed to load your saved trips.');
        }
      }
    };
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) fetchUserTrips();
      else setUserTrips([]);
    });
    return () => unsubscribe();
  }, []);

  const handleDestinationClick = (destination) => {
    const existingTrip = userTrips.find(trip => trip.destination.toLowerCase() === destination.name.toLowerCase());
    if (existingTrip) {
      navigate('/itin', { 
        state: { 
          destination: existingTrip.destination,
          tripData: existingTrip.itinerary,
          answers: { days: existingTrip.days, budget: existingTrip.budget, people: existingTrip.people }
        } 
      });
    } else {
      navigate('/create-trip', { state: { destination: destination.name } });
    }
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dest.tags && dest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (isInitialLoad && !destinations.some(d => !d.isLoadingImage)) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background to-secondary/10 flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading Destinations & Images...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background via-secondary/5 to-background py-12 md:py-16 lg:py-20 relative overflow-hidden">
        {/* Decorative blurred blobs */}
        <div className="absolute -top-1/3 -left-1/4 w-3/4 h-3/4 bg-gradient-to-tr from-primary/10 to-supporting-green/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow pointer-events-none"></div>
        <div className="absolute -bottom-1/3 -right-1/4 w-3/4 h-3/4 bg-gradient-to-bl from-accent/10 to-secondary/10 rounded-full filter blur-3xl opacity-50 animate-pulse-slow animation-delay-3000 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10 md:mb-14"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-primary mb-4">
            Discover Your <span className="text-gradient-primary-accent">India</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From majestic mountains to serene beaches, find your next unforgettable journey.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <input 
              type="text"
              placeholder="Search destinations or tags (e.g., Beach, History)..."
              className="w-full p-4 pl-12 pr-12 rounded-full border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50 shadow-lg transition-all focus:shadow-xl bg-card/80 backdrop-blur-sm placeholder-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70 pointer-events-none"/>
            {searchTerm && (
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full hover:bg-muted/50" onClick={() => setSearchTerm("")}>
                    <XCircle className="w-5 h-5 text-muted-foreground/70 hover:text-destructive"/>
                </Button>
            )}
          </div>
        </motion.div>

        {apiError && (
          <motion.div 
            initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
            className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg mb-8 flex items-center justify-center text-sm"
          >
            <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
            <p>{apiError}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {filteredDestinations.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {filteredDestinations.map((destination) => {
                const existingTripData = userTrips.find(trip => trip.destination.toLowerCase() === destination.name.toLowerCase());
                return (
                  <DestinationDisplayCard
                    key={destination.name}
                    destination={destination}
                    onClick={() => handleDestinationClick(destination)}
                    existingTripData={existingTripData}
                    isLoadingImage={destination.isLoadingImage}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}
              className="text-center py-16 text-muted-foreground"
            >
              <GalleryIcon className="w-20 h-20 mx-auto mb-4 opacity-40"/>
              <p className="text-xl font-semibold font-serif">No Destinations Found</p>
              <p className="mt-1">Try adjusting your search or explore our full list!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Destinations;
