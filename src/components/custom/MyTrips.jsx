// src/components/custom/MyTrips.jsx
import React, { useEffect, useState } from 'react';
import { tripsService } from '../../services/tripsService';
import { auth } from '../../service/firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Users, Wallet, MapPin, Eye, PlusCircle, Trash2, Loader2, AlertTriangle, Edit3, PackageOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      if (auth.currentUser) {
        try {
          const userTrips = await tripsService.getUserTrips(auth.currentUser.uid);
          const sortedTrips = userTrips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setTrips(sortedTrips);
        } catch (err) {
          console.error('Error fetching trips:', err);
          setError('Failed to load your trips. Please try again later.');
        }
      } else {
        setError('Please sign in to view your saved trips.');
        setTrips([]);
      }
      setLoading(false);
    };
    
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) fetchTrips();
      else {
        setTrips([]); setLoading(false); setError('Please sign in to view your saved trips.');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;
    
    // Placeholder for actual deletion logic
    // await tripsService.deleteTrip(tripId); 
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    console.log(`Trip ${tripId} marked for deletion (UI only). Implement backend deletion.`);
    // Show a toast or confirmation message here
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-background to-secondary/10">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background via-secondary/10 to-background py-12 md:py-16 lg:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={itemVariants} // Use itemVariants for initial animation of the header
          className="flex flex-col sm:flex-row justify-between items-center mb-10 md:mb-14 pb-6 border-b border-border"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold font-serif text-primary mb-2">My Saved Trips</h1>
            <p className="text-muted-foreground text-lg">Your personalized adventures, all in one place.</p>
          </div>
          <Link to="/create-trip" className="mt-4 sm:mt-0">
            <Button variant="accent" size="lg" className="shadow-interactive hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5 mr-2" />
              Plan a New Adventure
            </Button>
          </Link>
        </motion.div>

        {error && (
          <motion.div 
            variants={itemVariants} 
            className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg mb-8 flex items-center text-sm"
          >
            <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {!loading && !error && trips.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-16 md:py-24">
            <PackageOpen className="w-24 h-24 text-muted-foreground/50 mx-auto mb-8" />
            <h2 className="text-3xl font-semibold font-serif text-foreground mb-4">Your Itinerary List is Empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
              Ready to explore? Let's craft your first unforgettable Indian journey!
            </p>
            <Link to="/destinations">
              <Button variant="primary" size="lg" className="text-base shadow-lg hover:shadow-xl">
                Discover Destinations
              </Button>
            </Link>
          </motion.div>
        )}

        {trips.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {trips.map((trip) => (
              <motion.div key={trip.id} variants={itemVariants}>
                <Card variant="interactive" className="h-full flex flex-col group"> {/* Added group for potential inner hover effects */}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl group-hover:text-accent transition-colors duration-200 flex items-start justify-between">
                      <span className="flex items-center">
                        <MapPin className="w-6 h-6 mr-2.5 text-accent/80 shrink-0" />
                        {trip.destination}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground pt-1">
                      Planned on: {new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2.5 text-sm">
                    {[
                      { icon: CalendarDays, label: "Duration", value: `${trip.days} days` },
                      { icon: Users, label: "Travelers", value: `${trip.people} people` },
                      { icon: Wallet, label: "Budget", value: `₹${trip.budget.toLocaleString('en-IN')}` },
                    ].map(item => (
                      <div key={item.label} className="flex items-center text-foreground/80">
                        <item.icon className="w-4 h-4 mr-2.5 text-primary/60 shrink-0" />
                        <span className="font-medium">{item.label}:&nbsp;</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-card-border grid grid-cols-2 gap-2.5">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => navigate('/itin', { 
                        state: { 
                          destination: trip.destination,
                          tripData: trip.itinerary,
                          answers: { days: trip.days, budget: trip.budget, people: trip.people }
                        }
                      })}
                    >
                      <Eye className="w-4 h-4 mr-1.5" /> View Plan
                    </Button>
                     <Button 
                        variant="outline" 
                        className="w-full hover:border-destructive/50 hover:text-destructive"
                        onClick={() => handleDeleteTrip(trip.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyTrips;
