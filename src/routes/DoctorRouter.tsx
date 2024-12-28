import { Route, Routes } from 'react-router-dom'
import Dashboard from '../Pages/doctor/Dashboard'
import DoctorRegistration from '../components/doctor/DoctorRegistration'
import LoginPage from '../Pages/doctor/LoginPage'

const DoctorRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} /> 
      <Route path='/registration' element={<DoctorRegistration />} />
      <Route path='/login' element={<LoginPage/>}/>
    </Routes>
  )
}

export default DoctorRouter
