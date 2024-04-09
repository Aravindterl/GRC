import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Sidebar.css'; // Import CSS file containing styles
import KnowledgeManagement from './NavBarScreens/KnowledgeManagement';

function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);

  const openNav = () => {
    setIsOpen(true);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div id="mySidebar" className={`sidebar ${isOpen ? 'open' : ''}`}>
        <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
        <a href="#">About</a>
        <Link to="knowledgemanagement">Services</Link>
        <a href="#">Clients</a>
        <a href="#">Contact</a>
      </div>
      <div id="main" style={{ marginLeft: isOpen ? '250px' : '0' }}>
        <button className="openbtn" onClick={openNav}>&#9776; Open Sidebar</button>
        <h2>Collapsed Sidebar</h2>
        <p>Click on the hamburger menu/bar icon to open the sidebar, and push this content to the right.</p>
        <KnowledgeManagement/>
      </div>
      <Outlet/>
    </div>
  );
}

export default LandingPage;
