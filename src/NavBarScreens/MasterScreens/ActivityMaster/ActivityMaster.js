import React ,{useState ,useEffect }from "react";
import './ActivityMaster.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { BiFirstPage , BiLastPage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Config from "../../../Config";

const ActivityMaster = ({isOpen}) =>{
    const [IsClickadd, setIsClickadd] = useState(false);
    const [data, setData] = useState([]);
    const [doerRoleData, setDoerroleData] = useState([]);
    const [approverRoleData, setApproverroleData] = useState([]);
    const [activityName, setActivityNames] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    //const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState({doer:'',approver:'',activity:''});
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
        cliRoleId: 0,
        name: '',
        email:'',
        phoneNo:'',
        customerId:1,
        createdBy:1,
        status:''
      });
    //   = (name) => (e) => 
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
        console.log(formData)
        fetch(`${Config.apiBaseUrl}/api/UserMaster`, {
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

      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/LookUp/ApproverRolelookup?CustomerId=${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setApproverroleData(data))
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
     
    return(
        <div className={`role ${isOpen ? 'open' : ''}`}>
            <div style={{flexDirection:'row',marginTop:'45px',marginLeft:'25px',height:'90px',backgroundColor:'#DEF5E5',borderRadius:'9px'}}>
                <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'10px'}}>Masters/<span style={{color:'purple'}}>Activity</span></label>
                <input
                        type="text"
                        placeholder="Search..."
                        style={{width:'200px',marginLeft:'40px'}}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                <div className="addnewrole" onClick={toggleArrow}><label style={{fontSize:'15px',color:'white',cursor:'pointer',marginTop:'10px'}}>+ Add New Activity</label></div>
            </div>
            <div className="rolemastertable">
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
                        <td>{item.auditable}</td>
                        <td>{item.active}</td>
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
            </div>
            
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
                                  name="doerRoleId"
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
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'70px'}}
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
                                  name="activityId"
                                  value={selectedValue.activity}
                                  onChange={handleChangefordropdown('activity',false)}>
                                  <option value="">Select Role</option>
                                  {activityName.map(option => (
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
                              <div style={{display: 'inline-flex'}}>
                                <label style={{marginLeft:'50px',fontSize:'17px',fontWeight:'700'}}> Auditable :</label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="auditable" value="Y" style={{marginLeft:'70px'}} onChange={handleChange(false)}/>YES
                                </label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="auditable" value="N" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>NO
                                </label>
                              </div>
                              <div style={{display: 'inline-flex'}}>
                                <label style={{marginLeft:'50px',fontSize:'17px',fontWeight:'700'}}> Status :</label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="status" value="Y" style={{marginLeft:'95px'}} onChange={handleChange(false)}/>Active
                                </label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="status" value="N" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>Inactive
                                </label>
                              </div>
                             <button type="submit" className="submitbutn" style={{backgroundColor:'#003300',marginLeft:'370px',marginBottom:'50px'}}>Submit</button>
                           </div> 
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
            <div className="responsepopup">
              <p>{message}</p>
              <button className="okbuttonforresponse" onClick={togglepopup}>OK</button>
            </div>
            )}
        </div>
    );
};

export default ActivityMaster;