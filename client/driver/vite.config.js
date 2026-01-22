import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "YamuBus Driver",
        short_name: "Driver App",
        description: "Driver Companion App for YamuBus Fleet Management",
        theme_color: "#1a1d21",
        background_color: "#1a1d21",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshot-mobile.png",
            sizes: "540x720",
            type: "image/png",
            label: "Mobile View Example",
          },
          {
            src: "screenshot-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Desktop View Example",
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
}});
