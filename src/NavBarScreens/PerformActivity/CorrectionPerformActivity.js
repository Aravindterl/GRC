import React ,{useState ,useEffect }from "react";
import './CorrectionPerformActivity.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { BiFirstPage , BiLastPage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Config from "../../Config";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const CorrectionPerformActivity = ({isOpen}) =>{
    const [IsClickadd, setIsClickadd] = useState(false);
    const [data, setData] = useState([]);
    const [roleData, setroleData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    //const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState();
    const [showPopup, setShowPopup] = useState(false);
    const [message, setmessage] = useState('');

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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

      const handleChangefordropdown =(isEdit)=> (e) => {
        setSelectedValue(e.target.value);
        const { name, value } = e.target;
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
        fetch('${Config.apiBaseUrl}/api/UserMaster', {
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
       // https://localhost:7062/api/AssignmentMaster/ForUser/5633
        fetch(`${Config.apiBaseUrl}/api/AssignmentMaster/ForUser/${editedItem.id}`, {
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

      const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
      });

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
        setOpen(true);  
        setSelectedItem(item);
        setEditedItem({ ...item });
      };

    useEffect(() => {
      // https://localhost:7062/api/AssignmentMaster/AssignmentsForUser?CustomerId=1&Userid=11&ComplianceId=1${sessionStorage.getItem('customerid')}${sessionStorage.getItem('userid')}
        fetch(`${Config.apiBaseUrl}/api/AssignmentMaster/AssignmentsForUser?CustomerId=1&Userid=11&ComplianceId=1`)
          .then(response => response.json())
          .then(data => setData(data.data),console.log(data))
          .catch(error => console.error('Error fetching data:', error));
      }, [data]);

      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/RoleMaster/roleslookup`)
          .then(response => response.json())
          .then(data => setroleData(data))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

      const toggleArrow = () => {
        setIsClickadd(!IsClickadd);
       
      };

      const [open, setOpen] = React.useState(false);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
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
                <label style={{fontSize:'20px',fontWeight:'700',color:"black",marginLeft:'25px',marginTop:'10px'}}>PerformActivity /<span style={{color:'black'}}>Correction</span></label>
                <input
                        type="text"
                        placeholder="Search..."
                        style={{width:'200px',marginLeft:'40px'}}
                        // value={searchQuery}
                        // onChange={handleInputChange}
                />
                <div className="addnewrole" onClick={toggleArrow}><label style={{fontSize:'15px',color:'white',cursor:'pointer',marginTop:'10px'}}>+ Add New Assignment</label></div>
            </div>
            <div className="rolemastertable">
                <table style={{borderCollapse:'collapse',width:'800px',marginLeft:'100px'}}>
                    <thead>
                        <tr>
                            <th style={{width:'auto'}}>Activity Name</th>
                            <th style={{width:'auto'}}>Activity Descr</th>
                            <th style={{width:'150px'}}>Doer Comments</th>
                            <th style={{width:'150px'}}>Evidence Details</th>
                            {/* <th style={{width:'auto'}}>Approver</th>
                            <th style={{width:'auto'}}>Evidence Details</th>
                            <th style={{width:'auto'}}>Audit Check</th>
                            <th style={{width:'auto'}}>Status</th>
                            <th style={{width:'auto'}}>Active</th> */}
                            <th style={{width:'auto'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(item => (
                        <tr key={item.id}>
                        <td>{item.activityName}</td>
                        <td>{item.activityDescr}</td>
                        <td style={{textAlign:'center'}}>{item.doerComments === null ? "---" :item.doerComments}</td>
                        <td style={{textAlign:'center'}}>{item.evidenceDetails === null ? "---":item.evidenceDetails}</td>
                        {/* <td>{item.approver}</td>
                        <td>{item.evidenceDetails}</td>
                        <td>{item.auditCheck}</td>
                        <td>{item.approvalStatus}</td> */}
                        <td><div onClick={() => handleEdit(item)} size={15} style={{cursor:'pointer',marginRight:'10px',marginLeft:'10px',backgroundColor:'#ffbf00',height:'40px',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'10px'}}>Submit Task</div></td>
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
                              <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'30px',width:'200px'}}>New Assignment</label>
                              <RxCross2  size={35} color="red" style={{marginLeft:'590px',cursor:'pointer',marginTop:'30px'}} onClick={toggleArrow}/>
                            </div>
                            <div style={{paddingTop:'10px',overflowY:'auto',height:'calc(100% - 60px)',display:'flex',flexDirection:'column',boxShadow:'inset 0 0 5px rgba(0, 0, 0, 0.5)'}}>
                              <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Activity:</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'100px',padding:'1px'}}
                                  name="cliRoleId"
                                  value={selectedValue}
                                  onChange={handleChangefordropdown(false)}>
                                  <option value="">Select Activity</option>
                                  {roleData.map(option => (
                                      <option key={option.clientRoleId} value={option.clientRoleId}>{option.roleName}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'1px'}}>
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
                                  <option value="">Select Doer</option>
                                  {roleData.map(option => (
                                      <option key={option.clientRoleId} value={option.clientRoleId}>{option.roleName}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>End Date :</h5>
                                    <input type="date"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'70px'}}
                                    name="name"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Start Date :</h5>
                                    <input type="date"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'70px'}}
                                    name="name"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Approval Date:</h5>
                                  <input type="date"
                                  placeholder="Email"
                                  style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                  name="email"
                                  onChange={handleChange(false)}
                                  />
                              </div>
                            </div>
                              
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Approver :</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'70px',padding:'1px'}}
                                  name="cliRoleId"
                                  value={selectedValue}
                                  onChange={handleChangefordropdown(false)}>
                                  <option value="">Select Approver</option>
                                  {roleData.map(option => (
                                      <option key={option.clientRoleId} value={option.clientRoleId}>{option.roleName}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Status :</h5>
                                  <select type="text"
                                  // placeholder=""
                                  style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'70px',padding:'1px'}}
                                  name="cliRoleId"
                                  value={selectedValue}
                                  onChange={handleChangefordropdown(false)}>
                                  <option value="">Select Status</option>
                                  {roleData.map(option => (
                                      <option key={option.clientRoleId} value={option.clientRoleId}>{option.roleName}</option>
                                      ))}
                                </select>
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                            </div>
                             
                              <div style={{display: 'inline-flex',marginTop:'10px'}}>
                                  <label style={{marginLeft:'50px',fontSize:'17px',fontWeight:'700'}}> Auditable :</label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="auditable" value="Y" style={{marginLeft:'70px'}} onChange={handleChange(false)}/>Yes
                                  </label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="auditable" value="N" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>No
                                  </label>
                              </div>
                              <div style={{display: 'inline-flex'}}>
                                  <label style={{marginLeft:'50px',fontSize:'17px',fontWeight:'700'}}> Active :</label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="status" value="Y" style={{marginLeft:'95px'}} onChange={handleChange(false)}/>Yes
                                  </label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="status" value="N" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>No
                                  </label>
                              </div>
                             <button type="submit" className="submitbutn" style={{backgroundColor:'#003300',marginLeft:'370px',marginBottom:'50px'}}>Submit</button>
                           </div>
                    </div>
                </form>
            </div>):''}
            {selectedItem && (<React.Fragment>
                  {/* <Button variant="outlined" onClick={handleClickOpen}>
                    Slide in alert dialog
                  </Button> */}
                  <Dialog
                    open={open}
                    //TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                  >
                    <DialogTitle style={{fontWeight:'bold'}}>{"Perform Activity"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        <div style={{width:'550px'}}>                         
                           <div style={{display:'flex',flexDirection:'row'}}>
                             <label style={{width:'auto',marginRight:'15px'}}>Doer Comments :</label><input type='text' style={{width:'auto'}}/>
                           </div>
                           <div style={{display:'flex',flexDirection:'row'}}>
                             <label style={{width:'auto',marginRight:'15px'}}>Evidence Details :</label><input type='file' style={{width:'auto'}}/>
                           </div>                          
                        </div>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      {/* <Button onClick={handleClose} style={{backgroundColor:'red'}}>Cancel</Button> */}
                      <Button onClick={handleClose} style={{backgroundColor:'darkgreen',width:'150px',right:'220px',marginBottom:'15px',color:'white'}}>Submit</Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>)}
            {showPopup && (
            <div className="responsepopup">
              <p>{message}</p>
              <button className="okbuttonforresponse" onClick={togglepopup}>OK</button>
            </div>
            )}
        </div>
    );
};

export default CorrectionPerformActivity;