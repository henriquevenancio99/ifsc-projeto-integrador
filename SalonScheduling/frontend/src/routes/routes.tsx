import { Navigate, Route, useLocation } from "react-router-dom";
import { Home } from "../pages/home.page";
import { Login } from "../pages/user/login.page";
import { User } from "../pages/user/user.page";
import { isAuthenticated } from "../services/auth.service";
import { Employee } from "../pages/employee/employee.page";

import { Layout } from "../components/common/layout";

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
    <Route path="/" element={<ProtectedRoutes />}>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/users" element={<User />} />
      <Route path="/employees" element={<Employee />} />
    </Route>
    <Route path="/login" element={<Login />} />
  </>
);
