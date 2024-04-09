import React, { useEffect , useState  } from 'react';
// import "../ComponentCSS/SideNav.css";
import {useLocation , useNavigate , useParams } from 'react-router-dom';
import './SideNav.css';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [uidExist, setUidExist] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const parameter = params.get('UID');
  const navigate = useNavigate();
  // const { parameters } = useParams();
  // const [UID, setUID] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:5145/api/isExistUID?uid=${parameter}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const val = data.isUiDExist;
        setUidExist(`${val}`);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    }

    fetchData();

    if (uidExist === 'false') {
      const storedData = sessionStorage.getItem('Token');
      // if (parameter !== UID) {
      //   navigate('/sidenav');
      // }
      navigate('/sidenav');
    }
    // else if(uidExist !== 'true'){

    // }
  }, [parameter, navigate, uidExist]);

  return (
    <div className='sdnfjk'>
      {/* <button>Toggle Sidebar</button> */}
      <h2>Parameter Value: {parameter}</h2>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
    </div>
  );
};

export default Sidebar;
