import React ,{useState ,useEffect}from "react";
import './CreateCompliance.css';
import { RotatingLines} from 'react-loader-spinner';
import Config from "../../../Config";


const CreateCompliance = ({isOpen}) =>{
    const [IsClickadd, setIsClickadd] = useState(false);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setmessage] = useState('');    
    const [licenses, setLicenses] = useState([]);
    const [selectedLicense, setSelectedLicense] = useState();
    const [selectedLicenseData , setSelectedLicenseData] = useState([]);
    const [showLicenseData, setShowLicenseData] = useState(false); // State to manage the visibility of the license data block
    const [isLoading, setIsLoading] = useState(false);
    const [showPopuptoClosePrv, setShowPopuptoClosePrev] = useState(false);
    const [isLastCompliancethere, setIsLastCompliancethere] = useState(true);
    const [hasLastCompliane, setHaslastCompliance] = useState(false);
    const [popupresponse, setPopUpResponse] = useState(false);
    const [isOpenCreate, setisOpenCreate] = useState(false);
    
    const [formData, setFormData] = useState({
        standardId: 1,
        complStartDate: '',
        complEndDate:'',                
        customerId:'',
        licenseId:'',
        CanClosePrevCompliancePeriod:''
      });    
    
      const handleChange =(isEdit) => (e) => {
        const { name, value } = e.target;
        if(isEdit){
            setEditedItem(prevState => {
                return {
                  ...prevState,
                  [name]: value
                };
              });
            }
        else{
            setFormData(prevState => {
                return {
                  ...prevState,
                  [name]: value
                };
              });
            }
      };
  
      const handleLicenseChange = (e) => {
        const selectedLicenseId = e.target.value;
        const selectedLicenseInfo = licenses.find(license => license.licenseLookupId === parseInt(selectedLicenseId));
        setSelectedItem(selectedLicenseInfo);        
        setSelectedLicense(selectedLicenseId);    
      };
  
      // Submit function to be implemented
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);  
        const licensevalue = parseInt(selectedLicense);
        
        try {
          const response = await fetch(`${Config.apiBaseUrl}/api/LookUp/compliananceperiodforguidence?LicenseId=${licensevalue}`);
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          setSelectedLicenseData(data);
      
          setTimeout(() => {                       
            setShowLicenseData(true);
            setIsLoading(false);
          }, 2000);
        } catch (error) {
          console.error('Error fetching data:', error);
          alert("Post failed: " + error.message);
        }
      };
      

      const handlePost = async (e) => {
        e.preventDefault();             
        console.log(formData)   
        const hasLastCompliancePeriod = selectedLicenseData && selectedLicenseData.length > 0 && selectedLicenseData[0].lastCompliancePeriod;     
        if (hasLastCompliancePeriod && hasLastCompliancePeriod.startDate !== null) {
          setHaslastCompliance(true);
        }
        if (!popupresponse) {
          setFormData((prevState) => ({
            ...prevState,
            customerId: parseInt(sessionStorage.getItem('customerid')), 
            licenseId: parseInt(selectedLicense),
            CanClosePrevCompliancePeriod: isOpenCreate
          }));
      
          try {
            const response = await fetch(`${Config.apiBaseUrl}/api/CompliancePeriod`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
      
            const data = await response.json();
            
            if (response.ok && data.statusCode === 200) {
              setShowPopup(true);
              setmessage(data.message);              
              setTimeout(() => {
                setShowPopup(false);
                setShowLicenseData(false);
              }, 4000);
            } else {
              console.error('Error:', data);
            }
          } catch (error) {
            console.error('Error:', error);
            alert("Post failed: " + error.message);
          }
        }     
      };
      
       
      const renderDateOrPlaceholder = (date) => {
        if (date) {
            return formatDate(date);
        } else {
            return "---";
        }
      };

      const setIsLastCompliancethereFalse = () => {
        setIsLastCompliancethere(false);
      };
    
      const handleSelectItem = (item) => {
        setSelectedItem(item);
        setEditedItem({ ...item });
      };    

      const handleShowPopuptoClosePrev = () => {
        setShowPopuptoClosePrev(true);
      };

      useEffect(() => { 
        const fetchLicenses = async () => {
          try {
            const response = await fetch(`${Config.apiBaseUrl}/api/LookUp/GetLicensesForCompliancePeriod?CustomerId=${sessionStorage.getItem('customerid')}`);
            
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const data = await response.json();
            setLicenses(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchLicenses();
      }, []);
      

      const handlePostdata = async () => {
        if (popupresponse) {
          setFormData((prevState) => ({
            ...prevState,         
            customerId: parseInt(sessionStorage.getItem('customerid')), 
            licenseId: parseInt(selectedLicense),
            CanClosePrevCompliancePeriod: isOpenCreate
          }));
      
          try {
            const response = await fetch(`${Config.apiBaseUrl}/api/CompliancePeriod`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
      
            const data = await response.json();
      
            if (data.statusCode === 200) {
              setShowPopup(true);
              setmessage(data.message);
              setTimeout(() => {
                setShowPopup(false);
                setShowLicenseData(false);
              }, 4000);
            }
          } catch (error) {
            console.error('Error:', error);
            alert("Post failed: " + error.message);
          }
        }
      };
      
      const toggleArrow = () => {
        setIsClickadd(!IsClickadd);       
      };

      const handlePopUp = (isOpen) => {
        if(isOpen){
          setisOpenCreate(true);
        }
        else{
          setisOpenCreate(false);
        }
          
          setPopUpResponse(true);
          handlePostdata();  
          setHaslastCompliance(false);
      }
       
      const toggleselected = () => {
        setSelectedItem(null);
      };
      const togglepopup = () => {
        setShowPopup(false);
        setShowLicenseData(false);
      };

      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
     
    return(
        <div className={`role ${isOpen ? 'open' : ''}`}>
            <div style={{flexDirection:'row',marginTop:'35px',marginLeft:'25px',height:'60px',backgroundColor:'#DEF5E5',borderRadius:'9px'}}>
                <label style={{fontSize:'20px',fontWeight:'700',marginLeft:'25px',marginTop:'10px'}}>New Complaince Period Creation</label>                
            </div>            
            <div className="compliance-steps" style={{marginTop:'27px'}}>
                <div className="step active-step">1</div>
                <div className="step-title">Select available Licenses</div>
            </div>
            <div className="compliance-form">
                <div style={{display:'flex',flexDirection:'row'}} >
                    <label htmlFor="licenseSelect" style={{marginLeft:'20px', marginTop:'15px'}}>Select License</label>
                    <select 
                       style={{marginLeft:'100px',height:'30px', marginTop:'7px',borderRadius:'5px'}}
                        value={selectedLicense} 
                        onChange={handleLicenseChange}
                    >
                    <option value="">Select License</option>
                    {licenses.map(license => (
                        <option key={license.licenseLookupId} value={license.licenseLookupId}>{`${license.governanceName} - ${license.licenseLookupId}`}</option>
                    ))}
                    </select>                    
                </div>
                <button onClick={handleSubmit} style={{marginTop:'20px',marginLeft:'200px' , width:'100px'}}>Next</button>
            </div>
            {showLicenseData  ? (
                <div className="compliance-steps">
                    <div style={{display:'flex' , flexDirection:'column' , marginTop:'20px' , width:'1080px'}}>                                      
                    <div style={{display:'flex' , flexDirection:'row'}}>
                        <div className="step active-step">2</div>
                        <div className="step-title">License and Compliance Period History</div>
                    </div>
                    <div style={{border:'2px solid grey', borderRadius:'5px' , marginLeft:'40px' , width:'990px'}}> 
                    <div style={{display:'flex' , flexDirection:'row' ,marginLeft:'-40px'}}>
                    <table style={{ width: '700px' }}>
                        <thead >
                            <tr >
                                <th style={{ width: '70px' }}>Dates</th>
                                <th style={{ width: '70px' }}>License</th>
                                <th style={{ width: '100px' }}>Last Compliance Period</th>
                                <th>Estimated New Compliance Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedLicenseData.map((item, index) => (
                            <React.Fragment key={item.licenseId}>
                                <tr>
                                    <td style={{fontWeight:'bold'}}>Start Date</td>
                                    <td>{renderDateOrPlaceholder(item.licenseDates.startDate)}</td>
                                    <td style={{textAlign:'center'}}>{renderDateOrPlaceholder(item.lastCompliancePeriod.startDate)}</td>
                                    <td>{renderDateOrPlaceholder(item.estimatedCompliancePeriod.startDate)}</td>
                                </tr>
                                <tr>
                                    <td style={{fontWeight:'bold'}}>End Date</td>
                                    <td>{renderDateOrPlaceholder(item.licenseDates.endDate)}</td>
                                    <td style={{textAlign:'center'}}>{renderDateOrPlaceholder(item.lastCompliancePeriod.endDate)}</td>
                                    <td>{renderDateOrPlaceholder(item.estimatedCompliancePeriod.endDate)}</td>
                                </tr>
                            </React.Fragment>
                            ))}
                        </tbody>                       
                    </table>
                    <div>
                        {selectedItem ? (
                            <div style={{display:'flex' , flexDirection:'column' , marginLeft:'20px'}}>
                                <span style={{marginTop:'20px'}}><b>Governance</b> : {selectedItem.governanceName}</span>
                               <span style={{marginTop:'30px' , marginLeft:'-10px'}}> <b>&nbsp;&nbsp;Standard</b> : {selectedItem.standardName}</span>
                                <span style={{marginTop:'30px' , marginLeft:'-10px'}}><b>&nbsp;&nbsp;&nbsp;country / Origin</b> : {selectedItem.countryName}</span>
                            </div>
                        ):''}
                        </div>
                    </div>
                    <div style={{marginLeft:'110px', marginTop:'20px'}}>
                      <form onSubmit={handlePost}>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'40px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>StartDate:</h5>
                                    <input type="date"
                                    placeholder="Contact Name"
                                    style={{width:'200px',height:'20px',marginLeft:'15px'}}
                                    name="complStartDate"
                                    onChange={handleChange(false)}/>                                
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'-10px'}}>
                                <h5 style={{marginLeft:'40px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>EndDate :</h5>
                                <input type="date"
                                placeholder="Contact Name"
                                style={{width:'200px',height:'20px',marginLeft:'15px'}}
                                name="complEndDate"
                                onChange={handleChange(false)}/>                            
                            </div>
                            {isLastCompliancethere ? (<button type="submit" style={{width:'120px', marginLeft:'170px' , marginBottom:'10px'}}>Submit</button>) : (<button onClick={handleShowPopuptoClosePrev} style={{width:'120px', marginLeft:'170px' , marginBottom:'10px'}}>Submit</button>)}                            
                       </form>                    
                    </div>  
                    </div>   
                  </div>                                 
                </div>                
            ) : (isLoading ?  <div className="compliance-steps">
                <div style={{ marginTop: '100px', marginLeft: '390px' }}><RotatingLines
                                    visible={true}
                                    height="50"
                                    width="50"
                                    color="grey"
                                    strokeColor='black'
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    ariaLabel="rotating-lines-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    /></div>
                                    </div> : null) }
                                    {showPopup && (
            <div className="responsepopup">
              <p>{message}</p>
              <button className="okbuttonforresponse" onClick={togglepopup}>OK</button>
            </div>
            )}
            {showPopuptoClosePrv && (
            <div className="responsepopup">
              <p>Would you like to Close Previous compliance Period</p>
              <button className="okbuttonforresponse">OK</button>
            </div>
            )}
            {hasLastCompliane &&(
              <div className="responsepopup" style={{height:'auto'}}>
                Your Compliance period has been created Successfully.

                Click <span style={{color:'blue'}}>YES</span> to continue   To create Activity Assignment’s for the above compliance period. Click Close to Exit!.
               <div style={{display:'flex',flexDirection:'row'}}> <button  onClick={() => handlePopUp(true)} style={{width:'150px'}}>Close & Create</button> <button  onClick={() => handlePopUp(false)}  style={{width:'150px',marginLeft:'10px'}}>keepOpen & Create</button></div>
              </div>
            )}
        </div>
    );
};

export default CreateCompliance;