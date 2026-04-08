import { fileURLToPath, URL } from "url";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath as fileURLToPathNode } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import environment from "vite-plugin-environment";

const __dirname = dirname(fileURLToPathNode(import.meta.url));

const DFX_NETWORK = process.env.DFX_NETWORK || "ic";

const ii_url =
  DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

// Resolve backend canister ID from environment (set by Caffeine platform at build time)
const backendCanisterId =
  process.env.CANISTER_BACKEND_ID ||
  process.env.CANISTER_ID_BACKEND ||
  "";

// Resolve backend host based on network
const backendHost =
  process.env.BACKEND_HOST ||
  (DFX_NETWORK === "local"
    ? "http://127.0.0.1:4943"
    : "https://icp-api.io");

// Resolve project ID from caffeine.toml env var or default
const projectId = process.env.PROJECT_ID || process.env.CAFFEINE_PROJECT_ID || "my-app";

// Resolve II derivation origin
const iiDerivationOrigin =
  process.env.II_DERIVATION_ORIGIN ||
  process.env.INTERNET_IDENTITY_DERIVATION_ORIGIN ||
  "";

// Plugin that writes a real env.json with resolved values at build time
function generateEnvJsonPlugin() {
  return {
    name: "generate-env-json",
    buildStart() {
      const envConfig = {
        backend_host: backendHost,
        backend_canister_id: backendCanisterId,
        project_id: projectId,
        ii_derivation_origin: iiDerivationOrigin,
      };
      const envJsonPath = resolve(__dirname, "env.json");
      writeFileSync(envJsonPath, JSON.stringify(envConfig, null, 2));
      console.log("[generate-env-json] Written env.json:", envConfig);
    },
  };
}

export default defineConfig({
  logLevel: "error",
  build: {
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    generateEnvJsonPlugin(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    environment(["II_URL"]),
    environment(["STORAGE_GATEWAY_URL"]),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@dfinity/agent"]
  },
});
