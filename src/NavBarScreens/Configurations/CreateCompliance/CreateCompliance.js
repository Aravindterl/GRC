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
    const [formData, setFormData] = useState({
        standardId: 1,
        complStartDate: '',
        complEndDate:'',                
        customerId:9,
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


  
      useEffect(() => {
          // Fetch licenses here and update the state
          // setLicenses(fetchedLicenses);          
      }, []);
  
      const handleLicenseChange = (e) => {
        const selectedLicenseId = e.target.value;
        const selectedLicenseInfo = licenses.find(license => license.licenseLookupId === parseInt(selectedLicenseId));
        setSelectedItem(selectedLicenseInfo);        
        setSelectedLicense(selectedLicenseId);    
      };
  
      // Submit function to be implemented
      const handleSubmit = (e) => {
          e.preventDefault();
          setIsLoading(true);  
          const licensevalue = parseInt(selectedLicense);
          try{            
            fetch(`${Config.apiBaseUrl}/api/LookUp/compliananceperiodforguidence?LicenseId=${licensevalue}`)
                .then(response => response.json())
                .then(data => {
                    setSelectedLicenseData(data);
                    setTimeout(() => {                       
                        setShowLicenseData(true);
                        setIsLoading(false);
                    }, 2000);
                     // Set the state to show license data block
                })
                .catch(error => console.error('Error fetching data:', error)); 
                //console.log("GuidenceData",selectedLicenseData.licenseDates.startDate)           
          }
          catch(error){
            console.error("Post failed", error);
            alert("Post failed: " + error.message);
          }
          // Submission logic here
      };

    const handlePost = (e) => {
        e.preventDefault(); 
            
        console.log(formData)
        try{
          fetch(`${Config.apiBaseUrl}/api/CompliancePeriod`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json())
          .then(data => {          
            if(data.statusCode === 200){
              setShowPopup(true);
              setmessage(data.message);              
            }           
              setTimeout(() => {
              setShowPopup(false);
              setShowLicenseData(false);
              }, 4000);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
        catch(error){
          console.error("Post failed", error);
          alert("Post failed: " + error.message);
        }
      };
       
      const renderDateOrPlaceholder = (date) => {
        if (date) {
            return formatDate(date);
        } else {
            // Call your hook or perform any other action here
            // For example, you can call a function that sets a state or performs some other action
            // useStateSetter(); // Example of calling another hook
            //setIsLastCompliancethereFalse();
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
        fetch(`${Config.apiBaseUrl}/api/LookUp/GetLicensesForCompliancePeriod?CustomerId=9`)
          .then(response => response.json())
          .then(data => setLicenses(data))
          .catch(error => console.error('Error fetching data:', error));
          console.log("licensesdata",licenses)
      }, []);

      const toggleArrow = () => {
        setIsClickadd(!IsClickadd);       
      };

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
        </div>
    );
};

export default CreateCompliance;