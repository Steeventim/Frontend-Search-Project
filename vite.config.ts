import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"], // Pre-bundle critical dependencies
    exclude: ["lucide-react"], // Exclude large icon libraries
  },
  build: {
    outDir: "build",
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    minify: "esbuild",
    target: "es2020", // Modern target for better optimization
    cssCodeSplit: true, // Split CSS for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ["react", "react-dom"],

          // Router and navigation
          router: ["react-router-dom"],

          // UI libraries
          ui: ["@headlessui/react", "framer-motion"],

          // Utilities and HTTP
          utils: ["axios", "js-cookie", "lodash", "uuid"],

          // Icons (lazy loaded)
          icons: ["lucide-react"],

          // Date and form utilities
          forms: ["react-hook-form", "joi"],
        },
        // Optimize chunk names for better caching
        chunkFileNames: () => {
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name!)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(css)$/i.test(assetInfo.name!)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Performance optimizations
    reportCompressedSize: false, // Disable to speed up build
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
  server: {
    host: "0.0.0.0", // Permettre l'accès depuis d'autres appareils
    port: 5173, // Port du serveur de développement
    open: false, // Ouvrir automatiquement le navigateur sur l'appareil local
    // Removed invalid 'sourcemap' property
    hmr: {
      protocol: "ws", // Utiliser WebSocket pour le rechargement à chaud
      host: "localhost", // Hôte pour le rechargement à chaud
      port: 5173, // Port pour le rechargement à chaud
      clientPort: 5173, // Port client pour le rechargement à chaud
      overlay: false, // Afficher les erreurs de compilation dans le navigateur
    },
  },
});
