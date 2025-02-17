import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

const HeaderPreLogin = () => {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login');
    }
    const handleSignup = () => {
        navigate('/signup');
    }
    
  return (
    <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl text-blue-600">MeetDoc</div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Services</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleLogin}>Login</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSignup}>Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default HeaderPreLogin
