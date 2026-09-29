import { useNavigate } from "react-router-dom"


const useWebNavigate = () => {

    const navigate = useNavigate();

const gotoRegister = () => navigate("/register");
const gotoLogin = () => navigate("/login");
const gotoDashboard = () => navigate("/canvas");
const gotoCanvas = (id) => navigate(`/canvas/${id}`);


const gotoVerifyOtp = (email) => navigate("/verify-otp", { state: { email, allowed: true } });
    const gotoForgotPassword = () => navigate("/forgot-password", { state: { allowed: true } });



return {
    gotoRegister,
    gotoLogin,
    gotoDashboard,
    gotoCanvas,
    gotoVerifyOtp,
    gotoForgotPassword,
}


}

export default useWebNavigate;