import React from 'react';
import '../App.css';
import { ImHome } from "react-icons/im";
import { BsFillBellFill } from "react-icons/bs";
import { IoWarning } from "react-icons/io5";
import { IoMdLogOut ,IoMdSettings} from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Topbar({toggleSidebar,isOpen }) {
  const navigate = useNavigate();
  const LogoutHandle =()=>{
    setTimeout(() => {
      sessionStorage.clear();
      navigate('/login');
    }, 2000);    
  }
  return (
    <div className={`topnav  ${isOpen ? 'open' : ''}`}> 
     <div className={`toggle-button ${isOpen ? 'open' : ''}`}  onClick={toggleSidebar}>{isOpen ? <FiMenu size={25}/> : <FiMenu size={25}/>  }</div>
        <div className={`topnavicons  ${isOpen ? 'open' : ''}`}>
            <ImHome style={{marginLeft:'30px'}} size={30}/>
            <BsFillBellFill style={{marginLeft:'30px'}} size={30}/>
            <IoWarning style={{marginLeft:'30px'}} size={30} />
            <IoMdLogOut onClick={LogoutHandle} style={{marginLeft:'30px',cursor:'pointer'}} size={30}/>
            <IoMdSettings style={{marginLeft:'30px'}} size={30}/>
            <div className='namebox'>
                <label style={{color:'white',fontWeight:'bold',marginTop:'10px',display:'flex',justifyContent:'center',alignItems:''}}>{sessionStorage.getItem('name')}</label>
            </div>
        </div>
    </div>
  );
};

export default Topbar;