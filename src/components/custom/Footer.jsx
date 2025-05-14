// src/components/custom/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MountainSnow, Mail, Phone, MapPin as MapPinIcon, Facebook, Instagram, Twitter, Linkedin, Send, ArrowUpCircle, Briefcase, BookOpen, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Explore',
      icon: <BookOpen className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-accent transition-colors" />,
      links: [
        { name: 'Destinations', href: '/destinations' },
        { name: 'Shared Experiences', href: '/experiences' },
        { name: 'Plan Your Trip', href: '/create-trip' },
        { name: 'My Saved Trips', href: '/my-trips', authRequired: true },
      ],
    },
    {
      title: 'Company',
      icon: <Briefcase className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-accent transition-colors" />,
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' }, // Assuming a contact page
        // { name: 'Blog / Articles', href: '/blog' }, // Placeholder
        // { name: 'Press', href: '/press' }, // Placeholder
      ],
    },
    {
      title: 'Legal',
      icon: <ShieldCheck className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-accent transition-colors" />,
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        // { name: 'Cookie Policy', href: '/cookies' }, // Placeholder
      ]
    },
  ];

  const socialLinks = [
      { name: 'Facebook', href: '#', icon: <Facebook className="w-5 h-5" /> }, // Size down for professional
      { name: 'Instagram', href: '#', icon: <Instagram className="w-5 h-5" /> },
      { name: 'Twitter', href: '#', icon: <Twitter className="w-5 h-5" /> },
      { name: 'LinkedIn', href: '#', icon: <Linkedin className="w-5 h-5" /> },
  ];
  
  const contactInfo = [
      { text: 'support@wanderwise.ai', href: 'mailto:support@wanderwise.ai', icon: <Mail className="w-4 h-4 mr-2.5 shrink-0 text-muted-foreground" /> },
      { text: '+91 123 456 7890', href: 'tel:+911234567890', icon: <Phone className="w-4 h-4 mr-2.5 shrink-0 text-muted-foreground" /> },
      { text: 'Mumbai, India', href: '#', icon: <MapPinIcon className="w-4 h-4 mr-2.5 shrink-0 text-muted-foreground" /> },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({ 
        opacity: 1, 
        y: 0, 
        transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" } 
    })
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      // Professional footer styling: subtle background, clear text, standard border
      className="bg-muted/30 text-foreground font-sans pt-12 md:pt-16 pb-8 border-t border-border/70 backdrop-blur-sm"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} custom={0} className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <MountainSnow className="h-9 w-9 text-primary transition-transform group-hover:scale-105 duration-300" />
              <div>
                <span className="text-2xl font-serif font-bold text-primary">WanderWise</span>
                <p className="text-xs text-muted-foreground">Explore India, Your Way.</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Crafting personalized Indian adventures with AI. Discover hidden gems and plan your dream trip.
            </p>
             <form className="flex gap-2">
                <input type="email" placeholder="Subscribe to our newsletter" className="flex-grow p-2.5 rounded-md bg-background text-sm text-foreground placeholder-muted-foreground border border-input focus:ring-2 focus:ring-primary focus:border-transparent"/>
                <Button type="submit" variant="primary" size="default" className="px-4 shrink-0 text-sm">
                    <Send className="w-4 h-4"/>
                </Button>
            </form>
          </motion.div>

          {/* Link Sections */}
          {footerSections.map((section, idx) => (
            <motion.div key={section.title} variants={itemVariants} custom={idx + 1}>
              <h3 className="text-md font-semibold font-serif text-foreground mb-4 flex items-center group">
                {section.icon}
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
           {/* Contact Info Section */}
           <motion.div variants={itemVariants} custom={footerSections.length +1}>
              <h3 className="text-md font-semibold font-serif text-foreground mb-4 flex items-center group">
                 <Phone className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-accent transition-colors" />
                 Contact Us
              </h3>
              <ul className="space-y-2.5">
                {contactInfo.map(info => (
                    <li key={info.text}>
                        <a href={info.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                            {info.icon} {info.text}
                        </a>
                    </li>
                ))}
              </ul>
          </motion.div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-border/50 pt-6 md:pt-8">
            <p className="text-xs text-muted-foreground mb-4 md:mb-0 text-center md:text-left">
                &copy; {currentYear} WanderWise AI. All rights reserved.
            </p>
            <div className="flex space-x-4">
                {socialLinks.map(social => (
                  <motion.a
                    key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-transform duration-200 transform hover:scale-110"
                    aria-label={social.name}
                    whileHover={{ y: -2 }}
                  > {social.icon}
                  </motion.a>
                ))}
            </div>
        </div>
        
        <div className="mt-6 text-center">
            <Button variant="ghost" onClick={scrollToTop} className="text-xs text-muted-foreground hover:text-primary hover:bg-muted/50 p-1.5 group rounded-full">
                <ArrowUpCircle className="w-4 h-4 mr-1.5 group-hover:animate-bounce-light"/>
                Back to Top
            </Button>
        </div>

      </div>
    </motion.footer>
  );
};

export default Footer;