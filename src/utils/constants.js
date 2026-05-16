
// Use Vite env variable first, then local backend for localhost, otherwise deployed backend.
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ? "http://localhost:7777" : "https://connectify-77hd.onrender.com");