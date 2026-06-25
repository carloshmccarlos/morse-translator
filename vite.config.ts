import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep xlsx out of the main bundle — it's only needed for spreadsheet export/import
          xlsx: ["xlsx"]
        }
      }
    }
  }
});
