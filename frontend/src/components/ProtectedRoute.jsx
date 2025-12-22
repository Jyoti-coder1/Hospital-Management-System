import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children, role }) => {
    if (!user) return <Navigate to="/login" />;

    if (role && user.role !== role && user.role !== "admin") {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;