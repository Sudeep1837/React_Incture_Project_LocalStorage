import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleGuard({ roles = [] }) {
  const role = useSelector((state) => state.auth.user?.role);
  if (!roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
