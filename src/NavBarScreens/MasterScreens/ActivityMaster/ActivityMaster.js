import React ,{useState ,useEffect }from "react";
import './ActivityMaster.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { BiFirstPage , BiLastPage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Config from "../../../Config";
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Nodata from "../../../Nodata.jpg";

const ActivityMaster = ({isOpen}) =>{
    const [IsClickadd, setIsClickadd] = useState(false);
    const [data, setData] = useState([]);
    const [doerRoleData, setDoerroleData] = useState([]);
    const [approverRoleData, setApproverroleData] = useState([]);
    const [activityName, setActivityNames] = useState([]);
    const [triggeractivity, setTriggerActivities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    //const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState({doer:[],approver:[],activity:[]});
    const [showPopup, setShowPopup] = useState(false);
    const [message, setmessage] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const filteredItems = currentItems.filter(item =>
      item.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.activityDescr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doerRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.approverRole.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const [formData, setFormData] = useState({
      activityDescr : '',
      doerRole :'',
      frequencyId:'',
      duration:'',
      refDocumentId:'' || null,
      outputDocumentPath:'' || null,
      triggeringActivityNameId:'' || null,
      approverRole:'',
      helpRef:'' || null,
      isActive:'',
      auditable:'',
      activityNameId:'',
      customerId:''
      });

    //   = (name) => (e) => 
      const handleChange =(isEdit) => (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        if(name === "auditable"){
          updatedValue = value === "true" ? true : false;
        }
        if(name === "isActive"){
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

      const notify = () => {{
        NotificationManager.success('', message);
      }};

      const handleChangefordropdown = (dropdownType, isEdit) => (e) => {
        setSelectedValue(e.target.value);
        const { name, value } = e.target;
        if (isEdit) {
          setEditedItem((prevState) => ({
            ...prevState,
            [name]: parseInt(value),
          }));
        } else {
          setFormData((prevState) => ({
            ...prevState,
            [name]: parseInt(value),
          }));
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        setIsClickadd(false);
        setFormData((prevState) => ({
             ...prevState,
          customerId:parseInt(sessionStorage.getItem('customerid'))
        }));
        console.log(formData)
        fetch(`${Config.apiBaseUrl}/api/ActivityMaster`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
          setmessage(data.message);
          setShowPopup(true);
       
        setTimeout(() => {
          setShowPopup(false);
        }, 4000);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      };

      const handleSave = () => {
        console.log(editedItem)
        fetch(`${Config.apiBaseUrl}/api/UserMaster?Userid=${editedItem.id}`, {
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
        fetch(`${Config.apiBaseUrl}/api/ActivityMaster?CustomerId=${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setData(data.data),console.log(data))
          .catch(error => console.error('Error fetching data:', error));
      }, [data]);

      useEffect(() => { 
        fetch(`${Config.apiBaseUrl}/api/LookUp/DoerRolelookup?CustomerId=${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setDoerroleData(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);
      //https://localhost:7062/api/LookUp/Activitylookup?CustomerId=17
      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/LookUp/ApproverRolelookup?CustomerId=${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setApproverroleData(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/LookUp/Activitylookup?CustomerId=17${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setTriggerActivities(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/LookUp/ActivityNameslookup?CustomerId=${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setActivityNames(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

      const toggleArrow = () => {
        setIsClickadd(!IsClickadd);       
      };

      const toggleselected = () => {
        setSelectedItem(null);
    };

    const togglepopup = () => {
      setShowPopup(false);
    };

    
    useEffect(() => {
      if (showPopup) {
          notify();
      }
     }, [showPopup]);
    
    return(
        <div className={`role ${isOpen ? 'open' : ''}`}>
            <div style={{flexDirection:'row',marginTop:'45px',marginLeft:'25px',height:'90px',backgroundColor:'#DEF5E5',borderRadius:'9px'}}>
                <label style={{fontSize:'20px',fontWeight:'700',color:"black",marginLeft:'25px',marginTop:'10px'}}>Masters/<span style={{color:'black'}}>Activity</span></label>
                <input
                        type="text"
                        placeholder="Search..."
                        style={{width:'200px',marginLeft:'40px'}}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                <div className="addnewrole" onClick={toggleArrow}><label style={{fontSize:'15px',color:'white',cursor:'pointer',marginTop:'10px'}}>+ Add New Activity</label></div>
            </div>  
            {currentItems.length !== 0 ?  <div className="rolemastertable">
                <table style={{borderCollapse:'collapse',width:'1430px'}}>
                    <thead>
                        <tr>
                            <th style={{width:'100px'}}>Activity Name</th>
                            <th style={{width:'auto'}}>Activity Desc</th>
                            <th style={{width:'auto'}}>Doer</th>
                            <th style={{width:'auto'}}>Frequency</th>
                            <th style={{width:'auto'}}>Duration</th>
                            <th style={{width:'auto'}}>Approver</th>
                            <th style={{width:'auto'}}>RefDocument</th>
                            <th style={{width:'auto'}}>OutputDocument</th>
                            <th style={{width:'auto'}}>TriggeringActivity</th>
                            <th style={{width:'auto'}}>Auditable</th>
                            <th style={{width:'auto'}}>Status</th>
                            <th style={{width:'auto'}}>Action</th>
                            {/* <th style={{width:'auto'}}>Action</th> */}
                        </tr>
                    </thead>
                    <tbody>
                    {filteredItems.map(item => (
                        <tr key={item.id}>
                        <td>{item.activityName}</td>
                        <td>{item.activityDescr}</td>
                        <td>{item.doerRole}</td>
                        <td>{item.frequency}</td>
                        <td>{item.duration}</td>
                        <td>{item.approverRole}</td>
                        <td>{item.refDocument}</td>
                        <td>{item.outputDocument}</td>
                        <td>{item.triggeringActivity}</td>
                        <td>{item.auditable === true ? "Yes":"No"}</td>
                        <td>{item.active === true ? "Yes":"No"}</td>
                        {/* <td>{item.disable}</td> */}
                        <td><FiEdit onClick={() => handleEdit(item)} size={15} style={{cursor:'pointer',marginRight:'10px',marginLeft:'10px'}}/>   <MdDeleteForever size={20} style={{cursor:'pointer',color:'red',marginLeft:'10px'}}  onClick={() => handleDelete(item.id)}/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} style={{width:'30px',backgroundColor:'transparent'}}><BiFirstPage size={20} color="black"/></button>
                <span style={{border:'1px solid black',borderRadius:'5px',padding:'5px'}}>{currentPage}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= data.length} style={{width:'30px',backgroundColor:'transparent'}}><BiLastPage size={20} color="black"/></button>
            </div>
            </div>: <div style={{display:'flex',alignContent:'center',justifyContent:'center',backgroundColor:'white'}}><img src={Nodata} style={{marginTop:'25px',marginLeft:'-39px',borderRadius:'10px'}}/></div>}
            
            {IsClickadd ? (<div className="popup" >
                <form onSubmit={handleSubmit} >
                    <div className="assignformdiv">
                            <div style={{display:'inline-flex',zindex: '1000'}}>
                              <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'30px',width:'200px'}}>New Activity</label>
                              <RxCross2  size={35} color="red" style={{marginLeft:'590px',cursor:'pointer',marginTop:'30px'}} onClick={toggleArrow}/>
                            </div>
                            <div style={{paddingTop:'10px',overflowY:'auto',height:'calc(100% - 60px)',display:'flex',flexDirection:'column',boxShadow:'inset 0 0 5px rgba(0, 0, 0, 0.5)'}}>
                              <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Activity Name :</h5>
                                    <select type="text"
                                    style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'40px',padding:'1px'}}
                                    name="activityNameId"
                                    value={selectedValue.activity}
                                    onChange={handleChangefordropdown('activity',false)}>
                                    <option value="">Select Activity</option>
                                    {activityName.map(option => (
                                        <option key={option.activityId} value={option.activityId}>{option.activityName}</option>
                                        ))}
                                </select>                            

                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Activity Descr :</h5>
                                    <input type="text"
                                    placeholder="Activity Descr"
                                    style={{width:'200px',height:'20px',marginLeft:'50px'}}
                                    name="activityDescr"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Doer:</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'120px',padding:'1px'}}
                                  name="doerRole"
                                  value={selectedValue.doer}
                                  onChange={handleChangefordropdown('doer',false)}>
                                  <option value="">Select Role</option>
                                  {doerRoleData.map(option => (
                                      <option key={option.doerRoleId} value={option.doerRoleId}>{option.doerRole}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Frequency :</h5>
                                    <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'40px',padding:'1px'}}
                                  name="frequencyId"
                                  value={selectedValue.frequency}
                                  onChange={handleChangefordropdown('frequency',false)}>
                                  <option value="">Select Frequency</option>
                                  <option value="1">Monthly</option>
                                  <option value="2">Quarterly</option>
                                  <option value="3">Yearly</option>
                                </select>
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Duration :</h5>
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'90px'}}
                                    name="duration"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Approver:</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'70px',padding:'1px'}}
                                  name="approverRole"
                                  value={selectedValue.approver}
                                  onChange={handleChangefordropdown('approver',false)}>
                                  <option value="">Select Role</option>
                                  {approverRoleData.map(option => (
                                      <option key={option.approverRoleId} value={option.approverRoleId}>{option.approverRole}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                            </div>
                              
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Triggering Activity:</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                  name="triggeringActivityNameId"
                                  value={selectedValue.triggeractivity}
                                  onChange={handleChangefordropdown('triggeractivity',false)}>
                                  <option value="">Select Role</option>
                                  {triggeractivity.map(option => (
                                      <option key={option.activityId} value={option.activityId}>{option.activityName}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Ref Document:</h5>
                                  <input type="file"
                                  placeholder="Email"
                                  style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                  name="refDocumentId"
                                  onChange={handleChange(false)}
                                  />
                              </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Help Ref Docs :</h5>
                                    <input type="file"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="helpRef"
                                    onChange={handleChange(false)}
                                    />
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Output Document:</h5>
                                  <input type="file"                                  
                                  style={{width:'200px',height:'20px',marginLeft:'25px'}}
                                  name="outputDocumentPath"
                                  onChange={handleChange(false)}
                                  />
                              </div>
                            </div>                             
                              <div style={{display: 'inline-flex'}}>
                                <label style={{marginLeft:'50px',fontSize:'17px',fontWeight:'700'}}> Auditable :</label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="auditable" value="true" style={{marginLeft:'70px'}} onChange={handleChange(false)}/>YES
                                </label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="auditable" value="false" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>NO
                                </label>
                              </div>
                              <div style={{display: 'inline-flex'}}>
                                <label style={{marginLeft:'50px',fontSize:'17px',fontWeight:'700'}}> Status :</label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="isActive" value="true" style={{marginLeft:'95px'}} onChange={handleChange(false)}/>Active
                                </label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="isActive" value="false" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>Inactive
                                </label>
                              </div>
                           </div> 
                           <button type="submit" className="submitbutn" style={{backgroundColor:'#003300',marginLeft:'370px',marginBottom:'50px'}}>Submit</button>
                    </div>
                </form>
            </div>):''}
            {selectedItem && (<div className="popup" >
              <form onSubmit={handleSave}>
                <div className="assignformdiv">
                            <div style={{display:'inline-flex',zindex: '1000'}}>
                              <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'30px',width:'200px'}}>New Activity</label>
                              <RxCross2  size={35} color="red" style={{marginLeft:'590px',cursor:'pointer',marginTop:'30px'}} onClick={toggleselected}/>
                            </div>
                            <div style={{paddingTop:'10px',overflowY:'auto',height:'calc(100% - 60px)',display:'flex',flexDirection:'column',boxShadow:'inset 0 0 5px rgba(0, 0, 0, 0.5)'}}>
                              <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Activity Name :</h5>
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'50px'}}
                                    name="name"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Activity Descr :</h5>
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'50px'}}
                                    name="name"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Doer:</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'120px',padding:'1px'}}
                                  name="cliRoleId"
                                  value={selectedValue}
                                  onChange={handleChangefordropdown(false)}>
                                  <option value="">Select Role</option>
                                  {doerRoleData.map(option => (
                                      <option key={option.clientRoleId} value={option.clientRoleId}>{option.roleName}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Frequency :</h5>
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'90px'}}
                                    name="name"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Duration :</h5>
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'90px'}}
                                    name="name"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Approver:</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'70px',padding:'1px'}}
                                  name="approverRoleId"
                                  value={selectedValue}
                                  onChange={handleChangefordropdown(false)}>
                                  <option value="">Select Role</option>
                                  {approverRoleData.map(option => (
                                      <option key={option.approverRoleId} value={option.approverRoleId}>{option.approverRole}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                            </div>
                              
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Triggering Activity:</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'20px',padding:'1px'}}
                                  name="cliRoleId"
                                  value={selectedValue}
                                  onChange={handleChangefordropdown(false)}>
                                  <option value="">Select Role</option>
                                  {doerRoleData.map(option => (
                                      <option key={option.clientRoleId} value={option.clientRoleId}>{option.roleName}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Ref Document:</h5>
                                  <input type="file"
                                  placeholder="Email"
                                  style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                  name="email"
                                  onChange={handleChange(false)}
                                  />
                              </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Help Ref Docs :</h5>
                                    <input type="file"
                                    placeholder="Email"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="email"
                                    onChange={handleChange(false)}
                                    />
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Output Document:</h5>
                                  <input type="file"
                                  placeholder="Email"
                                  style={{width:'200px',height:'20px',marginLeft:'25px'}}
                                  name="email"
                                  onChange={handleChange(false)}
                                  />
                              </div>
                        </div>
                        <div>
                            <label style={{marginLeft:'50px', fontSize:'17px', fontWeight:'700'}}> Auditable :</label>
                            <label> 
                                <input type="radio" name="auditable" value="Y" style={{marginLeft:'70px'}} onChange={handleChange(false)}/>YES
                            </label>
                            <label> 
                                <input type="radio" name="auditable" value="N" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>NO
                            </label>
                        </div>
                        <div>
                            <label style={{marginLeft:'50px', fontSize:'17px', fontWeight:'700'}}> Status :</label>
                            <label> 
                                <input type="radio" name="status" value="Y" style={{marginLeft:'95px'}} onChange={handleChange(false)}/>Active
                            </label>
                            <label> 
                                <input type="radio" name="status" value="N" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>Inactive
                            </label>
                        </div>
                          <button type="submit" className="submitbutn" style={{backgroundColor:'#003300',marginLeft:'370px',marginBottom:'50px'}}>Submit</button>
                        </div>
                    </div>
                </form>
            </div>)}
            {showPopup && (
             <NotificationContainer/>
            )}
        </div>
    );
};

export default ActivityMaster;