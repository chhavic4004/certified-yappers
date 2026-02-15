// Backend API endpoint
<<<<<<< HEAD
// For local dev: backend runs on port 5051. Set VITE_BACKEND_URL in .env for production.
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5051";
=======
// Prefer an explicit VITE_BACKEND_URL, otherwise use localhost during development when running locally,
// and fall back to the hosted backend for production/demo.
const envUrl = import.meta.env.VITE_BACKEND_URL;
let defaultBackend = "https://flavour-ai-backend.vercel.app";
if (typeof window !== "undefined") {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    defaultBackend = "http://localhost:5051";
  }
}
export const BACKEND_URL = envUrl || defaultBackend;
>>>>>>> origin/main

export default {
  BACKEND_URL,
};
