import React, { useState, useEffect} from 'react';
// import { useHistory } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import './login.css';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import { Bars ,RotatingLines} from 'react-loader-spinner';
import Config from '../Config';

const Login = ({onLogin}) => {
  // const history = useHistory();
  const navigate = useNavigate();

  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [postData, setPostData] = useState({ email: '', password: '',});
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [code,setcode] = useState('');
  const [userid,setUserid] = useState('');
  const [PostOtpData, setPostotpData] = useState({userid:'',code:''});
  const [otpres,setotpres] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {

    if (email && password) {
      setIsLoading(true);
      // Successful login (you can redirect the user or perform other actions)
      const response = await fetch(`${Config.apiBaseUrl}/api/userLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if needed
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      setIsLoading(false);
      setResponseData(data);
      setUserid(data.userid);
      console.log('MFA Sent Success');
      // navigate('/sidenav');
      setError('');
    } else {
      setError('Please enter both username and password');
    }
  };

  React.useEffect(() => {
    setPostData({ email, password });
  }, [email, password]);

  React.useEffect(() => {
    setPostotpData({ userid, code });
  }, [userid, code]);


  const handleGoogleLogin = () => {
    // Redirect to Google for authentication
    window.location.href = 'https://accounts.google.com/';
  };

  const handleFacebookLogin = () => {
    // Redirect to Facebook for authentication
    window.location.href = 'https://www.facebook.com/';
  };

  const handleVerifyOtp = async () => {
    // Logic to verify the OTP, you can add your API call here
    // After verifying OTP, you can handle the result as needed
    
    if (code) {
      setIsLoading(true);
      // Successful login (you can redirect the user or perform other actions)
      try{      
      const response = await fetch(`${Config.apiBaseUrl}/api/userAuthentication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if needed
        },
        body: JSON.stringify(PostOtpData),
      });
      const data = await response.json();
      if(response.ok){
          
          if(data != null){
            if(data.message != null){
              setotpres(data);
            }
            setotpres(data);
            sessionStorage.setItem('customerid',data.customerId)
            sessionStorage.setItem('Token',data.authenticationToken)
            sessionStorage.setItem('name', data.username);
            sessionStorage.setItem('sysRoleId', data.sysRoleId);
            sessionStorage.setItem('userId', data.userId);           
          }
      }
      setError('');
    }catch(error) {
        setError('An error occurred while verifying OTP');
      } finally {
        // Hide loader
      }
    } else {
      setError('Please enter OTP');
    }
  };

  useEffect(() => {
    if (otpres.message === ' User Authenticated Successfully...!') {
      setTimeout(() => {
        setIsLoading(false); 
        navigate(`/home`);
        sessionStorage.setItem('isSystemAdmin', otpres.isSystemAdmin);
        sessionStorage.setItem('isClientAdmin', otpres.isClientAdmin);
        onLogin();
      }, 3000);
    }
  }, [otpres , navigate , onLogin]);

  return (
    <div className='container'>
        <div className='image-container'>
        </div>
        <div style={{marginTop:'10px'}} >
          <div className='login-container'>
              <h2>Login</h2>
                <div className='input-conatainer'>
                    <div>           
                        <input
                        type="text"
                        id="username"
                        placeholder='User Name'
                        value={email}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                        {error && <p style={{ color: 'red',fontSize:'10px',marginLeft:'1px',marginTop:'-15px' }}>{"Please fill User Name"}</p>}
                    </div>
                    <div>
                        <input
                        type="password"
                        id="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                         {error && <p style={{ color: 'red',fontSize:'10px',marginTop:'-15px' }}>{"Please fill Password"}</p>}
                    </div>
                </div>
                {/* <button onClick={handleLogin} style={{width:'190px',marginTop:'15px',marginLeft:'30px'}}>Login</button> */}
                <div className='forgot-password' style={{marginTop:'-10px'}}> Forgot Password</div>
                {responseData ? (<div className="otp-box">
                      <label style={{height:'60px'}}>
                        Enter OTP:
                        <input
                          className="otp-input"
                          type="text"
                          value={code}
                          onChange={(e) => setcode(e.target.value)}
                        />
                      </label>
                      <button className="verify-button" onClick={handleVerifyOtp}>
                       {isLoading ? <span><Bars
                                            height="15"
                                            width="15"
                                            color="white"
                                            ariaLabel="bars-loading"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                            visible={true}
                                            /></span> : <span>Verify OTP</span>}
                      </button>
                    </div>):<button onClick={handleLogin} style={{width:'190px',marginTop:'15px',marginLeft:'30px'}}>{isLoading ? <RotatingLines
                                                                                                                                    visible={true}
                                                                                                                                    height="20"
                                                                                                                                    width="20"
                                                                                                                                    color="grey"
                                                                                                                                    strokeColor='white'
                                                                                                                                    strokeWidth="5"
                                                                                                                                    animationDuration="0.75"
                                                                                                                                    ariaLabel="rotating-lines-loading"
                                                                                                                                    wrapperStyle={{}}
                                                                                                                                    wrapperClass=""
                                                                                                                                    />: <span>Login</span>}</button>}
            </div>
            <div style={{marginLeft:'1190px',marginTop:'15px'}}>
                 (Or) 
            </div>
            <div className='googlebox' onClick={handleGoogleLogin}>
               <div className='Button'><FcGoogle size={20}/> Continue with Google</div>
            </div>
            <div className='facebookbox' onClick={handleFacebookLogin}>
              <div className='Button'><FaFacebook size={20}/> Continue with Facebook</div>
            </div>
      </div>
    </div>
  );
};

export default Login;
