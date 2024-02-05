import React, { useState } from 'react';
// import "../ComponentCSS/SideNav.css";
import './SideNav.css';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='sdnfjk'>
      {/* <button>Toggle Sidebar</button> */}
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </div>
  );
};

export default Sidebar;
