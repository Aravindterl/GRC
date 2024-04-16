import React,  { useEffect , useState  }  from 'react';
import axios from 'axios';
import {useLocation , useNavigate , useParams } from 'react-router-dom';
import './resetpassword.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [uidExist, setUidExist] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const parameter = params.get('UID');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5145/api/userResetPassword', { email,oldPassword,newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
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
      navigate('/');
    }
    // else if(uidExist !== 'true'){

    // }
  }, [parameter, navigate, uidExist]);

  return (
    <div className='resetpasswordcontainer'>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className='resetpasswordform'>
        <div>
          <label className='resetpasswordlabel'>Email:</label>
          <input type="email"  className='resetpasswordinput' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Old Password:</label>
          <input type="password" className='resetpasswordinput' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        </div>
        <div>
          <label>New Password:</label>
          <input type="password"  className='resetpasswordinput' value={newPassword} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input type="password"  className='resetpasswordinput' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className='resetpasswordbutton'>Reset Password</button>
      </form>
      {message === 'Passwords do not match' ? <p style={{color:'red'}}>{message}</p> : <p style={{color:'green'}}>{message}</p> }
    </div>
  );
};

export default ResetPassword;
