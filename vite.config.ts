import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"], // Exclure les dépendances spécifiques de l'optimisation
  },
  build: {
    outDir: "build", // Répertoire de sortie pour les fichiers de production
    sourcemap: true, // Générer des sourcemaps pour faciliter le débogage
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
    open: true, // Ouvrir automatiquement le navigateur sur l'appareil local
  },
});
