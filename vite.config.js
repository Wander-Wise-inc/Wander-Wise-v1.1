// vite.config.js
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite" // Added loadEnv

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode (development, production)
  // This makes environment variables accessible in this config file if needed
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // Add this if you're using Emotion or another CSS-in-JS lib that needs Babel
        // babel: {
        //   plugins: ['@emotion/babel-plugin'],
        // },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000, // Optional: define a port
      open: true, // Optional: open browser on start
    },
    build: {
      sourcemap: true, // Optional: generate sourcemaps for production build
    },
    // Define global constants based on environment variables
    // These will be replaced string-wise in your client-side code.
    // Useful if you need to expose non-VITE_ prefixed env vars, but VITE_ prefix is preferred for client-side.
    define: {
      // Example: 'process.env.NODE_ENV': JSON.stringify(mode),
      // 'APP_VERSION': JSON.stringify(process.env.npm_package_version)
    }
  }
})
