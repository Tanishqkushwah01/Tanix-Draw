import { useRef, useState } from "react";
import { login } from "../components/Api/authApi";
import useWebNavigate from "../components/hooks/useWebNavigate";


const Login = () => {

    const refEmail = useRef(null);
    const refPassword = useRef(null);

    const {gotoDashboard, gotoForgotPassword, gotoVerifyOtp} = useWebNavigate();

    const [fieldErrors, setFieldErrors] = useState({});

    const [notice, setNotice] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const errors = {};
        const email = refEmail.current.value.trim();
        const password = refPassword.current.value;

        if (!email) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Enter a valid email address";
        }

        if (!password) {
            errors.password = "Password is required";
        }

        return errors;
    };

    const onSubmit = async () => {
        if (isSubmitting) return;

        setNotice("");

        const errors = validate();
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const userDetails = {
            email: refEmail.current.value.trim(),
            password: refPassword.current.value,
        };

        setIsSubmitting(true);

        try {
            const response = await login(userDetails);

            if (response.data.success) {
                localStorage.setItem("userInfo", JSON.stringify(response.data.user));
                localStorage.removeItem("token");  
                gotoDashboard();
                return;  
            } else {
                setNotice(response.data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            if (error.response?.data?.notVerified) {
                gotoVerifyOtp(userDetails.email);
                return;
            }

            setNotice(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex flex-col font-['Trebuchet_MS','Helvetica_Neue',sans-serif] text-fg">
            <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(-2deg); } }
        @keyframes floatCanvas { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

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

            <nav className="flex items-center justify-between px-6 md:px-12 h-16 border-b border-line bg-bg sticky top-0 z-100">
                <a href="/" className="flex items-center gap-2.5">
                    <span className="w-8.5 h-8.5 bg-accent text-white rounded-[10px] flex items-center justify-center font-bold text-base shrink-0">
                        T
                    </span>
                    <span className="text-lg font-semibold tracking-[-0.3px]">Tanix Draw</span>
                </a>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-12 relative overflow-hidden">

                <div
                    className="hidden md:block absolute opacity-55 pointer-events-none w-45"
                    style={{ top: "8%", left: "4%", animation: "floatCanvas 5s ease-in-out infinite" }}
                >
                    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="10" width="50" height="32" rx="4" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                        <path d="M60 26 Q80 16 92 26" fill="none" stroke="#e8735a" strokeWidth="2" markerEnd="url(#d1a)" />
                        <ellipse cx="108" cy="26" rx="28" ry="18" fill="white" stroke="#1a1a1a" strokeWidth="2" />
                        <defs>
                            <marker id="d1a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <path d="M0,0 L0,6 L6,3 z" fill="#e8735a" />
                            </marker>
                        </defs>
                    </svg>
                </div>

                <div
                    className="hidden md:block absolute opacity-55 pointer-events-none w-25"
                    style={{ bottom: "10%", right: "5%", animation: "floatCanvas 6s ease-in-out infinite 1s" }}
                >
                    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="40,8 72,60 8,60" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="4 3" />
                    </svg>
                </div>

                <div
                    className="hidden md:block absolute opacity-55 pointer-events-none"
                    style={{ top: "18%", right: "8%", animation: "float 4s ease-in-out infinite 0.5s" }}
                >
                    <div className="bg-[#f5d76b] border-[1.5px] border-[#d4b84a] rounded text-3.25 font-['Georgia',serif] italic px-3.5 py-2.5 shadow-[2px_2px_0_rgba(0,0,0,0.1)] rotate-3 whitespace-nowrap">
                        just one click ✦
                    </div>
                </div>

                <div
                    className="hidden md:block absolute opacity-55 pointer-events-none w-15"
                    style={{ bottom: "20%", left: "6%", animation: "floatCanvas 5.5s ease-in-out infinite 2s" }}
                >
                    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="24" fill="none" stroke="#e8735a" strokeWidth="2" strokeDasharray="5 3" />
                    </svg>
                </div>

                <div
                    className="bg-card border-2 border-fg rounded-[20px] shadow-[6px_6px_0_#1a1a1a] p-6 sm:p-8 md:p-10 w-full max-w-105 relative z-1"
                    style={{ animation: "fadeUp 0.6s ease both" }}
                >
                    <div className="text-center mb-7">
                        <div className="w-12 h-12 bg-accent text-white rounded-[14px] flex items-center justify-center font-bold text-[22px] mx-auto mb-4 shadow-[3px_3px_0_#c05a44]">
                            T
                        </div>
                        <h1 className="font-['Georgia','Times_New_Roman',serif] text-2xl sm:text-[28px] font-bold tracking-[-0.5px] mb-1.5">
                            Welcome back
                        </h1>
                        <p className="text-[15px] text-muted">Sign in to your Tanix Draw account</p>
                    </div>

                    <div className="flex flex-col gap-4.5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold tracking-[0.01em]" htmlFor="email">
                                Email
                            </label>
                            <input
                                ref={refEmail}
                                id="email"
                                type="email"
                                disabled={isSubmitting}
                                className={`px-3.5 py-2.75 border-[1.5px] rounded-[10px] bg-white text-[15px] text-fg outline-none transition-[border-color,box-shadow] placeholder:text-[#b0a898] focus:border-fg focus:shadow-[2px_2px_0_#1a1a1a] disabled:opacity-60 ${fieldErrors.email ? "border-[#c0392b]" : "border-line"}`}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                            {fieldErrors.email && (
                                <span className="text-xs text-[#c0392b] mt-0.5">{fieldErrors.email}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold tracking-[0.01em]" htmlFor="password">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={gotoForgotPassword}
                                    className="text-3.25 text-accent hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer p-0"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                ref={refPassword}
                                id="password"
                                type="password"
                                disabled={isSubmitting}
                                className={`px-3.5 py-2.75 border-[1.5px] rounded-[10px] bg-white text-[15px] text-fg outline-none transition-[border-color,box-shadow] placeholder:text-[#b0a898] focus:border-fg focus:shadow-[2px_2px_0_#1a1a1a] disabled:opacity-60 ${fieldErrors.password ? "border-[#c0392b]" : "border-line"}`}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            {fieldErrors.password && (
                                <span className="text-xs text-[#c0392b] mt-0.5">{fieldErrors.password}</span>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={isSubmitting}
                            className="mt-1 bg-fg cursor-pointer text-white py-3.25 rounded-[10px] text-base font-semibold tracking-[0.01em] transition-[background,transform] hover:bg-[#2d2d2d] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                    Signing in...
                                </>
                            ) : (
                                "Sign in →"
                            )}
                        </button>
                    </div>

                    <div className="mt-6 pt-5 border-t border-line flex items-center justify-center gap-2 text-sm text-muted">
                        <span>Don&apos;t have an account?</span>
                        <a href="/register" className="text-accent font-semibold hover:opacity-75 transition-opacity">
                            Create one — it&apos;s free
                        </a>
                    </div>
                </div>

                <p className="mt-7 text-3.25 text-muted italic font-['Georgia',serif] relative z-1">
                    Built solo, shipped in public ✦
                </p>
            </div>
        </div>
    );
}

export default Login;