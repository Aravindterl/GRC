import './App.css';
import Login from './Login/Login';
import { BrowserRouter, Routes, Route ,Navigate} from 'react-router-dom';
import React ,{useState} from 'react';
// import Sidebar from './Components/Sidebar';
import ResetPassword from './ResetPassword/ResetPassword';
import ScaleOfUniverse from './Login/ScaleOfUniverse';
import HomeScreen from './HomeScreen';
//import Clientmanagement from './NavBarScreens/ClientManagement';
import KnowledgeManagement from './NavBarScreens/KnowledgeManagement';
import HelpContent from './NavBarScreens/HelpContent';
import TicketingSystem from './NavBarScreens/TicketingSystem';
import TrainingModules from './NavBarScreens/TrainingModules';
// import LandingPage from './LandingPage';
import RoleMaster from './NavBarScreens/MasterScreens/RoleMaster/RoleMaster';
import UserMaster from './NavBarScreens/MasterScreens/UserMaster/UserMaster';
import ActivityMaster from './NavBarScreens/MasterScreens/ActivityMaster/ActivityMaster';
import AssignmentMaster from './NavBarScreens/MasterScreens/AssignmentMaster/AssignmentMaster';
import ClientOnboard from './NavBarScreens/ClientOnboard';
import LicenseManagement from './NavBarScreens/LicenseManagement';
import CreateCompliance from './NavBarScreens/Configurations/CreateCompliance/CreateCompliance';
import ViewCompliancePeriod from './NavBarScreens/Configurations/CreateCompliance/ViewCompliance/ViewCompliance';
import CreateAssignments from './NavBarScreens/Configurations/CreateCompliance/CreateAssignments/CreateAssignments';
import PerformActivity from './NavBarScreens/PerformActivity/PerformActivity';
import ApprovePerformActivity from './NavBarScreens/PerformActivity/ApprovePerformActivity';
import CorrectionPerformActivity from './NavBarScreens/PerformActivity/CorrectionPerformActivity';

// import ZoomableImage from './Login/ZoomableImgae';
// import images from './Login/LoginIm.jpg';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Perform login logic here, for demonstration purposes, let's simulate successful login
    setIsLoggedIn(true);
    //isLoggedIn
  };
  

  const [isOpen, setIsOpen] = useState(false);

  const handleParameterChange = (newIsOpen) => {
    setIsOpen(newIsOpen);
  };

 
  return (
    <div>
      <BrowserRouter>
      {/* {isLoggedIn ? <HomeScreen/> : <Login onLogin={handleLogin} />} */}
      {/* <HomeScreen /> */}
        <Routes>
              {/* <Route path="/" element={<Login/>}></Route> */}
              <Route path="/resetpassword" element={<ResetPassword/>}/>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/zoomable" element={<ScaleOfUniverse/>}/>
              {/* <Route path="/home" element={isLoggedIn ? <HomeScreen /> : <HomeScreen />  } /> */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/home" element={<HomeScreen onParameterChange={handleParameterChange}/>}>
                {/* <Route path="clientmanagement" element={<Clientmanagement isOpen={isOpen}/>}/> */}
                <Route path="knowledgemanagement" element={<KnowledgeManagement  isOpen={isOpen }/>}/>
                <Route path="helpcontent" element={<HelpContent/>}/>
                <Route path="role" element={<RoleMaster isOpen={isOpen }/>}/>
                <Route path="user" element={<UserMaster isOpen={isOpen }/>}/>
                <Route path="viewcompliance" element={<ViewCompliancePeriod isOpen={isOpen }/>}/>
                <Route path="license" element={<LicenseManagement isOpen={isOpen }/>}/>
                <Route path="createcompliance" element={<CreateCompliance isOpen={isOpen }/>}/>
                <Route path="createassignments" element={<CreateAssignments isOpen={isOpen }/>}/>
                <Route path="performactivity" element={<PerformActivity isOpen={isOpen }/>}/>
                <Route path="correctionperformactivity" element={<CorrectionPerformActivity isOpen={isOpen }/>}/>
                <Route path="approveperformactivity" element={<ApprovePerformActivity isOpen={isOpen }/>}/>
                <Route path="performactivity" element={<PerformActivity isOpen={isOpen }/>}/>
                <Route path="clientonboard" element={<ClientOnboard isOpen={isOpen }/>}/>
                <Route path="activity" element={<ActivityMaster isOpen={isOpen }/>}/>
                <Route path="assignment" element={<AssignmentMaster isOpen={isOpen }/>}/>
                <Route path="ticketingsystem" element={<TicketingSystem/>}/>
                <Route path="trainingmodules" element={<TrainingModules/>}/>
              </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;