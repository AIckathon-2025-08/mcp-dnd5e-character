import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "web",
  base: "/mcp-dnd5e-character/",
  plugins: [react()],
  build: {
    outDir: "../docs",
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
});
