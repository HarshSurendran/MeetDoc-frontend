import { RootState } from '@/redux/store/appStore';
import { Bell, Menu, Search, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Header = () => {
    const admin = useSelector((state: RootState) => state.admin.admin);
    const [letter, setLetter] = useState("");

    useEffect(() => {
        const name = admin.name.split(" ");
        setLetter(name.map((word) => word[0]).join())
        console.log(letter);
    })

  return (
    <header className="bg-white border-b">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-3">
        <button className="p-2 lg:hidden">
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">MeetDoc Admin</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none ml-2 w-64"
          />
        </div>
        <button className="relative p-2">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">{letter}</span>
          </div>
            <span className="hidden md:inline font-medium">{ admin.name }</span>
        </div>
      </div>
    </div>
  </header>
  )
}

export default Header
