import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../components/Api/authApi";
import useWebNavigate from "../components/hooks/useWebNavigate";

const RESEND_COOLDOWN = 30; 

const VerifyOtp = () => {
    const location = useLocation();
    const email = location.state?.email || "";
    const refOtp = useRef(null);
    const { gotoLogin } = useWebNavigate();

    const [fieldError, setFieldError] = useState("");

    const [notice, setNotice] = useState("");

    const [isVerifying, setIsVerifying] = useState(false);

    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef(null);


     
 
    const navigate = useNavigate();
    useEffect(() => {
        if (!location.state?.allowed || !email) {
            navigate("/register", { replace: true });
        }
    }, []);

    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

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

    const onVerify = async () => {
        if (isVerifying) return;

        setNotice("");
        setFieldError("");

        const otp = refOtp.current.value.trim();

        if (!otp) {
            setFieldError("OTP is required");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setFieldError("Enter a valid 6-digit OTP");
            return;
        }

        setIsVerifying(true);

        try {
            const response = await verifyOtp({ email, otp });

            if (response.data.success) {
                setNotice("Verified! Redirecting to login...");
                setTimeout(() => gotoLogin(), 1200);
                return; 
            } else {
                setNotice(response.data.message || "Something went wrong");
            }
        } catch (error) {
            setNotice(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsVerifying(false);
        }
    };

    const onResend = async () => {
        if (isResending || cooldown > 0) return;

        setNotice("");
        setIsResending(true);

        try {
            const response = await resendOtp({ email });
            setNotice(response.data.message || "OTP resent successfully");
            startCooldown();
        } catch (error) {
            setNotice(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsResending(false);
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
                <h1 className="font-['Georgia','Times_New_Roman',serif] text-2xl font-bold mb-2 text-center">
                    Verify your email
                </h1>
                <p className="text-sm text-muted text-center mb-6">
                    OTP sent to <b>{email}</b>
                </p>

                <input
                    ref={refOtp}
                    type="text"
                    maxLength={6}
                    disabled={isVerifying}
                    placeholder="Enter 6-digit OTP"
                    className={`w-full text-center tracking-[6px] text-lg px-3.5 py-2.75 border-[1.5px] rounded-[10px] bg-white outline-none focus:border-fg disabled:opacity-60 ${fieldError ? "border-[#c0392b]" : "border-line"}`}
                />

                {fieldError && (
                    <p className="text-xs text-[#c0392b] text-center mt-1.5">{fieldError}</p>
                )}

                <button
                    onClick={onVerify}
                    disabled={isVerifying}
                    className="w-full bg-fg cursor-pointer text-white py-3.25 rounded-[10px] font-semibold mt-4 mb-3 transition-[background,transform] hover:bg-[#2d2d2d] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isVerifying ? (
                        <>
                            <span className="w-4 h-4 border-2 cursor-not-allowed border-white/40 border-t-white rounded-full animate-spin"></span>
                            Verifying...
                        </>
                    ) : (
                        "Verify"
                    )}
                </button>

                <button
                    onClick={onResend}
                    disabled={isResending || cooldown > 0}
                    className="w-full text-sm text-accent cursor-pointer font-semibold py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                    {isResending
                        ? "Resending..."
                        : cooldown > 0
                            ? `Resend OTP in ${cooldown}s`
                            : "Resend OTP"}
                </button>
            </div>
        </div>
    );
};

export default VerifyOtp;