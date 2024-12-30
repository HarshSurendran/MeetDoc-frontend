import { Route, Routes } from "react-router-dom";
import AdminLoginPage from "../Pages/admin/AdminLoginPage";
import PrivateRoute from "../hocs/admins/PrivateRoute"
import PublicRoute from "../hocs/admins/PublicRoute";
import AdminLayout from "../Pages/admin/AdminLayout";
import AdminMainContent from "@/components/admin/AdminMainContent";
import UserManagementTable from "@/components/admin/UserManagement";
import UserDetailView from "@/components/admin/UserDetailView";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute component={AdminLoginPage} />} />
      <Route path="/" element={<PrivateRoute component={AdminLayout} />} >
          <Route index path="dashboard" element={<AdminMainContent />} /> 
          <Route path="doctors" element={<h1>Doctors</h1>} />
        <Route path="users" element={<UserManagementTable />} />
        <Route path="users/:id" element={<UserDetailView />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
