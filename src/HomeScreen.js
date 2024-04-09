import React , { useState , useEffect } from 'react';
// import { Link} from 'react-router-dom';
// import { FiMenu } from "react-icons/fi";
// import { RxCross2 } from "react-icons/rx";
// import { FaQuestionCircle } from "react-icons/fa";
// import { useRef } from "react-icons/fa";
// import {Routes, Route ,Outlet } from 'react-router-dom';
import {Outlet } from 'react-router-dom';
// import {   } from 'react-router-dom';
// import { ImHome } from "react-icons/im";
// import { BsFillBellFill } from "react-icons/bs";
// import { IoWarning } from "react-icons/io5";
// import { IoMdLogOut ,IoMdSettings,IoMdArrowDropdown,IoMdArrowDropright} from "react-icons/io";
import './App.css';
// import KnowledgeManagement from './NavBarScreens/KnowledgeManagement';
import Sidebar from './Sidebar';
import Topbar from './Components/Topbar';
//import Clientmanagement from './NavBarScreens/ClientManagement';
// import HelpContent from './NavBarScreens/HelpContent';
// import TicketingSystem from './NavBarScreens/TicketingSystem';
// import TrainingModules from './NavBarScreens/TrainingModules';

const HomeScreen = ({onParameterChange}) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
      };

      useEffect(() => {
        onParameterChange(isOpen);
      }, [isOpen,onParameterChange]);

  return (
    <div>
        <Topbar toggleSidebar={toggleSidebar} isOpen={isOpen}/>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
        <div className='content'>
            {/* <Routes>
              <Route path="/" element={<Outlet/>}>
                <Route path="clientmanagement" element={<Clientmanagement isOpen={isOpen}/>}/>
                <Route path="knowledgemanagement" element={<KnowledgeManagement isOpen={isOpen}/>}/>
                <Route path="helpcontent" element={<HelpContent/>}/>
                <Route path="ticketingsystem" element={<TicketingSystem/>}/>
                <Route path="trainingmodules" element={<TrainingModules/>}/>
              </Route>
            </Routes>  */}
        </div>
        <Outlet/>
    </div>
  );
};

export default HomeScreen;
