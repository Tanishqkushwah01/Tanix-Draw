import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true 
})


export const register = async (data) => {
    return await api.post("/auth/register", data);
}

export const login = async (data) => {
   return await api.post("/auth/login", data);

}



export const verifyOtp = async (data) => {
    return await api.post("/auth/verify-otp", data);
}

export const resendOtp = async (data) => {
    return await api.post("/auth/resend-otp", data);
}


export const forgotPassword = async (data) => {
    return await api.post("/auth/forgot-password", data);
}

export const resetPassword = async (data) => {
    return await api.post("/auth/reset-password", data);
}

export const logout = async () => {
    return await api.post("/auth/logout");
 }