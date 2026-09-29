import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {

    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (!location.state?.fromRegister) {
            navigate("/register", { replace: true });
        }
    }, []);

    
    return (
        <div className="min-h-screen bg-bg flex flex-col font-['Trebuchet_MS','Helvetica_Neue',sans-serif] text-fg">
            <nav className="flex items-center justify-between px-6 md:px-12 h-16 border-b border-line bg-bg sticky top-0 z-100">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="w-8.5 h-8.5 bg-accent text-white rounded-[10px] flex items-center justify-center font-bold text-base shrink-0">
                        T
                    </span>
                    <span className="text-lg font-semibold tracking-[-0.3px]">Tanix Draw</span>
                </Link>
            </nav>

            <div className="flex-1 flex justify-center px-4 sm:px-6 py-12">
                <div className="bg-card border-2 border-fg rounded-[20px] shadow-[6px_6px_0_#1a1a1a] p-6 sm:p-10 w-full max-w-170">
                    <h1 className="font-['Georgia','Times_New_Roman',serif] text-3xl font-bold mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-[#2a2a2a]">
                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">1. Information we collect</h2>
                            <p>When you register, we collect your name, email address, and a securely hashed password. We do not store your password in plain text.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">2. Email verification</h2>
                            <p>We send a one-time OTP to your email to verify it belongs to you. This OTP expires after 10 minutes and is never shared with third parties.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">3. How we use your data</h2>
                            <p>Your account data is used to let you log in, create/join drawing rooms, and collaborate with others. We do not sell your personal data to advertisers.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">4. Your boards and drawings</h2>
                            <p>Boards you create are private to you unless you invite others via Room ID and Join Code. Shared boards are visible to everyone you invite.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">5. Data retention</h2>
                            <p>We retain your account data as long as your account is active. You can request deletion of your account and boards at any time.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">6. Contact</h2>
                            <p>For any privacy-related questions, reach out to us at the support email listed on our landing page.</p>
                        </section>
                    </div>

                    <Link
                        to="/register"
                        className="inline-block mt-10 text-accent font-semibold hover:opacity-75 transition-opacity"
                    >
                        ← Back to sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;