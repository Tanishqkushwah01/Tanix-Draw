import express from "express";
const router = express.Router();

import * as userController from "../controllers/user.controller.js";
import rateLimit from "../middleware/ratelimit.middleware.js";

const MIN = 60 * 1000;

const registerLimiter = rateLimit({ windowMs: 60 * MIN, max: 10 });
const loginLimiter = rateLimit({ windowMs: 15 * MIN, max: 10 });
const otpLimiter = rateLimit({ windowMs: 15 * MIN, max: 10 });
const sendOtpLimiter = rateLimit({ windowMs: 15 * MIN, max: 5 });

router.post("/register", registerLimiter, userController.register);
router.post("/login", loginLimiter, userController.login);
router.post("/verify-otp", otpLimiter, userController.verifyOtp);
router.post("/resend-otp", sendOtpLimiter, userController.resendOtp);
router.post("/forgot-password", sendOtpLimiter, userController.forgotPassword);
router.post("/reset-password", otpLimiter, userController.resetPassword);
router.post("/logout", userController.logout);

export default router;