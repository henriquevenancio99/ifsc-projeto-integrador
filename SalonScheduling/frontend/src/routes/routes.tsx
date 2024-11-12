import { lazy } from "react";
import { Navigate, Route, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/auth.service";
import { Layout } from "../components/common/layout";
import ForgetPassword from "../pages/user/forget-password.page";
import ResetPassword from "../pages/user/reset-password.page";

const Login = lazy(() => import("../pages/user/login.page"));
const Home = lazy(() => import("../pages/home.page"));
const User = lazy(() => import("../pages/user/user.page"));
const Employee = lazy(() => import("../pages/employee/employee.page"));

const ProtectedRoutes = () => {
  const location = useLocation();
  return isAuthenticated() ? (
    <Layout />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export const Routes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/forget-password" element={<ForgetPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/" element={<ProtectedRoutes />}>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/users" element={<User />} />
      <Route path="/employees" element={<Employee />} />
    </Route>
  </>
);
