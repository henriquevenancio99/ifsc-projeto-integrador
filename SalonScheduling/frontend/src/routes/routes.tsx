import { Navigate, Outlet, Route } from "react-router-dom";
import { Home } from "../pages/home.page";
import { Login } from "../pages/user/login.page";
import { User } from "../pages/user/user.page";
import { isAuthenticated } from "../services/auth.service";

const ProtectedRoutes = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to={"/login"} />;
};

export const Routes = (
  <>
    <Route path="/" element={<ProtectedRoutes />}>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/users" element={<User />} />
    </Route>
    <Route path="/login" element={<Login />} />
  </>
);
