import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }]
        ]
      }
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
    headers: {
      "Content-Type": "application/javascript"
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
