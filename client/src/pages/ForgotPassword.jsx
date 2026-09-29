import { useRef, useState,useEffect } from "react";
import { forgotPassword, resetPassword } from "../components/Api/authApi";
import useWebNavigate from "../components/hooks/useWebNavigate";
import { useLocation, useNavigate } from "react-router-dom";

const RESEND_COOLDOWN = 30;

const ForgotPassword = () => {
    const { gotoLogin } = useWebNavigate();

    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (!location.state?.allowed) {
            navigate("/login", { replace: true });
        }
    }, []);


    const [step, setStep] = useState("email");  
    const [email, setEmail] = useState("");

    const refEmail = useRef(null);
    const refOtp = useRef(null);
    const refPassword = useRef(null);
    const refConfirmPassword = useRef(null);

    const [fieldErrors, setFieldErrors] = useState({});
    const [notice, setNotice] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef(null);

    const startCooldown = () => {
        setCooldown(RESEND_COOLDOWN);
        cooldownRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current);
                    cooldownRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const onSendOtp = async () => {
        if (isSubmitting) return;

        setNotice("");
        const value = refEmail.current.value.trim();
        const errors = {};

        if (!value) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.email = "Enter a valid email address";
        }

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setIsSubmitting(true);
        try {
            const response = await forgotPassword({ email: value });
            if (response.data.success) {
                setEmail(value);
                setStep("reset");
                setNotice(response.data.message || "OTP sent to your email.");
                startCooldown();
            } else {
                setNotice(response.data.message || "Something went wrong");
            }
        } catch (error) {
            setNotice(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onResend = async () => {
        if (isResending || cooldown > 0) return;

        setNotice("");
        setIsResending(true);
        try {
            const response = await forgotPassword({ email });
            setNotice(response.data.message || "OTP resent successfully");
            startCooldown();
        } catch (error) {
            setNotice(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsResending(false);
        }
    };

    const onReset = async () => {
        if (isSubmitting) return;

        setNotice("");
        const otp = refOtp.current.value.trim();
        const newPassword = refPassword.current.value;
        const confirmPassword = refConfirmPassword.current.value;
        const errors = {};

        if (!otp) {
            errors.otp = "OTP is required";
        } else if (!/^\d{6}$/.test(otp)) {
            errors.otp = "Enter a valid 6-digit OTP";
        }

        if (!newPassword) {
            errors.password = "New password is required";
        } else if (newPassword.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        if (!confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (newPassword && confirmPassword !== newPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setIsSubmitting(true);
        try {
            const response = await resetPassword({ email, otp, newPassword });
            if (response.data.success) {
                setNotice("Password reset! Redirecting to login...");
                setTimeout(() => gotoLogin(), 1200);
                return;
            } else {
                setNotice(response.data.message || "Something went wrong");
            }
        } catch (error) {
            setNotice(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 font-['Trebuchet_MS','Helvetica_Neue',sans-serif] text-fg">

            {notice && (
                <div
                    className="
            fixed top-4 left-1/2 -translate-x-1/2 z-200
            bg-[#1f1f1f] text-white text-sm
            px-4 py-2.5 rounded-lg shadow-lg
          "
                >
                    {notice}
                </div>
            )}

            <div className="bg-card border-2 border-fg rounded-[20px] shadow-[6px_6px_0_#1a1a1a] p-8 w-full max-w-105">

                {/* naya: key={step} — jab step "email" se "reset" me badle to React purane
                    input DOM elements reuse na kare, fresh subtree banaye. Isse browser
                    autofill wali email OTP box me carry hone ka bug fix hota hai. */}
                <div key={step}>
                {step === "email" ? (
                    <>
                        <h1 className="font-['Georgia','Times_New_Roman',serif] text-2xl font-bold mb-2 text-center">
                            Forgot password?
                        </h1>
                        <p className="text-sm text-muted text-center mb-6">
                            Enter your email — we'll send you a reset OTP
                        </p>

                        <input
                            ref={refEmail}
                            type="email"
                            name="email"
                            autoComplete="email"
                            disabled={isSubmitting}
                            placeholder="you@example.com"
                            className={`w-full px-3.5 py-2.75 border-[1.5px] rounded-[10px] bg-white text-[15px] outline-none focus:border-fg disabled:opacity-60 mb-1 ${fieldErrors.email ? "border-[#c0392b]" : "border-line"}`}
                        />
                        {fieldErrors.email && (
                            <p className="text-xs text-[#c0392b] mb-3">{fieldErrors.email}</p>
                        )}

                        <button
                            onClick={onSendOtp}
                            disabled={isSubmitting}
                            className="w-full bg-fg text-white py-3.25 rounded-[10px] font-semibold mt-3 transition-[background] hover:bg-[#2d2d2d] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                    Sending OTP...
                                </>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="font-['Georgia','Times_New_Roman',serif] text-2xl font-bold mb-2 text-center">
                            Reset password
                        </h1>
                        <p className="text-sm text-muted text-center mb-6">
                            OTP sent to <b>{email}</b>
                        </p>

                        <input
                            ref={refOtp}
                            type="text"
                            name="otp"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            disabled={isSubmitting}
                            placeholder="Enter 6-digit OTP"
                            className={`w-full text-center tracking-[6px] text-lg px-3.5 py-2.75 border-[1.5px] rounded-[10px] bg-white outline-none focus:border-fg disabled:opacity-60 mb-1 ${fieldErrors.otp ? "border-[#c0392b]" : "border-line"}`}
                        />
                        {fieldErrors.otp && (
                            <p className="text-xs text-[#c0392b] text-center mb-3">{fieldErrors.otp}</p>
                        )}

                        <input
                            ref={refPassword}
                            type="password"
                            name="new-password"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            placeholder="New password"
                            className={`w-full px-3.5 py-2.75 border-[1.5px] rounded-[10px] bg-white text-[15px] outline-none focus:border-fg disabled:opacity-60 mb-1 mt-3 ${fieldErrors.password ? "border-[#c0392b]" : "border-line"}`}
                        />
                        {fieldErrors.password && (
                            <p className="text-xs text-[#c0392b] mb-3">{fieldErrors.password}</p>
                        )}

                        <input
                            ref={refConfirmPassword}
                            type="password"
                            name="confirm-password"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            placeholder="Confirm new password"
                            className={`w-full px-3.5 py-2.75 border-[1.5px] rounded-[10px] bg-white text-[15px] outline-none focus:border-fg disabled:opacity-60 mb-1 mt-3 ${fieldErrors.confirmPassword ? "border-[#c0392b]" : "border-line"}`}
                        />
                        {fieldErrors.confirmPassword && (
                            <p className="text-xs text-[#c0392b] mb-3">{fieldErrors.confirmPassword}</p>
                        )}

                        <button
                            onClick={onReset}
                            disabled={isSubmitting}
                            className="w-full bg-fg text-white py-3.25 rounded-[10px] font-semibold mt-4 mb-3 transition-[background] hover:bg-[#2d2d2d] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                    Resetting...
                                </>
                            ) : (
                                "Reset password"
                            )}
                        </button>

                        <button
                            onClick={onResend}
                            disabled={isResending || cooldown > 0}
                            className="w-full text-sm text-accent font-semibold py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {isResending
                                ? "Resending..."
                                : cooldown > 0
                                    ? `Resend OTP in ${cooldown}s`
                                    : "Resend OTP"}
                        </button>
                    </>
                )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;