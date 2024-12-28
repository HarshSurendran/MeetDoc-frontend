import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'


const UserRoutes = lazy(() => import("./UserRouter"));
const AdminRoutes = lazy(() => import("./AdminRouter"));
const DoctorRoutes = lazy(() => import("./DoctorRouter"));

const AppRouter = () => {
    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Routes>
                <Route path='/admin/*' element={<AdminRoutes />} />
                <Route path='/doctor/*' element={<DoctorRoutes />} />
                <Route path="/*" element={<UserRoutes />} />
            </Routes>
        </Suspense>
    )
};

export default AppRouter
