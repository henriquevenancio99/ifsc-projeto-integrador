import { Navigate, Outlet, Route } from "react-router-dom";
import { Home } from "../pages/home.page";
import { useAuth } from "../providers/auth";
import { Login } from "../pages/user/login.page";
import { User } from "../pages/user/user.page";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
 console.log("protectedroutes")
  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
};

export const Routes = (
  <>
    <Route path="/" element={<ProtectedRoutes />}>
      <Route path="/home" element={<Home />} />
      <Route path="/user" element={<User />} />
    </Route>
    <Route path="/login" element={<Login />} />
  </>
);
