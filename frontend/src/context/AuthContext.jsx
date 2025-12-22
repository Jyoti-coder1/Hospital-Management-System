import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (email, password) => {
        const res = await authAxios.post("/api/auth/login", { email, password });
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const authAxios = axios.create();
    authAxios.interceptors.request.use((config) => {
        if (user) config.headers.Authorization = `Bearer ${user.token}`;
        return config;
    });

    return (
        <AuthContext.Provider value={{ user, login, logout, authAxios }}>
            {children}
        </AuthContext.Provider>
    );
};