// src/create-trip/index.jsx
import React, { useState, useEffect } from 'react'; // Keep useEffect
import { motion, AnimatePresence, useAnimation } from 'framer-motion'; // Import useAnimation
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { MapPin, CalendarDays, Users, Wallet, ArrowRight, ArrowLeft, Loader2, Sparkles, Info } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate, useLocation } from 'react-router-dom';
import { tripsService } from '../services/tripsService';
import { auth } from '../service/firebaseConfig';

const CreateTrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDestination = location.state?.destination || "";

  const [destination, setDestination] = useState(initialDestination);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    days: 5,
    budget: 25000,
    people: 2,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Animation controls for each icon
  const daysIconControls = useAnimation();
  const peopleIconControls = useAnimation();
  const budgetIconControls = useAnimation();

  // useEffect to trigger animations when specific answer values change
  useEffect(() => {
    // Pulse animation: scale up and back, slight rotate for fun
    daysIconControls.start({
      scale: [1, 1.3, 1],
      rotate: [0, 10, -5, 0],
      transition: { duration: 0.4, ease: "easeInOut" }
    });
  }, [answers.days, daysIconControls]);

  useEffect(() => {
    peopleIconControls.start({
      scale: [1, 1.3, 1],
      rotate: [0, -10, 5, 0],
      transition: { duration: 0.4, ease: "easeInOut" }
    });
  }, [answers.people, peopleIconControls]);

  useEffect(() => {
    budgetIconControls.start({
      scale: [1, 1.3, 1],
      rotate: [0, 5, -10, 0],
      transition: { duration: 0.4, ease: "easeInOut" }
    });
  }, [answers.budget, budgetIconControls]);


  useEffect(() => {
    if (initialDestination) {
      setCurrentStep(1);
    }
  }, [initialDestination]);

  // Define a helper function to get animation controls based on field ID
  const getIconControls = (fieldId) => {
    switch (fieldId) {
      case 'days':
        return daysIconControls;
      case 'people':
        return peopleIconControls;
      case 'budget':
        return budgetIconControls;
      default:
        return null;
    }
  };

  const steps = [
    {
      id: 'destination',
      // No dynamic animation needed for MapPin based on slider, but you can add a static motion.div if desired
      icon: <MapPin className="h-12 w-12 text-primary mb-4" />,
      title: "Where to, Wanderer?",
      description: "Start by telling us your dream destination in India.",
      field: "destination",
      inputType: "text",
      placeholder: "e.g., Goa, Shimla, Kerala",
      validation: (value) => value.trim() !== '',
      errorMessage: "Please enter a destination."
    },
    {
      id: 'days',
      // The icon itself is wrapped in motion.div below in the render logic
      iconComponent: CalendarDays, // Store component reference
      iconProps: { className: "h-12 w-12 text-primary mb-4" },
      title: "Duration of Your Getaway",
      description: "How many days are you planning for this adventure?",
      field: "days",
      inputType: "slider",
      min: 1,
      max: 30,
      unit: "days",
    },
    {
      id: 'people',
      iconComponent: Users,
      iconProps: { className: "h-12 w-12 text-primary mb-4" },
      title: "Fellow Travelers",
      description: "How many people are joining this trip?",
      field: "people",
      inputType: "slider",
      min: 1,
      max: 10,
      unit: "people",
    },
    {
      id: 'budget',
      iconComponent: Wallet,
      iconProps: { className: "h-12 w-12 text-primary mb-4" },
      title: "Your Travel Budget",
      description: "What's your approximate total budget for this trip (in INR)?",
      field: "budget",
      inputType: "slider",
      min: 5000,
      max: 500000,
      step: 1000,
      unit: "₹",
    },
    {
      id: 'confirmation',
      icon: <Sparkles className="h-12 w-12 text-accent mb-4" />, // Sparkles for confirmation
      title: "Ready to Generate Your Plan?",
      description: "We'll craft a personalized itinerary based on your preferences.",
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    setError(null);
    if (currentStepData.id === 'destination' && currentStepData.validation && !currentStepData.validation(destination)) {
      setError(currentStepData.errorMessage);
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCreateTrip();
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    if (currentStepData.field === "destination") {
      setDestination(e.target.value);
    }
  };
  
  const handleSliderChange = (value, field) => {
    setAnswers(prev => ({
      ...prev,
      [field]: Array.isArray(value) ? Math.round(value[0]) : Math.round(value)
    }));
  };

  const handleCreateTrip = async () => {
    // ... (your existing handleCreateTrip logic) ...
        if (!auth.currentUser) {
      setError("Please sign in to create and save your trip plan.");
      // Optionally, trigger sign-in flow or navigate to login
      // navigate('/signin'); 
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // Use latest stable model

      // More detailed prompt for better results
      const prompt = `
        You are an expert travel planner for India. Create a detailed, engaging, and practical travel itinerary.
        Destination: ${destination}
        Duration: ${answers.days} days
        Number of People: ${answers.people}
        Total Budget: ₹${answers.budget.toLocaleString('en-IN')} (Indian Rupees)

        Please provide the itinerary in a well-structured plain text format (not JSON or Markdown initially, as it will be parsed later).
        Include the following for each day:
        - Day X: [Brief overview of the day's theme or main location]
        - Morning: [Specific activity or place, estimated time, brief description, and any entry fees if applicable in INR]
        - Afternoon: [Specific activity or place, estimated time, brief description, and any entry fees if applicable in INR]
        - Evening: [Specific activity or place, estimated time, brief description, and any entry fees if applicable in INR]
        - Accommodation: Suggest 1-2 types of accommodation (e.g., "Mid-range hotel near X" or "Boutique guesthouse in Y area") suitable for the budget.
        - Dining: Suggest 1-2 meal options for lunch and dinner (e.g., "Try local thali at Restaurant Z (Lunch)" or "Street food tour in X area (Dinner)").
        - Travel Tip: One practical tip for the day (e.g., "Book Elephanta Caves ferry in advance" or "Wear comfortable shoes for exploring Old Delhi").
        
        General Information to include at the end of the itinerary:
        - Overall Budget Notes: Briefly mention how the budget might be allocated (e.g., "Budget allows for comfortable stays and a mix of free and paid attractions.").
        - Transportation: General advice on getting around in ${destination} (e.g., "Auto-rickshaws and ride-hailing apps are common").
        - Best Time to Visit ${destination}: [Mention ideal months or seasons].
        - Cultural Notes: 1-2 important cultural etiquettes for ${destination}.

        Focus on popular and unique experiences. Ensure the plan is realistic for the given duration and budget.
        Be creative and inspiring!
      `;

      const result = await model.generateContent(prompt);
      const tripDataText = result.response.text();
      
      if (!tripDataText) {
        throw new Error("The AI model did not return any itinerary data. Please try again.");
      }

      const tripDetailsToSave = {
        destination,
        tripData: tripDataText, // Save the raw text from AI
        answers // Contains days, budget, people
      };
      
      await tripsService.createTrip(tripDetailsToSave, auth.currentUser.uid);
      navigate('/itin', { state: { ...tripDetailsToSave } });

    } catch (apiError) {
      console.error("Error creating trip with AI:", apiError);
      setError(apiError.message || "Failed to generate trip plan. The AI service might be busy or unavailable. Please try again later.");
    }
    setLoading(false);
  };


  const progressPercentage = ((currentStep + (initialDestination ? 0 : 1)) / (steps.length + (initialDestination ? 0 : (currentStepData.id === 'destination' ? 0 : -1) ))) * 100;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-background to-secondary/30 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl shadow-2xl overflow-hidden glass-effect"> {/* Added glass-effect for fun */}
        <CardHeader className="bg-transparent p-6 border-b border-primary/20"> {/* Made header transparent to show glass */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CardTitle className="text-3xl text-center font-fun-display text-primary"> {/* Fun font */}
              Plan Your Next Indian Escape
            </CardTitle>
            <CardDescription className="text-center text-lg mt-2 font-fun-sans"> {/* Fun font */}
              Let's tailor your perfect journey, step by step.
            </CardDescription>
          </motion.div>
          <Progress value={progressPercentage} className="w-full mt-4 h-3" indicatorClassName="bg-gradient-to-r from-accent to-primary" /> {/* Gradient progress */}
        </CardHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <CardContent className="p-8 md:p-10 text-center min-h-[320px] flex flex-col justify-center"> {/* Increased min-h slightly for icon space */}
              <div className="flex justify-center mb-6">
                {currentStepData.iconComponent ? (
                  <motion.div animate={getIconControls(currentStepData.id)}>
                    <currentStepData.iconComponent {...currentStepData.iconProps} />
                  </motion.div>
                ) : (
                  currentStepData.icon // For static icons like MapPin or Sparkles
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold font-serif text-foreground mb-3">{currentStepData.title}</h2>
              <p className="text-muted-foreground mb-8 text-md font-fun-sans">{currentStepData.description}</p>

              {currentStepData.inputType === "text" && (
                <input
                  type="text"
                  value={destination}
                  onChange={handleInputChange}
                  placeholder={currentStepData.placeholder}
                  className="w-full max-w-md mx-auto p-3 border-2 border-input rounded-lg text-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label={currentStepData.field}
                />
              )}

              {currentStepData.inputType === "slider" && (
                <div className="w-full max-w-md mx-auto space-y-4">
                  <motion.div 
                    key={answers[currentStepData.field]} // Re-animate when value changes
                    initial={{ scale: 0.9, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="text-4xl font-bold text-accent font-fun-display" // Fun font for numbers
                  >
                    {currentStepData.unit === "₹" && currentStepData.unit}
                    {answers[currentStepData.field].toLocaleString('en-IN')}
                    {currentStepData.unit !== "₹" && ` ${answers[currentStepData.field] === 1 && currentStepData.field === 'people' ? 'person' : currentStepData.unit}`}
                  </motion.div>
                  <Slider
                    defaultValue={[answers[currentStepData.field]]}
                    min={currentStepData.min}
                    max={currentStepData.max}
                    step={currentStepData.step || 1}
                    onValueChange={(value) => handleSliderChange(value, currentStepData.field)}
                    className="w-full"
                    aria-label={`${currentStepData.title} slider`}
                    classNames={{ // You can use these if you customized Slider component to accept them
                      track: "bg-primary/20 h-3",
                      range: "bg-gradient-to-r from-accent to-primary",
                      thumb: "h-6 w-6 border-2 border-background bg-primary shadow-lg"
                    }}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground font-fun-sans">
                    <span>{currentStepData.min} {currentStepData.unit !== "₹" ? (currentStepData.min === 1 && currentStepData.field === 'people' ? 'person' : currentStepData.unit ) : ""}</span>
                    <span>{currentStepData.max.toLocaleString('en-IN')} {currentStepData.unit !== "₹" ? currentStepData.unit : ""}</span>
                  </div>
                </div>
              )}
              
              {/* ... (rest of your confirmation and error rendering logic) ... */}
                {currentStepData.id === 'confirmation' && auth.currentUser && (
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg max-w-md mx-auto text-left text-sm font-fun-sans">
                    <Info className="inline-block h-5 w-5 mr-2 text-primary mb-1" />
                    You're about to generate an AI-powered itinerary for:
                    <ul className="list-disc list-inside ml-4 mt-2 text-foreground/80">
                        <li><strong>Destination:</strong> {destination}</li>
                        <li><strong>Duration:</strong> {answers.days} days</li>
                        <li><strong>Travelers:</strong> {answers.people} {answers.people === 1 ? "person" : "people"}</li>
                        <li><strong>Budget:</strong> ₹{answers.budget.toLocaleString('en-IN')}</li>
                    </ul>
                </div>
              )}
               {currentStepData.id === 'confirmation' && !auth.currentUser && (
                 <p className="text-destructive mt-4 font-fun-sans">Please sign in to generate and save your trip plan.</p>
               )}
              {error && <p className="text-destructive mt-4 text-sm font-fun-sans">{error}</p>}

            </CardContent>
          </motion.div>
        </AnimatePresence>

        <CardFooter className="p-6 bg-transparent border-t border-primary/20 flex justify-between items-center"> {/* Made footer transparent */}
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 0 || loading}
            className="transition-transform hover:scale-105 shadow-sm hover:shadow-md !rounded-lg" // explicit rounding
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            variant={currentStep === steps.length - 1 ? "accent" : "primary"} // Accent for final step
            onClick={handleNext} 
            disabled={loading || (currentStepData.id === 'confirmation' && !auth.currentUser)}
            className="transition-transform hover:scale-105 min-w-[150px] shadow-md hover:shadow-lg !rounded-lg" // explicit rounding
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {currentStep === steps.length - 1 ? "Generate Plan" : "Next"}
                {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
                {currentStep === steps.length - 1 && <Sparkles className="h-4 w-4 ml-2" />}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <p className="text-xs text-muted-foreground mt-6 text-center font-fun-sans">
        WanderWise uses AI to help you plan. Itineraries are suggestions and can be customized.
      </p>
    </div>
  );
};

export default CreateTrip;