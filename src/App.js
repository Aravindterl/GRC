import './App.css';
import Login from './Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
// import ZoomableImage from './Login/ZoomableImgae';
// import images from './Login/LoginIm.jpg';

function App() {

  // const imagePaths = ['D:\MyProjects\GRC\grc\src\Login\LoginIm.jpg', 'D:\MyProjects\GRC\grc\src\Login\LoginIm.jpg', 'D:\MyProjects\GRC\grc\src\Login\LoginIm.jpg'];
  return (
    <div>
       {/* <ZoomableImage images={imagePaths} /> */}
      {/* <Login /> */}
      
      <BrowserRouter>
        <Routes>
              {/* <Route path="/" element={<Login />} /> */}
              <Route path="/" element={<Login/>} />
          <Route path="/sidenav" element={<Sidebar/>}></Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
