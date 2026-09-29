export const AUTH_COOKIE = "tkdraw_token";
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;  

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  const sameSite = (process.env.COOKIE_SAMESITE || "lax").toLowerCase();  
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true" || isAllowedSecure(isProd, sameSite),
    sameSite,
    path: "/",
  };
};

const isAllowedSecure = (isProd, sameSite) => isProd || sameSite === "none";

export const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions(), maxAge: MAX_AGE });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE, cookieOptions());
};

export const parseCookies = (header = "") => {
  const cookies = {};
  header.split(";").forEach((part) => {
    const idx = part.indexOf("=");
    if (idx < 0) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) return;
    try {
      cookies[key] = decodeURIComponent(value);
    } catch {
      cookies[key] = value;
    }
  });
  return cookies;
};

export const getTokenFromRequest = (req) => {
  const fromCookie = parseCookies(req.headers.cookie)[AUTH_COOKIE];
  if (fromCookie) return fromCookie;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};