
export const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const isAllowedOrigin = (origin) => allowedOrigins.includes(origin);