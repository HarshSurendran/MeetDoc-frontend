import { Route, Routes } from "react-router-dom";
import AdminPage from "../Pages/admin/AdminPage";
import AdminLoginPage from "../Pages/admin/AdminLoginPage";
import PrivateRoute from "../hocs/admins/PrivateRoute"
import PublicRoute from "../hocs/admins/PublicRoute";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute component={AdminLoginPage} />} />
      <Route path="/" element={<PrivateRoute component={AdminPage} />} />
    </Routes>
  );
};

export default AdminRouter;
