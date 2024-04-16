import React , { useState , useEffect , useRef} from 'react';
import { Link} from 'react-router-dom';
// import { FiMenu } from "react-icons/fi";
// import { RxCross2 } from "react-icons/rx";
import { FaQuestionCircle } from "react-icons/fa";
// import { Outlet  } from 'react-router-dom';
// import {IoMdArrowDropdown,IoMdArrowDropright} from "react-icons/io";
import { MdKeyboardArrowDown ,MdKeyboardArrowRight } from "react-icons/md";
import './App.css';
// import Sidebar from './Sidebar';

const Sidebar = ({isOpen ,toggleSidebar}) => {
    const [isKnowledgeOpen, setisKnowledgeOpen] = useState(false);
    const [isGovarOpen, setisGovarOpen] = useState(false);
    const [isMasterOpen, setisMasterOpen] = useState(false);
    const [isReportsOpen, setisReportsOpen] = useState(false);
    const [isConfigureOpen, setisConfigureOpen] = useState(false);
    const [isHelpOpen, setisHelpOpen] = useState(false);
    const [isModulesOpen, setisModuleOpen] = useState(false);
    const [isClientUser, setClientUser] = useState(false);
    const [isClientAdmin, setClientAdmin] = useState(false);
    const [isSystemAdmin, setSystemAdmin] = useState(false);

      const submenuRef = useRef(null);

      const toggleArrow = (event) => {
          event.stopPropagation(); // Stop event propagation
          setisKnowledgeOpen(prevState => !prevState);
        };

      const toggleisGovarOpen = (event) => {
        event.stopPropagation(); // Stop event propagation
        setisGovarOpen(prevState => !prevState);
      };
      const toggleisMasterOpen = (event) => {
        event.stopPropagation(); // Stop event propagation
        setisMasterOpen(prevState => !prevState);
      };
      const toggleisReportsOpen = (event) => {
        event.stopPropagation(); // Stop event propagation
        setisReportsOpen(prevState => !prevState);
      };
      const toggleisConfigureOpen = (event) => {
        event.stopPropagation(); // Stop event propagation
        setisConfigureOpen(prevState => !prevState);
      };
      const toggleishelpOpen = (event) => {
        event.stopPropagation(); // Stop event propagation
        setisHelpOpen(prevState => !prevState);
      };
      const toggleisModuleOpen = (event) => {
        event.stopPropagation(); // Stop event propagation
        setisModuleOpen(prevState => !prevState);
      };

      function handleClickOutside(event) {
        console.log('Clicked outside');
        if (submenuRef.current && !submenuRef.current.contains(event.target)) {
            setisMasterOpen(false);
        }
      }

      useEffect(() => {
        // Check if user is admin after successful login
        const isclientAdmin = sessionStorage.getItem('isClientAdmin'); // Convert string 'true' to boolean true
        const isSystemAdmin = sessionStorage.getItem('isSystemAdmin');
        if(isclientAdmin === 'true'){
          setClientAdmin(true)
        }else if(isSystemAdmin  === 'true'){
          setSystemAdmin(true);
        }else{
          setClientUser(true);
        }
      }, []); // This effect will run only once when the component mounts
    
      useEffect(() => {
        // Add event listener to handle click outside of submenu
        document.addEventListener('click', handleClickOutside);        
        return () => {
          // Remove event listener on cleanup
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return(
        <nav className={`sidenav ${isOpen ? 'open' : ''}`}>
           {isClientAdmin && (<span>
            <div className={`grclogo ${isOpen ? 'open' : ''}`}>
                <h6 style={{fontSize:'30px',color:'white',marginLeft:'20px',marginTop:'10px',height:'30px',display:'inline-flex'}}>GRC-CP</h6>
            </div>
             <ul className={`sidemenubar ${isOpen ? 'open' : ''}`}>
                <li><Link to='clientmanagement' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisGovarOpen} >{isGovarOpen ? <MdKeyboardArrowDown size={20}/> :  <MdKeyboardArrowRight size={20}/>}&nbsp;Governance</Link></li>
                <li><Link style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisMasterOpen}> {isMasterOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Masters</Link>
                    {isMasterOpen ? (
                        <div className='submenuMaster' ref={submenuRef}>
                            <Link  to='role'>Roles</Link>
                            <Link  to='user'>Users</Link>
                            <Link  to='activity'>Activities</Link>
                            <Link  to='assignment'>Assignment</Link>
                       </div>
                    ):''}
                </li>
                <li><Link to='trainingmodules' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisConfigureOpen}> {isConfigureOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Activity Management</Link></li>
                <li><Link to='trainingmodules' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisConfigureOpen}> {isConfigureOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Configuration</Link>
                {isConfigureOpen ?(
                   <div className='submenuMaster' ref={submenuRef}>
                   <Link  to='createcompliance'>Create Compliance Period</Link>
                   <Link  to='viewcompliance'>View / Edit Complaince</Link>
                   <Link  to='createassignments'>CreateAssignments</Link>
                   <Link  to='assignment'>History</Link>
              </div>
                ):''}
                </li>
                <li><Link to='helpcontent' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleishelpOpen}> {isHelpOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Help Content</Link></li>
                <li><Link to='helpcontent' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisModuleOpen}> {isModulesOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Modules</Link></li>
                <li><Link to='helpcontent' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisReportsOpen}> {isReportsOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Reports</Link></li>
            </ul></span>)}
            {isSystemAdmin && ( <span>
            <div className={`grclogo ${isOpen ? 'open' : ''}`}>
                <h6 style={{fontSize:'30px',color:'white',marginLeft:'20px',marginTop:'10px',height:'30px',display:'inline-flex'}}>GRC-MP</h6>
            </div>
            <ul className={`sidemenubar ${isOpen ? 'open' : ''}`}>
                <li><Link style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisGovarOpen} >{isGovarOpen ? <MdKeyboardArrowDown size={20}/> :  <MdKeyboardArrowRight size={20}/>}&nbsp;ClientManagement</Link>
                {isGovarOpen ? (
                        <div className='submenuMaster' ref={submenuRef}>
                            <Link  to='clientonboard'>Client Onboarding</Link>
                            <Link  to='license'>License Management</Link>
                            <Link  to='clientoffboard'>Client Offboarding</Link>
                            <Link  to='assignment'>Payments</Link>
                            <Link  to='assignment'>Reports</Link>
                       </div>
                    ):''}</li>
                <li><Link to='knowledgemanagement' style={{textDecoration:'none',display:'inline-flex'}} className='knowledgemanagement' onClick={toggleArrow} > {isKnowledgeOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Knowledge Management </Link></li>
                <li><Link to='trainingmodules' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisConfigureOpen}> {isConfigureOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Ticketing System</Link></li>
                <li><Link to='helpcontent' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleishelpOpen}> {isHelpOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Training Modules</Link></li>
                <li><Link to='helpcontent' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisModuleOpen}> {isModulesOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Help Content</Link></li>
                <li><Link to='helpcontent' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisReportsOpen}> {isReportsOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Prospects Management</Link></li>
            </ul></span>)}
            {isClientUser && (<span>
              <div className={`grclogo ${isOpen ? 'open' : ''}`}>
              <h6 style={{fontSize:'30px',color:'white',marginLeft:'20px',marginTop:'10px',height:'30px',display:'inline-flex'}}>GRC-CP</h6>
          </div>
              <ul className={`sidemenubar ${isOpen ? 'open' : ''}`}>
                <li><Link to='clientmanagement' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleisGovarOpen} >{isGovarOpen ? <MdKeyboardArrowDown size={20}/> :  <MdKeyboardArrowRight size={20}/>}&nbsp;Governance</Link></li>
                <li><Link to='assignment' style={{textDecoration:'none',display:'inline-flex'}} className='knowledgemanagement' onClick={toggleArrow} > {isKnowledgeOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Activity Management</Link></li>
                <li><Link to='helpcontent' style={{textDecoration:'none',display:'inline-flex'}} onClick={toggleishelpOpen}> {isHelpOpen ? (<MdKeyboardArrowDown size={20}/>) : (<MdKeyboardArrowRight size={20}/>)} &nbsp;Help Content</Link></li>
            </ul></span>)}
            <div className='helpbox'>
                <FaQuestionCircle size={60} className='questionmark'/>
                    <div className='gotohelp'>
                        <p style={{fontSize:'13px',fontWeight:'bold',color:'white',marginLeft:'10px',display:'inline-flex'}}>Go to Help Center</p>
                    </div>
                </div>
        </nav>
    );
};

export default Sidebar;