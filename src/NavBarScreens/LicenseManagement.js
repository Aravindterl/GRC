import React ,{useState ,useEffect }from "react";
import '../NavBarScreens/ClientOnboard.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { BiFirstPage , BiLastPage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Config from "../Config";

const LicenseManagement = ({isOpen}) =>{
    const [IsClickadd, setIsClickadd] = useState(false);
    const [data, setData] = useState([]);
    const [roleData, setroleData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [governanceData, setGovernanceData] = useState([]);
    const [standardData, setStandardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    //const [options, setOptions] = useState([]);
    // const [selectedValue, setSelectedValue] = useState();
    const [showPopup, setShowPopup] = useState(false);
    const [isSysManager, setIsSysManager] = useState(false);
    const [message, setmessage] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedGovernanceId, setSelectedGovernanceId] = useState('');
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [selectedComplianceId, setSelectedComplianceId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   

    const filteredItems = data.filter(item =>
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.governance.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.startOrRenewalDate.toLowerCase().includes(searchQuery.toLowerCase()) ||        
        item.standardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.endDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.country && item.country.toLowerCase().includes(searchQuery.toLowerCase()))
        );

     const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const [formData, setFormData] = useState({
        startOrRenewalDate: '',
        contractPeriodInMonths:'',
        endDate:'',
        customerId:'',
        countryId:'',
        standardId:'',
        contractDocuments:'',
        remarks:'',
        createdBy:1,        
        approved: false,
        isActive:true
      });
    //   = (name) => (e) => 
      const handleChange =(isEdit) => (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        if(name === "isActive"){
          updatedValue = value === "true" ? true : false;
        }
        if(name === "approved"){
            updatedValue = value === "true" ? true : false;
          }
            if(isEdit){              
            setEditedItem(prevState => {
                return {
                  ...prevState,
                  [name]: updatedValue
                };
            });
        }
        else{          
            setFormData(prevState => {
                return {
                    ...prevState,
                    [name]: updatedValue
                };
            });
        }
      };

      const handleDropdownChange =(isEdit)=> (e) => {
        // setSelectedValue(e.target.value);
        const { name, value } = e.target;     
        if(name === "governanceId"){
             setSelectedGovernanceId(e.target.value)
        }
        if(name === "countryId"){
            setSelectedCountryId(e.target.value)
       }
       if(name === "customerId"){
        setSelectedCustomerId(e.target.value)
        }
        if(name === "standardId"){
            setSelectedComplianceId(e.target.value)
        }
        if(isEdit){
            setEditedItem(prevState => {
                return {
                  ...prevState,
                  [name]: parseInt(value)
                };
            });
        }
        else{
            setFormData(prevState => {
                return {
                  ...prevState,
                  [name]: parseInt(value)
                };
              });
        }
      
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        setIsClickadd(false);
        console.log(formData)
        try{
          fetch(`${Config.apiBaseUrl}/api/LicenseManagement/AddLicense`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json())
          .then(data => {
            setmessage(data.message);
            if(data.statusCode === 200){
              setShowPopup(true);
            }           
              setTimeout(() => {
              setShowPopup(false);
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

      const handleSave = () => {
        console.log(editedItem)
        fetch(`${Config.apiBaseUrl}/api/LicenseManagement/UpdateLicense`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedItem)
        })
        .then(response => {
          if (response.ok) {
            const newData = data.map(item => (item.id === editedItem.roleId ? editedItem : item));
            setData(newData);
            setSelectedItem(null);
            setEditedItem(null);
          } else {
            console.error('Failed to update item:', response.status);
          }
        })
        .catch(error => console.error('Error updating item:', error));
      };

      const handleDelete = (userId) => {
        fetch(`${Config.apiBaseUrl}/api/UserMasters/${userId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (response.ok) {
            setData(prevData => prevData.filter(item => item.userId !== userId));
          } else {
            console.error('Failed to delete item:', response.status);
          }
        })
        .catch(error => console.error('Error deleting item:', error));
      };

      const handleEdit = (item) => {
        setSelectedItem(item);
        setEditedItem({ ...item });
      };

      useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Config.apiBaseUrl}/api/LicenseManagement/GetAllLicenses`);
                const data = await response.json();
                setData(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [data]);
   
    useEffect(() => {
       const sysRoleId = sessionStorage.getItem("sysRoleId") ;
        if(sysRoleId === '1'){
            setIsSysManager(true);
        }
      }, []);


      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/LookUp/CountryMasterlookup`)
          .then(response => response.json())
          .then(data => setroleData(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/LookUp/Customerlookup`)
          .then(response => response.json())
          .then(data => setCustomerData(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/LookUp/GovernanceMasterlookup`)
          .then(response => response.json())
          .then(data => setGovernanceData(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);     
      
      useEffect(() => {
        if (selectedGovernanceId && selectedCountryId) {
            fetch(`${Config.apiBaseUrl}/api/LookUp/StandardMasterlookup?governaceId=${selectedGovernanceId}&CountryCode=${selectedCountryId}`)
                .then(response => response.json())
                .then(data => setStandardData(data))
                .catch(error => console.error('Error fetching data:', error));
        } else {
            // Reset standard data if either governance or country is not selected
            setStandardData([]);
        }
    }, [selectedGovernanceId, selectedCountryId]); 

      const toggleArrow = () => {
        setIsClickadd(!IsClickadd);       
      };

      const toggleselected = () => {
        setSelectedItem(null);
    };

    const togglepopup = () => {
      setShowPopup(false);
    };
     
    return(
        <div className={`role ${isOpen ? 'open' : ''}`}>
            <div style={{flexDirection:'row',marginTop:'45px',marginLeft:'25px',height:'90px',backgroundColor:'#DEF5E5',borderRadius:'9px'}}>
                <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'10px'}}>ClientManagement/<span style={{color:'purple'}}> License</span></label>
                <input
                    type="text"
                    placeholder="Search..."
                    style={{width:'200px',marginLeft:'40px'}}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                {isSysManager ? '' : (<div className="addnewrole" onClick={toggleArrow}><label style={{fontSize:'15px',color:'white',cursor:'pointer',marginTop:'10px'}}>+ Add New License</label></div>)}
            </div>
            <div className="rolemastertable">
                <table style={{borderCollapse:'collapse',width:'1190px'}}>
                    <thead>
                        <tr>
                            <th style={{width:'150px'}}>Customer Name</th>
                            <th style={{width:'130px'}}>Governance Domain</th>
                            <th style={{width:'130px'}}>Start /Renewal Date</th>
                            <th style={{width:'130px'}}>Country/Region</th>
                            <th style={{width:'170px'}}>Contract Period</th>
                            <th style={{width:'150px'}}>Compliance/Standard</th>
                            <th style={{width:'130px'}}>End Date</th>
                            <th style={{width:'auto'}}>Active</th>
                           {isSysManager ? <th style={{width:'100px'}}>Approve</th> : <th style={{width:'100px'}}>Action</th> }
                        </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(item => (
                        <tr key={item.id}>
                        <td>{item.customerName}</td>
                        <td>{item.governance}</td>
                        <td>{item.startOrRenewalDate}</td>
                        <td>{item.country}</td>
                        <td>{item.contractPeriodInMonths}</td>
                        <td>{item.standardName}</td>
                        <td>{item.endDate}</td>
                        <td>{item.isActive === true ? "Yes" : "No"}</td>                    
                       {isSysManager ? (item.approved === false ? <button onClick={() => handleEdit(item)} size={15} style={{cursor:'pointer', height:'30px' , width:'100px',borderRadius:'25px' , backgroundColor:'orange'}}>Approve</button>  : <button style={{backgroundColor:'green', cursor:'default' , height:'30px' , width:'100px' , borderRadius:'25px'}}>Approved</button>) : <td><FiEdit onClick={() => handleEdit(item)} size={15} style={{cursor:'pointer',marginRight:'10px',marginLeft:'10px'}}/>   <MdDeleteForever size={20} style={{cursor:'pointer',color:'red',marginLeft:'10px'}}  onClick={() => handleDelete(item.id)}/></td>} 
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{width:'30px',backgroundColor:'transparent'}}><BiFirstPage size={20} color="black"/></button>
                <span style={{border:'1px solid black',borderRadius:'5px',padding:'5px'}}>{currentPage}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= data.length} style={{width:'30px',backgroundColor:'transparent'}}><BiLastPage size={20} color="black"/></button>
            </div>
            </div>
            
            {IsClickadd ? (<div className="popup" >
                <form onSubmit={handleSubmit} >
                    <div className="assignformdiv">
                            <div style={{display:'inline-flex',zindex: '1000'}}>
                              <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'30px',width:'200px'}}>New License</label>
                              <RxCross2  size={35} color="red" style={{marginLeft:'590px',cursor:'pointer',marginTop:'30px'}} onClick={toggleArrow}/>
                            </div>
                            <div style={{paddingTop:'10px',overflowY:'auto',height:'calc(100% - 60px)',display:'flex',flexDirection:'column',boxShadow:'inset 0 0 5px rgba(0, 0, 0, 0.5)'}}>
                              <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Customer Name :</h5>
                                    <select type="text"
                                    // placeholder=""
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                    name="customerId"
                                    value={selectedCustomerId}
                                    onChange={handleDropdownChange(false)}>
                                    <option value="">Select Customer</option>
                                    {customerData.map(option => (
                                        <option key={option.cusotmerId} value={option.cusotmerId}>{option.customerName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Governance Domain :</h5>
                                    <select type="text"
                                    //placeholder=""
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                    name="governanceId"
                                    value={selectedGovernanceId}
                                    onChange={handleDropdownChange(false)}>
                                    <option value="">Select Governance</option>
                                    {governanceData.map(option => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Country / Region:</h5>
                                  <select type="text"
                                    // placeholder=""
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                    name="countryId"
                                    value={selectedCountryId}
                                    onChange={handleDropdownChange(false)}>
                                    <option value="">Select Country</option>
                                    {roleData.map(option => (
                                        <option key={option.id} value={option.id}>{option.countryName}</option>
                                        ))}
                                    </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Compliance / Standard :</h5>
                                    <select type="text"
                                    // placeholder=""
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                    name="standardId"
                                    value={selectedComplianceId}
                                    onChange={handleDropdownChange(false)}>
                                    <option value="">Select Standard</option>
                                    {standardData.map(option => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'40px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Contract Docments:</h5>
                                    <input type="file"
                                    placeholder="Contact Name"
                                    style={{width:'200px',height:'20px',marginLeft:'15px'}}
                                    name="contractDocuments"
                                    onChange={handleChange(false)}
                                  />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Start / Renewal Date:</h5>
                                  <input type="date"
                                    placeholder="Contact Name"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="startOrRenewalDate"
                                    onChange={handleChange(false)}
                                  />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                            </div>                              
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Contract Period:</h5>
                                  <input type="text"
                                    placeholder="Contract Period"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="contractPeriodInMonths"
                                    onChange={handleChange(false)}
                                  />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>End Date:</h5>
                                  <input type="date"
                                    placeholder="End Date"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="endDate"
                                    onChange={handleChange(false)}
                                  />
                              </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'inline-flex',flexDirection:'row',marginTop:'-5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Remarks :</h5>
                                    <input type="text"
                                        placeholder="Remarks"
                                        style={{width:'200px',height:'20px',marginLeft:'35px'}}
                                        name="remarks"
                                        onChange={handleChange(false)}
                                    />
                              </div>
                              <div style={{display:'inline-flex' ,marginLeft:'50px'}}>
                                  <label style={{marginLeft:'10px',fontSize:'17px',fontWeight:'700'}}> Active :</label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="isActive" value={true} style={{marginLeft:'50px'}} onChange={handleChange(false)}/> Yes
                                  </label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="isActive" value={false} style={{marginLeft:'30px'}} onChange={handleChange(false)}/> No
                                  </label>
                              </div>
                              
                            </div>                            
                             <button type="submit" className="submitbutn" style={{backgroundColor:'#003300',marginLeft:'370px',marginBottom:'50px'}}>Submit</button>
                           </div>
                    </div>
                </form>
            </div>):''}
            {selectedItem && (<div className="popup" >
            <form onSubmit={handleSave} >
                    <div className="assignformdiv">
                            <div style={{display:'inline-flex',zindex: '1000'}}>
                              <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'30px',width:'200px'}}>New License</label>
                              <RxCross2  size={35} color="red" style={{marginLeft:'590px',cursor:'pointer',marginTop:'30px'}} onClick={toggleselected}/>
                            </div>
                            <div style={{paddingTop:'10px',overflowY:'auto',height:'calc(100% - 60px)',display:'flex',flexDirection:'column',boxShadow:'inset 0 0 5px rgba(0, 0, 0, 0.5)'}}>
                              <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Customer Name :</h5>
                                    <select type="text"
                                    // placeholder=""
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                    name="cliRoleId"
                                    value={editedItem.customerName}
                                    onChange={handleDropdownChange(true)}>
                                    <option value="">Select Customer</option>
                                    {customerData.map(option => (
                                        <option key={option.cusotmerId} value={option.customerName}>{option.customerName}</option>
                                        ))}
                                        disabled
                                    </select>
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Governance Domain :</h5>
                                    <select type="text"
                                    // placeholder=""
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                    name="governanceId"
                                    value={editedItem.governance}
                                    onChange={handleDropdownChange(true)}>
                                    <option value="">Select Governance</option>
                                    {governanceData.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                        ))}
                                        disabled
                                    </select>
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Country / Region:</h5>
                                  <select type="text"
                                    // placeholder=""
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                    name="countryId"
                                    value={editedItem.country}
                                    onChange={handleDropdownChange(true)}>
                                    <option value="">Select Country</option>
                                    {roleData.map(option => (
                                        <option key={option.id} value={option.name}>{option.countryName}</option>
                                        ))}
                                        disabled
                                    </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Compliance / Standard :</h5>
                                    <select type="text"
                                    // placeholder=""
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                    name="standardId"
                                    value={editedItem.standardName}
                                    onChange={handleDropdownChange(true)}>
                                    <option value="">Select Customer</option>
                                    {standardData.map(option => (
                                        <option key={option.id} value={option.name}>{option.name}</option>
                                        ))}
                                        disabled
                                    </select>
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'40px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Contract Docments:</h5>
                                    <input type="file"
                                    placeholder="Contact Name"
                                    style={{width:'200px',height:'20px',marginLeft:'15px'}}
                                    name="contractDocuments"
                                    value={editedItem.contractDocuments}
                                    onChange={handleChange(true)}
                                  />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Start / Renewal Date:</h5>
                                  <input type="date"
                                    placeholder="Contact Name"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="startOrRenewalDate"
                                    value={editedItem.startOrRenewalDate}
                                    onChange={handleChange(true)}
                                  />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                            </div>                              
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Contract Period:</h5>
                                  <input type="text"
                                    placeholder="Contract Period"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="contractPeriodInMonths"
                                    value={editedItem.contractPeriodInMonths}
                                    onChange={handleChange(true)}
                                    readOnly
                                  />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>End Date:</h5>
                                  <input type="date"
                                    placeholder="End Date"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="endDate"
                                    value={editedItem.endDate}
                                    onChange={handleChange(true)}
                                  />
                              </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'inline-flex',flexDirection:'row',marginTop:'-5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Remarks :</h5>
                                    <input type="text"
                                        placeholder="Remarks"
                                        style={{width:'200px',height:'20px',marginLeft:'35px'}}
                                        name="remarks"
                                        value={editedItem.remarks}
                                        onChange={handleChange(true)}
                                    />
                              </div>
                              <div style={{display:'inline-flex' ,marginLeft:'50px'}}>
                                  <label style={{marginLeft:'10px',fontSize:'17px',fontWeight:'700'}}> Active :</label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="isActive" value={true} style={{marginLeft:'50px'}} onChange={handleChange(true)}/> Yes
                                  </label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="isActive" value={false} style={{marginLeft:'30px'}} onChange={handleChange(true)}/> No
                                  </label>
                              </div>
                              {isSysManager ? (<div>
                                <label style={{marginLeft:'10px',fontSize:'17px',fontWeight:'700'}}> Approved :</label>
                                <input type="checkbox" name="approved" value={true} style={{marginLeft:'50px'}} onChange={handleChange(true)}/> 
                              </div>):''}
                            </div>                            
                             <button type="submit" className="submitbutn" style={{backgroundColor:'#003300',marginLeft:'370px',marginBottom:'50px'}}>Submit</button>
                           </div>
                    </div>
                </form>
            </div>)}

            {showPopup && (
            <div className="responsepopup">
              <p>{message}</p>
              <button className="okbuttonforresponse" onClick={togglepopup}>OK</button>
            </div>
            )}
        </div>
    );
};

export default LicenseManagement;