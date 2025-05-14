// src/itin/index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CalendarDays, Plane, MapPin, Hotel, Coffee, Utensils, Sun, 
  Sunset, Moon, Info, AlertCircle, ChefHat, Lightbulb, Users, Wallet, Edit3, Download, Share2, MessageSquare, Image as ImageIcon, Loader2 as ItinLoader
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchDestinationHeroImage } from '@/utils/imageUtils'; // Import the new function

// Helper function to parse itinerary text (from previous batch, ensure it's robust)
const parseItineraryText = (text) => {
  if (!text || typeof text !== 'string') {
    return [{ dayNum: 1, overview: "No itinerary data provided.", activities: [], accommodation: [], dining: [], travelTips: [] }];
  }

  const days = [];
  // Regex to better capture "Day X:" or "Day X -" patterns, accommodating variations
  const daySections = text.split(/Day\s*\d+\s*[:\-–]/i);


  if (daySections.length <= 1 && text.trim() !== "") {
    const firstLineIsOverview = !text.split('\n')[0].match(/^(Morning|Afternoon|Evening|Accommodation|Dining|Travel Tip):/i);
    return [{ 
      dayNum: 1, 
      overview: firstLineIsOverview ? text.split('\n')[0] : "Review the provided plan details below.", 
      activities: text.split('\n').filter(line => line.trim() !== "").slice(firstLineIsOverview ? 1 : 0), 
      accommodation: [], 
      dining: [], 
      travelTips: [] 
    }];
  }
  
  let dayCounter = 1;
  // Find the actual day numbers from the original text to handle missing days or non-sequential numbering
  const dayHeaders = [...text.matchAll(/Day\s*(\d+)\s*[:\-–]/gi)];

  for (let i = 1; i < daySections.length; i++) {
    const dayContent = daySections[i].trim();
    const currentDayNum = dayHeaders[i-1] ? parseInt(dayHeaders[i-1][1]) : dayCounter++;
    
    const dayData = {
      dayNum: currentDayNum,
      overview: "",
      activities: [],
      accommodation: [],
      dining: [],
      travelTips: []
    };

    const lines = dayContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length > 0 && !lines[0].match(/^(Morning|Afternoon|Evening|Accommodation|Dining|Travel Tip):/i)) {
      dayData.overview = lines.shift().replace(/^[:\s-]+/, '').trim();
    }

    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.startsWith('accommodation:')) {
        dayData.accommodation.push(line.substring('accommodation:'.length).trim());
      } else if (lowerLine.startsWith('dining:')) {
        dayData.dining.push(line.substring('dining:'.length).trim());
      } else if (lowerLine.startsWith('travel tip:')) {
        dayData.travelTips.push(line.substring('travel tip:'.length).trim());
      } else if (lowerLine.match(/^(morning:|afternoon:|evening:|night:)/)) {
        dayData.activities.push(line.trim());
      } else if (line.trim()) { 
        dayData.activities.push(line.trim());
      }
    });
    days.push(dayData);
  }
  return days.length > 0 ? days : [{ dayNum: 1, overview: "Could not parse itinerary. Please review the raw data.", activities: text.split('\n').filter(line => line.trim() !== ""), accommodation: [], dining: [], travelTips: [] }];
};


// Function to get icon for activity (from previous batch)
const getActivityIcon = (activityText) => {
  const text = String(activityText).toLowerCase();
  if (text.includes('breakfast') || text.includes('brunch')) return <Coffee className="text-amber-600 h-5 w-5 shrink-0" />;
  if (text.includes('lunch')) return <Utensils className="text-orange-600 h-5 w-5 shrink-0" />;
  if (text.includes('dinner') || text.includes('supper')) return <ChefHat className="text-red-600 h-5 w-5 shrink-0" />;
  if (text.includes('hotel') || text.includes('stay') || text.includes('check-in') || text.includes('check in') || text.includes('accommodation')) return <Hotel className="text-purple-600 h-5 w-5 shrink-0" />;
  if (text.includes('flight') || text.includes('airport') || text.includes('arrive') || text.includes('depart')) return <Plane className="text-blue-600 h-5 w-5 shrink-0" />;
  if (text.includes('explore') || text.includes('visit') || text.includes('sightseeing') || text.includes('tour') || text.includes('museum') || text.includes('fort') || text.includes('palace')) return <MapPin className="text-teal-600 h-5 w-5 shrink-0" />;
  if (text.includes('relax') || text.includes('leisure') || text.includes('beach')) return <Sun className="text-yellow-600 h-5 w-5 shrink-0" />;
  if (text.includes('shop') || text.includes('market')) return <Wallet className="text-pink-600 h-5 w-5 shrink-0" />;
  if (text.startsWith('morning:')) return <Sun className="text-yellow-500 h-5 w-5 shrink-0" />;
  if (text.startsWith('afternoon:')) return <Sun className="text-orange-500 h-5 w-5 shrink-0" />;
  if (text.startsWith('evening:')) return <Sunset className="text-red-500 h-5 w-5 shrink-0" />;
  if (text.startsWith('night:')) return <Moon className="text-indigo-500 h-5 w-5 shrink-0" />;
  return <MapPin className="text-gray-500 h-5 w-5 shrink-0" />;
};

