import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // Note: 'allowedHosts' is not a valid property in Vite configuration.
  // If you need to restrict hosts, consider using a middleware or proxy configuration.
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"], // Exclure les dépendances spécifiques de l'optimisation
  },
  build: {
    outDir: "build", // Répertoire de sortie pour les fichiers de production
    sourcemap: "hidden", // Générer des sourcemaps pour faciliter le débogage
    minify: "esbuild", // Utiliser esbuild pour la minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // Séparer les dépendances principales dans un chunk "vendor"
        },
      },
    },
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
