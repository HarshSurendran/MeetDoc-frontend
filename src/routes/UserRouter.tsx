import React from 'react'
import { Route, Routes } from 'react-router-dom';
import PublicRoute from '../hocs/users/PublicRoute';
import LoginPage from '../Pages/LoginPage';
import HomePage from '../Pages/HomePage';
import PrivateRoute from '../hocs/users/PrivateRoute';
import Dashboard from '../Pages/user/Dashboard';


const UserRouter = () => {
  return (
      <Routes>
      <Route path='/' element={<HomePage/>}  />
          <Route path='/login' element={<PublicRoute component={LoginPage} />} />
          <Route path='/dashboard' element={<PrivateRoute component={ Dashboard } />} />
    </Routes>
  )
}

export default UserRouter
