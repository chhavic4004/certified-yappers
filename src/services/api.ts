// Backend API endpoint
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

export default {
  BACKEND_URL,
};
