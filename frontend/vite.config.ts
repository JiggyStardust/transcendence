import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: getEnv("VITE_HOST", "0.0.0.0"),
    port: parseInt(getEnv("VITE_PORT", "3000")),
    proxy: {
      "/api": {
        target: getEnv("VITE_BACKEND_INTERNAL_URL"),
        changeOrigin: true,
      },
    },
  },
});
