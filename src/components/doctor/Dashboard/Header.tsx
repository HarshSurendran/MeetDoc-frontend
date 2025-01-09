import { Menu } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center">
          <div className="flex items-center justify-between w-full px-4">
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, Dr {doctor.name}
              </span>
              <img
                src="pic from database"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>
        </header>
  )
}

export default Header
