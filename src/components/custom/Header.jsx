// src/components/custom/Header.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Menu, X, Loader2, MountainSnow, LogOut, UserCircle, Sun, Moon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { authService } from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Initial state, will be updated by useEffect

  // Effect for setting initial theme based on localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark') {
      setDarkMode(true);
    } else if (storedTheme === 'light') {
      setDarkMode(false);
    } else {
      setDarkMode(prefersDark); // Default to system preference
    }
    setLoading(false); // Initial theme check is done
  }, []);

  // Effect for applying theme and saving preference
  useEffect(() => {
    if (loading) return; // Don't run if initial theme check is not done
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode, loading]);

  // Effect for scroll-based header style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth state listener
  useEffect(() => {
    setLoading(true); // Set loading true for auth check as well
    const unsubscribe = authService.onAuthStateChangedListener((authUser) => {
      setUser(authUser ? { uid: authUser.uid, name: authUser.displayName, email: authUser.email, picture: authUser.photoURL } : null);
      setLoading(false); // Auth check done
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try { await authService.signInWithGoogle(); }
    catch (error) { console.error('Login error:', error); alert(error.message || "Failed to sign in."); setLoading(false); }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try { await authService.signOutUser(); setIsMobileMenuOpen(false); }
    catch (error) { console.error('Sign out error:', error); alert(error.message || "Failed to sign out."); setLoading(false); }
  };

  const toggleTheme = () => {
    if (!loading) { // Prevent toggle if initial theme/auth check is ongoing
        setDarkMode(prevMode => !prevMode);
    }
  };

  const navigationItems = [
    { name: 'Destinations', href: '/destinations' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Plan a Trip', href: '/create-trip' },
    { name: 'My Trips', href: '/my-trips', authRequired: true },
    { name: 'About Us', href: '/about' },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, y: -20 },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { type: 'spring', stiffness: 280, damping: 28, when: "beforeChildren", staggerChildren: 0.05 } },
    exit: { opacity: 0, height: 0, y: -20, transition: { duration: 0.25, ease: "easeIn" } },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  const AuthButton = ({ isMobile }) => {
    if (loading && !user) { // Show loader only if auth is loading and user is not yet known
      return (
        <Button variant="primary" size={isMobile ? "lg" : "default"} disabled className={cn("w-full md:w-auto", isMobile && "py-3 text-base")}>
          <Loader2 className="w-5 h-5 animate-spin" />
          {isMobile && <span className="ml-2">Loading...</span>}
        </Button>
      );
    }
    if (!user) {
      return (
        <Button
          onClick={handleGoogleSignIn} variant="primary" size={isMobile ? "lg" : "default"}
          className={cn("w-full md:w-auto transition-all hover:scale-105 hover:shadow-interactive active:scale-95", isMobile && "py-3 text-base")}
        > <UserCircle className="w-5 h-5 mr-2" /> Sign in
        </Button>
      );
    }
    return (
      <div className={cn("flex items-center gap-3", isMobile ? 'flex-col w-full items-stretch text-center' : '')}>
        {user.picture ? (
          <img src={user.picture} alt={user.name || "Profile"} className="w-10 h-10 rounded-full border-2 border-accent object-cover shadow-md mx-auto md:mx-0" referrerPolicy="no-referrer" />
        ) : ( <UserCircle className="w-10 h-10 text-accent mx-auto md:mx-0" /> )}
        {isMobile && <span className="text-sm text-foreground py-2">{user.name || user.email}</span>}
        <Button variant="outline" size={isMobile ? "lg" : "default"}
          className={cn("border-destructive/60 text-destructive/90 hover:bg-destructive/10 hover:text-destructive w-full md:w-auto transition-all hover:scale-105 active:scale-95", isMobile && "py-3 text-base")}
          onClick={handleSignOut}
        > <LogOut className="w-5 h-5 mr-2" /> Sign Out
        </Button>
      </div>
    );
  };

  return (
    <header className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 ease-out",
        isScrolled ? "border-border/60 bg-background/85 backdrop-blur-lg shadow-lg" : "border-transparent bg-background/60 backdrop-blur-md" // Maintained blur
      )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Reverted Logo Design */}
          <Link to="/" className="flex items-center space-x-3 group">
            <MountainSnow className="h-10 w-10 text-primary transition-transform group-hover:rotate-[-12deg] group-hover:scale-105 duration-300" />
            <div>
              <span className="text-2xl font-serif font-bold text-primary">WanderWise</span>
              <p className="text-xs text-muted-foreground font-sans hidden sm:block group-hover:text-accent transition-colors">Explore India, Your Way</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-5 lg:space-x-7">
            {navigationItems.map((item) => (
              (!item.authRequired || user) && (
                <NavLink key={item.name} to={item.href}
                  className={({ isActive }) =>
                    `text-sm font-medium font-sans transition-all duration-200 hover:text-accent transform hover:scale-105 ${
                      isActive ? 'text-accent font-semibold border-b-2 border-accent' : 'text-foreground/80'
                    }`
                  }
                > {item.name}
                </NavLink>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="hidden md:inline-flex text-foreground/70 hover:text-accent hover:bg-accent/10 rounded-full"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              disabled={loading} // Disable while initial theme is loading
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="hidden md:block"> <AuthButton isMobile={false} /> </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu" className="text-primary hover:bg-primary/10 rounded-full">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit"
            className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg shadow-2xl border-t border-border/50 overflow-hidden"
          >
            <nav className="px-5 pt-4 pb-6 space-y-2.5">
              {navigationItems.map((item, index) => (
                 (!item.authRequired || user) && (
                  <motion.div key={item.name} custom={index} variants={navItemVariants}>
                    <NavLink to={item.href}
                      className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-medium font-sans transition-colors hover:bg-accent/10 hover:text-accent ${ isActive ? 'text-accent bg-accent/5 font-semibold' : 'text-foreground' }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    > {item.name}
                    </NavLink>
                  </motion.div>
                 )
              ))}
              <motion.div custom={navigationItems.length + 1} variants={navItemVariants} className="pt-3 border-t border-border/40">
                 <Button 
                    variant="ghost" 
                    size="lg" 
                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} 
                    className="w-full justify-start text-foreground/80 hover:text-accent hover:bg-accent/10 py-3 text-base"
                    disabled={loading}
                 >
                  {darkMode ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />} Change to {darkMode ? "Light" : "Dark"} Mode
                </Button>
              </motion.div>
              <motion.div custom={navigationItems.length + 2} variants={navItemVariants} className="pt-3 border-t border-border/40">
                <AuthButton isMobile={true} />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;