import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Terms = () => {

    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (!location.state?.fromRegister) {
            navigate("/register", { replace: true });
        }
    }, []);


    return (
        <div className="min-h-screen bg-bg flex flex-col font-['Trebuchet_MS','Helvetica_Neue',sans-serif] text-fg">
            <title>Terms of Service – Tanix Draw</title>
            <meta name="description" content="Read the terms of service for using Tanix Draw." />
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
                        Terms of Service
                    </h1>
                    <p className="text-sm text-muted mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                    <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-[#2a2a2a]">
                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">1. Accepting these terms</h2>
                            <p>By creating an account or using Tanix Draw, you agree to these Terms of Service. If you do not agree, please do not use the app.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">2. Your account</h2>
                            <p>You are responsible for keeping your login credentials secure and for all activity under your account. You must provide a valid email address to verify your account via OTP.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">3. Acceptable use</h2>
                            <p>You agree not to misuse the service — this includes uploading unlawful content, attempting to disrupt other users' boards, or abusing the collaboration/sharing features.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">4. Your content</h2>
                            <p>You retain ownership of the drawings and boards you create. By collaborating on a shared room, you allow other invited members to view and edit that content.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">5. Termination</h2>
                            <p>We may suspend or terminate accounts that violate these terms. You may delete your account and boards at any time.</p>
                        </section>

                        <section>
                            <h2 className="font-semibold text-lg mb-1.5">6. Changes</h2>
                            <p>We may update these terms occasionally. Continued use of Tanix Draw after changes means you accept the updated terms.</p>
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

export default Terms;