import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    // Plain axios for login (no token yet)
    const login = async (email, password) => {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            { email, password }
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    // Authenticated axios instance for protected routes
    const authAxios = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    });

    authAxios.interceptors.request.use((config) => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.token) {
            config.headers.Authorization = `Bearer ${storedUser.token}`;
        }
        return config;
    });

    return (
        <AuthContext.Provider value={{ user, login, logout, authAxios }}>
            {children}
        </AuthContext.Provider>
    );
};