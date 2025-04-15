import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import AccessDenied from "../pages/AccesDenied";

interface ProtectedRouteProps {
  allowedRole: "admin" | "user";
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
