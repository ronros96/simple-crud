import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  build: {
    outDir: './dist'
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@page": path.resolve(__dirname, "src/pages"),
      "@layout": path.resolve(__dirname, "src/layout"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
})
