// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // Enabled for manual toggle
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'Lato', 'Inter', 'system-ui', 'sans-serif'],
                serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
                cursive: ['var(--font-cursive)', 'Pacifico', 'cursive'],
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    hover: 'hsl(var(--primary-hover))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    hover: 'hsl(var(--secondary-hover))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                    hover: 'hsl(var(--accent-hover))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                    border: 'hsl(var(--card-border))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                // Removed direct playful colors from here, they exist as CSS vars if needed
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                DEFAULT: 'var(--radius-md)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                full: 'var(--radius-full)',
            },
            boxShadow: {
                'card-hover': '0 14px 30px -10px hsla(var(--foreground-hsl), 0.12), 0 8px 15px -8px hsla(var(--foreground-hsl), 0.1)', // Professional hover
                'interactive': '0 7px 20px -3px hsla(var(--primary-hsl), 0.45)', // Primary color for interactive shadow
                'subtle-glow-primary': '0 0 25px 0px hsla(var(--primary-hsl), 0.2)',
                'subtle-glow-accent': '0 0 25px 0px hsla(var(--accent-hsl), 0.25)',
                'soft-lift': '0 5px 15px rgba(var(--foreground-hsl), 0.07)',
                 // Removed fun-glow, can be recreated with CSS vars if needed
            },
            backgroundImage: {
                'gradient-primary-accent': 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
                'hero-pattern': "url('/images/patterns/subtle-geo-pattern.svg')", // More professional pattern
                'animated-hero-gradient': 'linear-gradient(120deg, hsl(var(--primary-hsl)/0.7), hsl(var(--secondary-hsl)/0.6), hsl(var(--accent-hsl)/0.7), hsl(var(--primary-hsl)/0.55), hsl(var(--secondary-hsl)/0.65))',
                 // Removed fun-gradient
            },
            backdropBlur: {
                'none': '0',
                'xs': '2px',
                'sm': '4px',
                DEFAULT: '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px',
                '2xl': '40px',
                '3xl': '64px',
            },
            blur: {
              'xs': '2px',
              'sm': '4px',
              DEFAULT: '8px',
              'md': '12px',
              'lg': '16px',
              'xl': '24px',
              '2xl': '40px',
              '3xl': '64px',
            },
            keyframes: {
                "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
                "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
                "slide-in-left": { from : { transform: "translateX(-100%)", opacity: "0"}, to: { transform: "translateX(0)", opacity: "1"} },
                "slide-in-right": { from : { transform: "translateX(100%)", opacity: "0"}, to: { transform: "translateX(0)", opacity: "1"} },
                "fade-in": { from: { opacity: "0"}, to: { opacity: "1"} },
                "pulse-glow": { // General pulse glow, can use accent or primary
                    '0%, 100%': { boxShadow: '0 0 10px hsla(var(--ring-hsl), 0.3)' },
                    '50%': { boxShadow: '0 0 25px 8px hsla(var(--ring-hsl), 0.45)' },
                },
                "subtle-bob": { '0%, 100%': { transform: 'translateY(-3px)'}, '50%': { transform: 'translateY(3px)'} },
                "gradientWave": { 
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                "bounce-light": {
                    '0%, 100%': { transform: 'translateY(-6%)', animationTimingFunction: 'cubic-bezier(0.7,0,0.8,1)' },
                    '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.2,0,0.3,1)' },
                },
                "wiggle": { // Kept as it's a fun, small animation
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' },
                }
              },
              animation: {
                "accordion-down": "accordion-down 0.3s ease-out",
                "accordion-up": "accordion-up 0.3s ease-out",
                "slide-in-left": "slide-in-left 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
                "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
                "fade-in": "fade-in 0.7s ease-out forwards",
                "pulse-glow": "pulse-glow 3.5s infinite ease-in-out",
                "subtle-bob": "subtle-bob 4s infinite ease-in-out",
                "gradient-wave": "gradientWave 18s ease infinite", 
                "bounce-light": "bounce-light 1.5s infinite",
                "wiggle": "wiggle 1s ease-in-out infinite",
              },
        }
    },
    plugins: [
        require("tailwindcss-animate"),
        require('@tailwindcss/typography'),
    ],
}