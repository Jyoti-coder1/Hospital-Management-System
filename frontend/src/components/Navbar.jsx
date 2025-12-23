import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import authAxios from "../services/api";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            authAxios
                .get("/api/notifications")
                .then(res => setNotifications(res.data))
                .catch(err => console.error(err));
        }
    }, [user]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return (
        <nav style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Link to="/">Dashboard</Link>
            {user?.role === "doctor" && <Link to="/patients">Patients</Link>}
            
            {["doctor", "nurse"].includes(user?.role) && (
                <Link to="/appointments">Appointments</Link>
            )}

            {["doctor", "nurse", "patient"].includes(user?.role) && (
                <Link to="/medical-records">Medical Records</Link>
            )}
            
            {user?.role === "patient" && <Link to="/feedback">Feedback</Link>}

            {user && (
                <Link to="/notifications">
                    🔔 {unreadCount > 0 ? unreadCount : ""}
                </Link>
            )}

            {user ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;