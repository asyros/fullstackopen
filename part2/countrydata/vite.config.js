import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  replace: {
    "process.env.VITE_APP_WEATHER_API_KEY": JSON.stringify(
      process.env.VITE_APP_WEATHER_API_KEY
    ),
  },
});
