import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendOtpEmail, sendResetOtpEmail } from "../utils/sendEmail.js";
import { setAuthCookie, clearAuthCookie } from "../utils/auth.cookie.js";

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const hashOtp = (otp) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET).update(String(otp)).digest("hex");

const otpMatches = (plainOtp, storedHash) => {
  if (!storedHash || typeof plainOtp !== "string") return false;
  const a = Buffer.from(hashOtp(plainOtp));
  const b = Buffer.from(String(storedHash));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};



const MAX_IP_ATTEMPTS = 5;
const MAX_EMAIL_ATTEMPTS = 30;
const ATTEMPT_TTL = 15 * 60 * 1000;
const SEND_COOLDOWN = 25 * 1000;  

const attemptStore = new Map();  
const sendStore = new Map();  

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of attemptStore) if (v.expiresAt <= now) attemptStore.delete(k);
  for (const [k, t] of sendStore) if (now - t > SEND_COOLDOWN) sendStore.delete(k);
}, 60 * 1000).unref?.();

const getCount = (key) => {
  const e = attemptStore.get(key);
  if (!e) return 0;
  if (e.expiresAt <= Date.now()) {
    attemptStore.delete(key);
    return 0;
  }
  return e.count;
};

const bump = (key) => {
  const e = attemptStore.get(key);
  if (e && e.expiresAt > Date.now()) {
    e.count += 1;
  } else {
    attemptStore.set(key, { count: 1, expiresAt: Date.now() + ATTEMPT_TTL });
  }
};

const ipKey = (type, email, req) => `${type}:ip:${email}:${req.ip}`;
const emailKey = (type, email) => `${type}:email:${email}`;

const isLocked = (type, email, req) =>
  getCount(ipKey(type, email, req)) >= MAX_IP_ATTEMPTS ||
  getCount(emailKey(type, email)) >= MAX_EMAIL_ATTEMPTS;

const recordFail = (type, email, req) => {
  bump(ipKey(type, email, req));
  bump(emailKey(type, email));
};

const clearAttempts = (type, email) => {
  const ipPrefix = `${type}:ip:${email}:`;
  for (const k of attemptStore.keys()) {
    if (k.startsWith(ipPrefix)) attemptStore.delete(k);
  }
  attemptStore.delete(emailKey(type, email));
};

const canSendNow = (type, email) => {
  const key = `${type}:${email}`;
  const last = sendStore.get(key);
  if (last && Date.now() - last < SEND_COOLDOWN) return false;
  sendStore.set(key, Date.now());
  return true;
};

const normalizeEmail = (email) =>
  typeof email === "string" ? email.toLowerCase().trim() : "";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }

        if (username.trim().length < 3 || username.trim().length > 30) {
            return res.status(400).json({ success: false, message: "Username must be 3 to 30 characters" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const existingUser = await userModel.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await userModel.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            isVerified: false,
            otp: hashOtp(otp),
            otpExpiry,
        });

        try {
            await sendOtpEmail(user.email, otp);
        } catch (mailError) {
            console.error("Register OTP mail error:", mailError);
            await userModel.deleteOne({ _id: user._id });
            return res.status(502).json({ success: false, message: "Could not send OTP email. Please try again." });
        }

        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        return res.status(201).json({
            success: true,
            message: "OTP sent to your email. Please verify.",
            user: userResponse
        });
    } catch (error) {

        console.error("Register Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        notVerified: true,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = typeof req.body.otp === "string" ? req.body.otp.trim() : "";

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP required" });
    }

    if (isLocked("verify", email, req)) {
      return res.status(429).json({ success: false, message: "Too many wrong attempts. Please resend OTP." });
    }

    const user = await userModel.findOne({ email });

    if (!user || user.isVerified || !otpMatches(otp, user.otp)) {
      recordFail("verify", email, req);
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired, please resend" });
    }

    clearAttempts("verify", email);
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const resendOtp = async (req, res) => {


  const GENERIC_MESSAGE = "If this email is pending verification, a new OTP has been sent.";

  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const user = await userModel.findOne({ email });

    if (user && !user.isVerified && canSendNow("verify", email)) {
      try {
        const otp = generateOtp();
        user.otp = hashOtp(otp);
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        clearAttempts("verify", email);

        // await nahi: mail ki speed se email exist karta hai ye andaza na lage
        sendOtpEmail(user.email, otp).catch((err) =>
          console.error("Resend OTP mail error:", err)
        );
      } catch (innerError) {
        console.error("Resend OTP error:", innerError);
      }
    }

    return res.status(200).json({ success: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const forgotPassword = async (req, res) => {


  const GENERIC_MESSAGE = "If this email is registered, an OTP has been sent.";

  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const user = await userModel.findOne({ email });

    if (user && canSendNow("reset", email)) {
      try {
        const otp = generateOtp();
        user.resetOtp = hashOtp(otp);
        user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        clearAttempts("reset", email);

        sendResetOtpEmail(user.email, otp).catch((err) =>
          console.error("Forgot Password mail error:", err)
        );
      } catch (innerError) {
        console.error("Forgot Password send error:", innerError);
      }
    }

    return res.status(200).json({ success: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = typeof req.body.otp === "string" ? req.body.otp.trim() : "";
    const { newPassword } = req.body;

    if (!email || !otp || !newPassword || typeof newPassword !== "string") {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    if (isLocked("reset", email, req)) {
      return res.status(429).json({ success: false, message: "Too many wrong attempts. Please request a new OTP." });
    }

    const user = await userModel.findOne({ email });

    if (!user || !otpMatches(otp, user.resetOtp)) {
      recordFail("reset", email, req);
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired, please try again" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    clearAttempts("reset", email);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const logout = (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ success: true, message: "Logged out" });
};