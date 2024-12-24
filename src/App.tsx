import { BrowserRouter, Outlet, Route, RouterProvider, Routes } from "react-router-dom";
import "./App.css";
import AdminRouter from "./routes/AdminRouter";
import DoctorRouter from "./routes/DoctorRouter";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import { Suspense } from "react";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
   
  );
};

// export const appRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <Suspense fallback={<div>Loading...</div>}>
//         <HomePage/>
//       </Suspense>
//     ),   
//   },
//   {
//     path: "/login",
//     element: (
//       <Suspense fallback={<div>Loading...</div>}>
//         <LoginPage />
//       </Suspense>
//     )
//   },
//   userRoutes,
//   {
//     path: "*", // Fallback for unmatched routes
//     element: <h1>404 - Page Not Found</h1>,
//   },

// ]);


export default App;
