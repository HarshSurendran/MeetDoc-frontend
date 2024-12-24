import React from "react"
import { Outlet } from 'react-router-dom'

const UserLayout : React.FC = () => {
  return (
    <>
      <header>
        <h1>Header</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <h1>Footer</h1>
      </footer>
    </>
  )
};

export default UserLayout;
