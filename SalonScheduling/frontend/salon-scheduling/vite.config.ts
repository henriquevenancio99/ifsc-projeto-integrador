import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      registerType: "prompt",
      includeAssets: ["**/*"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      devOptions:{
        enabled: true
      },
      manifest: {
        name: "Salon Scheduling App",
        short_name: "Salon Scheduling App",
        description: "Aplicação PWA de Agendamento para Salão de Beleza",
        theme_color: "#f69435",
        background_color: "#f69435",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/icon_x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icon_x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon_x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon_x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
