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

// Resolve backend canister ID from environment (set by Caffeine platform at build time).
// IMPORTANT: @caffeineai/core-infrastructure loadConfig() checks for the literal string
// "undefined" to trigger its fallback to process.env.CANISTER_ID_BACKEND (baked in via
// vite-plugin-environment). An empty string "" bypasses this check and creates a broken actor.
// So we must write "undefined" (string) when the value is not known at build time.
const backendCanisterId =
  process.env.CANISTER_ID_BACKEND ||
  process.env.CANISTER_BACKEND_ID ||
  "undefined";

// Resolve backend host based on network
const backendHost =
  process.env.BACKEND_HOST ||
  (DFX_NETWORK === "local"
    ? "http://127.0.0.1:4943"
    : "https://icp-api.io");

// Resolve project ID — use the fixed project ID from this app
const projectId =
  process.env.PROJECT_ID ||
  process.env.CAFFEINE_PROJECT_ID ||
  "019d6b3f-23aa-72a7-97e4-13d23209e6c8";

// Resolve II derivation origin — write "undefined" (string) when not set so loadConfig()
// treats it as absent rather than using an empty string as the derivation origin.
const iiDerivationOrigin =
  process.env.II_DERIVATION_ORIGIN ||
  process.env.INTERNET_IDENTITY_DERIVATION_ORIGIN ||
  "undefined";

// Plugin that writes env.json with resolved values at build time
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