// Format activity text (from previous batch)
const FormatActivityText = ({ activity }) => {
  const cleanText = String(activity).replace(/\*\*/g, '');
  const labelPattern = /^(Morning|Afternoon|Evening|Night|Accommodation|Dining|Travel Tip):/i;
  const match = cleanText.match(labelPattern);

  if (match) {
    const label = match[1];
    const content = cleanText.substring(match[0].length).trim();
    return (
      <>
        <span className="font-semibold font-serif text-primary">{label}: </span>
        <span className="text-foreground/80">{content}</span>
      </>
    );
  }
  return <span className="text-foreground/80">{cleanText.trim()}</span>;
};


const ItineraryPage = () => {
  const location = useLocation();
  const { destination, tripData, answers } = location.state || { 
    destination: "Your Destination",
    tripData: "No itinerary data. Please create a trip first.",
    answers: { days: 0, budget: 0, people: 0 }
  };
  
  const [heroImageUrl, setHeroImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (destination && destination !== "Your Destination") {
      setImageLoading(true);
      fetchDestinationHeroImage(destination)
        .then(url => {
          setHeroImageUrl(url);
        })
        .catch(err => console.error("Error setting hero image:", err))
        .finally(() => setImageLoading(false));
    } else {
      setImageLoading(false); // No destination, no image to load
    }
  }, [destination]);

  const parsedDays = useMemo(() => parseItineraryText(tripData), [tripData]);

  const getAccommodationType = (budget, days, people) => {
    if (!days || !people || !budget) return 'Not Specified';
    const perPersonPerDay = budget / (days * people);
    if (perPersonPerDay >= 8000) return 'Luxury Stays';
    if (perPersonPerDay >= 4000) return 'Premium Hotels';
    if (perPersonPerDay >= 1500) return 'Mid-Range Hotels';
    if (perPersonPerDay >= 500) return 'Budget Stays';
    return 'Basic Hostels';
  };
  const accommodationType = getAccommodationType(answers?.budget, answers?.days, answers?.people);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren:0.1 } },
    out: { opacity: 0, y: -20 }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: {type: "spring", stiffness:100, damping:15 }}
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-background to-secondary/20 pb-16"
    >
      <div className="relative h-80 md:h-96 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 z-10">
            <ItinLoader className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}
        {!imageLoading && heroImageUrl && (
          <motion.img 
            key={heroImageUrl} // Ensure re-render on image change
            src={heroImageUrl} 
            alt={`Scenic view of ${destination}`} 
            className="absolute inset-0 w-full h-full object-cover"
            initial={{opacity:0, scale:1.1}}
            animate={{opacity:1, scale:1}}
            transition={{duration:0.8, ease:"easeInOut"}}
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/1600x900/E0C8B0/493628?text=${destination.replace(/\s/g, '+')}&font=lora`; }}
          />
        )}
        {!imageLoading && !heroImageUrl && (
           <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent/70 to-secondary">
             {/* Fallback gradient or pattern if no image */}
           </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-10 h-full flex flex-col justify-end text-white">
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold font-serif mb-3 shadow-text"
          >
            Your Journey to {destination}
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 font-sans mb-6 shadow-text-sm"
          >
            A detailed plan for your unforgettable {answers?.days || 'N/A'}-day adventure.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <Button variant="accent" size="lg" className="shadow-lg hover:scale-105 transition-transform"><Download className="mr-2 h-5 w-5" /> Download PDF</Button>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-md hover:scale-105 transition-transform"><Share2 className="mr-2 h-5 w-5" /> Share</Button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <ScrollArea className="lg:col-span-2 h-auto lg:max-h-[calc(100vh-12rem)] pr-0 lg:pr-4"> {/* Adjusted height */}
            <motion.div variants={pageVariants} className="space-y-8">
              {parsedDays.length === 0 || (parsedDays.length === 1 && parsedDays[0].overview === "No itinerary data provided.") ? (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-destructive flex items-center">
                      <AlertCircle className="w-7 h-7 mr-3"/> Itinerary Not Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We couldn't load or parse the itinerary data for this trip. This might be due to an issue with the trip creation process or the data format.
                    </p>
                    <Link to="/create-trip" state={{ destination: destination }}>
                      <Button variant="primary" className="mt-4">Try Planning Again</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                parsedDays.map((day, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="overflow-hidden shadow-lg border-primary/10 hover:border-primary/30 transition-all duration-300">
                      <CardHeader className="bg-primary/5 p-5 border-b border-primary/10">
                        <CardTitle className="text-2xl md:text-3xl text-primary flex items-center">
                          <CalendarDays className="w-7 h-7 mr-3 text-accent shrink-0" />
                          Day {day.dayNum}
                        </CardTitle>
                        {day.overview && <CardDescription className="text-md text-muted-foreground mt-1 font-sans">{day.overview}</CardDescription>}
                      </CardHeader>
                      <CardContent className="p-5 md:p-6 space-y-5">
                        {day.activities.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold font-serif text-foreground mb-3 flex items-center"><MapPin className="w-5 h-5 mr-2 text-teal-600 shrink-0"/>Activities & Sightseeing</h4>
                            <ul className="space-y-3 pl-1">
                              {day.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-start space-x-3 group">
                                  <span className="mt-1 group-hover:text-accent transition-colors">{getActivityIcon(activity)}</span>
                                  <p className="text-sm font-sans"><FormatActivityText activity={activity} /></p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {day.dining.length > 0 && (
                          <div className="pt-4 mt-4 border-t border-border/50">
                            <h4 className="text-lg font-semibold font-serif text-foreground mb-3 flex items-center"><ChefHat className="w-5 h-5 mr-2 text-red-600 shrink-0"/>Dining Suggestions</h4>
                            <ul className="space-y-2 pl-1">
                              {day.dining.map((item, i) => <li key={i} className="text-sm text-foreground/80 font-sans ml-1 flex items-start space-x-3"><Utensils className="w-4 h-4 mr-1 mt-1 text-red-400 shrink-0"/><span>{item}</span></li>)}
                            </ul>
                          </div>
                        )}
                        {day.accommodation.length > 0 && (
                          <div className="pt-4 mt-4 border-t border-border/50">
                            <h4 className="text-lg font-semibold font-serif text-foreground mb-3 flex items-center"><Hotel className="w-5 h-5 mr-2 text-purple-600 shrink-0"/>Accommodation Notes</h4>
                            <ul className="space-y-2 pl-1">
                              {day.accommodation.map((item, i) => <li key={i} className="text-sm text-foreground/80 font-sans ml-1 flex items-start space-x-3"><Hotel className="w-4 h-4 mr-1 mt-1 text-purple-400 shrink-0"/><span>{item}</span></li>)}
                            </ul>
                          </div>
                        )}
                        {day.travelTips.length > 0 && (
                          <div className="pt-4 mt-4 border-t border-border/50">
                            <h4 className="text-lg font-semibold font-serif text-foreground mb-3 flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-yellow-500 shrink-0"/>Travel Tips</h4>
                            <ul className="space-y-2 pl-1">
                              {day.travelTips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-sm text-foreground/80 font-sans ml-1 flex items-start space-x-3"><Info className="w-4 h-4 mr-1 mt-1 text-yellow-400 shrink-0"/><span>{tip}</span></li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </ScrollArea>

          <motion.div variants={itemVariants} className="lg:sticky top-24 space-y-6">
            <Card className="shadow-xl border-primary/20">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="text-2xl text-primary font-serif">Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm pt-6">
                {Object.entries({
                  "Duration": `${answers?.days || 'N/A'} Days`,
                  "Travelers": `${answers?.people || 'N/A'} People`,
                  "Budget": `₹${(answers?.budget || 0).toLocaleString('en-IN')}`,
                  "Accommodation Style": accommodationType
                }).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between pb-2 border-b border-border/30 last:border-b-0">
                    <span className="text-muted-foreground font-sans flex items-center">
                      {key === "Duration" && <CalendarDays className="w-4 h-4 mr-2 text-primary/70"/>}
                      {key === "Travelers" && <Users className="w-4 h-4 mr-2 text-primary/70"/>}
                      {key === "Budget" && <Wallet className="w-4 h-4 mr-2 text-primary/70"/>}
                      {key === "Accommodation Style" && <Hotel className="w-4 h-4 mr-2 text-primary/70"/>}
                      {key}:
                    </span>
                    <span className="font-semibold font-sans text-right">{value}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex-col items-start space-y-3 pt-4">
                 <Button variant="outline" className="w-full hover:border-primary hover:text-primary"><Edit3 className="mr-2 h-4 w-4"/> Modify Plan (Soon)</Button>
                 <Link to="/create-trip" className="w-full">
                    <Button variant="secondary" className="w-full"><Plane className="mr-2 h-4 w-4"/> Plan New Trip</Button>
                 </Link>
              </CardFooter>
            </Card>
            
            <Card className="shadow-lg border-accent/20">
                <CardHeader className="bg-accent/5 border-b border-accent/10">
                    <CardTitle className="text-xl text-accent font-serif flex items-center"><MessageSquare className="w-5 h-5 mr-2"/> AI Travel Assistant</CardTitle>
                    <CardDescription className="font-sans">Questions about {destination}? Ask away!</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <textarea className="w-full p-3 border border-input rounded-lg text-sm font-sans focus:ring-2 focus:ring-accent" rows="3" placeholder={`e.g., What's the best local dish in ${destination}?`}></textarea>
                    <Button variant="accent" className="w-full mt-3 hover:scale-105 transition-transform">Ask AI Helper</Button>
                </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryPage;
