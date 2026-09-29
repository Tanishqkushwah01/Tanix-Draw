import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, 
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.replace("/login");
        }
        return Promise.reject(error);
    }
);



export const createRoom = async (data) => {
    return await api.post("/canvas", data);
};



export const getMyCanvases = async () => {
  return await api.get("/canvas");
};


export const getCanvasById = async (id) => {
  return await api.get(`/canvas/${id}`);
};


export const requestJoinRoom = ({ roomId, joinCode }) => {
  return api.post("/canvas/request-join", {
    roomId,
    joinCode,
  });
};


export const getJoinRequestStatus = async (requestId) => {
  return await api.get(`/canvas/join-request/${requestId}`);
};


export const updateCanvasSettings = async (id, data) => {
  return await api.put(`/canvas/${id}`, data);
};


export const deleteCanvas = async (id) => {
  return await api.delete(`/canvas/${id}`);
};