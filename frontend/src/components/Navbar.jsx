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

    return (
        <nav style={{ display: "flex", gap: "15px" }}>
            <Link to="/">Dashboard</Link>
            {user?.role === "doctor" && <Link to="/patients">Patients</Link>}
            <Link to="/appointments">Appointments</Link>
            <Link to="/medical-records">Medical Records</Link>
            <Link to="/feedback">Feedback</Link>

            {user && (
                <Link to="/notifications">
                    🔔 {notifications.filter(n => !n.isRead).length}
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