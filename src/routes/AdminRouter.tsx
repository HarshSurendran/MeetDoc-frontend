import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../hocs/admins/PrivateRoute"
import PublicRoute from "../hocs/admins/PublicRoute";
import AdminLayout from "../Pages/admin/AdminLayout";
import AdminMainContent from "@/components/admin/AdminDashboard";
import UserManagementTable from "@/components/admin/UserManagement";
import UserDetailView from "@/components/admin/UserDetailView";
import DoctorVerificationPage from "@/Pages/admin/DoctorVerificationPage";
import Verification from "@/components/admin/Verification";
import AdminErrorPage from "@/Pages/admin/AdminErrorPage";
import SubscriptionManagement from "@/components/admin/SubscriptionManagement";
import AdminLogin from "@/Pages/admin/AdminLogin";

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute component={AdminLogin} />} />
      <Route element={<PrivateRoute component={AdminLayout} />} >
        <Route index path="/dashboard" element={<AdminMainContent />} /> 
        <Route path="doctors" element={<h1>Doctors</h1>} />
        <Route path="verification" element={<Verification/>} />
        <Route path="doctorDetails/:id" element={<DoctorVerificationPage/>} />
        <Route path="users" element={<UserManagementTable />} />
        <Route path="users/:id" element={<UserDetailView />} />
        <Route path="subscription" element={<SubscriptionManagement/>} />
      </Route>
      <Route path='*' element={<AdminErrorPage/>} />
    </Routes>
  );
};

export default AdminRouter;
