
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const user = useAuth();
  if (!user.isAuthenticated) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;