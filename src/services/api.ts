// Backend API endpoint
// For local dev: backend runs on port 5051. Set VITE_BACKEND_URL in .env for production.
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5051";

export default {
  BACKEND_URL,
};
