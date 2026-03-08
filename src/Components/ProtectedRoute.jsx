import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const location = useLocation();

  // 1. If no user or token, send to login
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If it's an admin-only route but user isn't an admin
  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // 3. Otherwise, show the protected content
  return children;
};

export default ProtectedRoute;