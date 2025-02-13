import LoadingAnimation from '@/Pages/LoadingAnimation';
import  { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';


const UserRoutes = lazy(() => import('./UserRouter'));
const AdminRoutes = lazy(() => import('./AdminRouter'));
const DoctorRoutes = lazy(() => import('./DoctorRouter'));


const AppRouter = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/doctor/*" element={<DoctorRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
