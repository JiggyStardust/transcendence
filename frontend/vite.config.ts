import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
      throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value;
  };

  return {
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
  }
});
