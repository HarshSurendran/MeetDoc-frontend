import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DoctorHomePage from '../components/DoctorHomePage'
import LoginPage from '../Pages/LoginPage'

const AdminRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<h1>Hello world!!</h1>} />
    </Routes>
  )
}

export default AdminRouter
