import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: env.VITE_HOST ?? "0.0.0.0",
      port: parseInt(env.VITE_PORT ?? "3000"),
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_INTERNAL_URL,
          changeOrigin: true,
        },
      },
    },
  }
});
