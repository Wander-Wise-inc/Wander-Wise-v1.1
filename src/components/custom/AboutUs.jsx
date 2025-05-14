// src/components/custom/AboutUs.jsx
import React from 'react';
import { Globe, MapPinned, Users, Zap, Heart, Lightbulb, Briefcase, Code2, Brain, Linkedin, Twitter, ArrowRight } from 'lucide-react'; 
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Using Card for team members
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Using Avatar

const AboutUs = () => {
  const values = [
    { icon: <Globe size={36} className="text-accent" />, title: "Authentic Discoveries", description: "We craft journeys beyond tourist trails, revealing India's true soul and stories." },
    { icon: <MapPinned size={36} className="text-accent" />, title: "Personalized Journeys", description: "Your adventure, your way. We design trips meticulously tailored to your interests, pace, and dreams." },
    { icon: <Users size={36} className="text-accent" />, title: "Local Connections", description: "Experience India via those who know it best, thanks to our deep local network and partnerships." },
    { icon: <Brain size={36} className="text-accent" />, title: "AI-Powered Precision", description: "Leveraging smart AI to make your travel planning effortless, intelligent, and inspiring." },
    { icon: <Heart size={36} className="text-accent" />, title: "Passionate Experts", description: "Our team comprises avid travelers and India enthusiasts dedicated to making your trip unforgettable." },
    { icon: <Lightbulb size={36} className="text-accent" />, title: "Innovative Spirit", description: "Continuously exploring new ways to enhance your travel experience with creative solutions." }
  ];

  const teamMembers = [
    { 
      name: "Griffin Jolly", 
      role: "Lead Developer & Visionary", 
      avatar: "/images/team/griffin-avatar.jpg", // Replace with actual path or use placeholder logic
      bio: "Griffin is the architect behind WanderWise, driven by a passion for technology and travel. He spearheads development with a keen eye for user experience and innovative AI integration to simplify trip planning.",
      linkedin: "https://linkedin.com/in/griffinjolly", // Example
      github: "https://github.com/griffinjolly", // Example
      icon: <Code2 className="w-5 h-5"/>
    },
    { 
      name: "Dan Mecartin", 
      role: "AI & UX Strategist", 
      avatar: "/images/team/dan-avatar.jpg", // Replace with actual path or use placeholder logic
      bio: "Dan shapes the intelligent core and user interaction of WanderWise. His expertise in AI and user-centric design ensures that every itinerary is not just planned, but perfectly attuned to the traveler's desires.",
      linkedin: "https://linkedin.com/in/danmecartin", // Example
      twitter: "https://twitter.com/danmecartin", // Example
      icon: <Brain className="w-5 h-5"/>
    },
  ];

  const fadeInAnimation = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { delay: delay, duration: 0.6, ease: "easeOut" } },
    viewport: { once: true, amount: 0.2 }
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background via-secondary/5 to-background text-foreground overflow-hidden"
    >
      {/* Hero Section with Dynamic Blur and Gradient Text */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="/images/backgrounds/india-map-abstract.jpg" alt="Abstract map of India" className="w-full h-full object-cover opacity-20 blur-sm"/>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <motion.div {...fadeInAnimation()} className="container mx-auto px-6 lg:px-8 relative z-10">
          <h1 className='text-5xl sm:text-6xl md:text-7xl font-bold font-serif mb-6 leading-tight'>
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              We Are WanderWise
            </span>
          </h1>
          <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-sans mb-10'>
            Your personal AI travel companion, dedicated to crafting unforgettable journeys across the vibrant landscapes and rich cultures of India.
          </p>
          <Link to="/create-trip">
            <Button size="lg" variant="accent" className="text-base shadow-interactive hover:scale-105 transition-transform">
                Start Planning Your Dream Trip <ArrowRight className="ml-2 w-5 h-5"/>
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2 {...fadeInAnimation(0.2)} className="text-3xl sm:text-4xl font-bold font-serif text-primary text-center mb-14 md:mb-20">
            Our Guiding <span className="text-accent">Principles</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={value.title} 
                {...fadeInAnimation(0.1 * index + 0.3)}
                className="bg-card rounded-xl p-6 text-center shadow-lg hover:shadow-card-hover transition-all duration-300 border border-card-border flex flex-col items-center transform hover:-translate-y-1"
              >
                <div className="p-3 bg-accent/10 rounded-full mb-5 inline-block">
                  {value.icon}
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold font-serif text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground font-sans flex-grow">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-16 md:py-24 bg-muted/20 relative overflow-hidden">
         <div className="absolute inset-0 opacity-30"> {/* Subtle pattern */}
            {/* <img src="/images/patterns/geometric-pattern.svg" className="w-full h-full object-cover "/> */}
         </div>
        <div className="container mx-auto px-6 lg:px-8 relative">
            <motion.div {...fadeInAnimation()} className="max-w-3xl mx-auto text-center">
                <Briefcase size={48} className="text-accent mx-auto mb-6"/>
                <h2 className="text-3xl sm:text-4xl font-bold font-serif text-primary mb-6">Our Mission</h2>
                <p className="text-lg text-foreground/85 font-sans leading-relaxed">
                    At WanderWise, our mission is to revolutionize travel planning for India. We believe everyone deserves a journey that's not just a trip, but a deeply personal and enriching experience. By combining the power of artificial intelligence with a passion for authentic exploration, we aim to make discovering the wonders of India simpler, more intuitive, and incredibly rewarding.
                </p>
            </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.h2 {...fadeInAnimation()} className="text-3xl sm:text-4xl font-bold font-serif text-primary text-center mb-14 md:mb-20">
            Meet The <span className="text-accent">Architects</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-10 lg:gap-12 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div key={member.name} {...fadeInAnimation(0.2 * index + 0.2)}>
                <Card variant="default" className="h-full flex flex-col text-center md:text-left items-center md:items-start p-6 hover:shadow-card-hover transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row items-center md:space-x-6 w-full">
                        <Avatar className="w-24 h-24 md:w-28 md:h-28 mb-4 md:mb-0 border-4 border-accent/60 shadow-lg shrink-0">
                            <AvatarImage src={member.avatar || `https://ui-avatars.com/api/?name=${member.name.replace(" ","+")}&size=128&background=random&font-size=0.33&bold=true`} alt={member.name} />
                            <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold font-serif text-primary">{member.name}</h3>
                            <p className="text-accent font-semibold text-sm mb-2 flex items-center justify-center md:justify-start">
                                {member.icon} <span className="ml-1.5">{member.role}</span>
                            </p>
                        </div>
                    </div>
                  <CardContent className="pt-4 px-0 md:px-1">
                    <p className="text-sm text-muted-foreground font-sans leading-relaxed">{member.bio}</p>
                    <div className="mt-4 flex justify-center md:justify-start space-x-3">
                        {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent"><Linkedin size={20}/></a>}
                        {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent"><Code2 size={20}/></a>}
                        {member.twitter && <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent"><Twitter size={20}/></a>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <motion.section {...fadeInAnimation(0.4)} className="py-16 text-center bg-gradient-to-r from-primary via-primary-hover to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-6">
            Ready to Start Your Indian Adventure?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Let WanderWise be your guide. Plan your personalized trip today!
          </p>
          <Link to="/destinations">
            <Button size="lg" variant="accent" className="text-base shadow-xl hover:scale-105 transition-transform px-10 py-3.5">
              Explore Destinations Now
            </Button>
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AboutUs;
