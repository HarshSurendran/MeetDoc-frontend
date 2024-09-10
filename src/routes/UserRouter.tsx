import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage";

const UserRouter = () => {
  return (
    // <Routes>
    //   <Route path="/" element={<HomePage />} />
    //   </Routes>
    <>
          <HomePage />
          </>
  );
};

export default UserRouter;
