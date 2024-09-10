import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminRouter from "./routes/AdminRouter";
import DoctorRouter from "./routes/DoctorRouter";
import UserRouter from "./routes/UserRouter";
import Navbar from "./components/users/Navbar";
import DashboardLayoutBranding from "./Pages/adminPage";
import UserHeader from "./components/users/UserHeader";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <>
      {/* <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/doctor/*" element={<DoctorRouter />} />
        <Route path="/*" element={<UserRouter />} />
      </Routes> */}
      <HomePage/>
    </>
  );
}

export default App;
