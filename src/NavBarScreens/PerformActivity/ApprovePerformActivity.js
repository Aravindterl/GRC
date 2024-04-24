import React ,{useState ,useEffect }from "react";
import './ApprovePerformActivity.css';
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
import TextField from '@mui/material/TextField';
import Nodata from "../../Nodata.jpg";
import DownloadIcon from '@mui/icons-material/Download';


const ApprovePerformActivity = ({isOpen}) =>{
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
      let CustomerId = parseInt(sessionStorage.getItem('customerid'));
      let userid = parseInt(sessionStorage.getItem('userId'));  
      fetch(`${Config.apiBaseUrl}/api/AssignmentMaster/AssignmentsForApprover?CustomerId=${CustomerId}&Userid=${userid}&ComplianceId=1`)
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
                <label style={{fontSize:'20px',fontWeight:'700',color:"black",marginLeft:'25px',marginTop:'10px'}}>PerformActivity /<span style={{color:'black'}}>Approve</span></label>
                <input
                        type="text"
                        placeholder="Search..."
                        style={{width:'200px',marginLeft:'40px'}}
                        // value={searchQuery}
                        // onChange={handleInputChange}
                />
                {/* <div className="addnewrole" onClick={toggleArrow}><label style={{fontSize:'15px',color:'white',cursor:'pointer',marginTop:'10px'}}>+ Add New Assignment</label></div> */}
            </div>
            {currentItems.length !== 0 ?  <div className="rolemastertable">
                <table style={{borderCollapse:'collapse',width:'800px',marginLeft:'100px'}}>
                    <thead>
                        <tr>
                            <th style={{width:'100px'}}>Activity Name</th>
                            <th style={{width:'100px'}}>Activity Descr</th>
                            <th style={{width:'150px'}}>Doer Comments</th>
                            <th style={{width:'150px'}}>Evidence Details</th>
                            <th style={{width:'150px'}}>Approver Comments</th>
                             {/*<th style={{width:'auto'}}>Evidence Details</th>
                            <th style={{width:'auto'}}>Audit Check</th>
                            <th style={{width:'auto'}}>Status</th>
                            <th style={{width:'auto'}}>Active</th> */}
                            <th style={{width:'150px'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(item => (
                        <tr key={item.id}>
                        <td>{item.activityName}</td>
                        <td>{item.activityDescr}</td>
                        <td style={{textAlign:'center'}}>{item.doerComments === null ? "---" :item.doerComments}</td>
                        <td style={{textAlign:'center'}}>{item.evidenceDetails === null ? "---":item.evidenceDetails}</td>
                        <td style={{textAlign:'center'}}>{item.approverComments === null ? "---":item.approverComments}</td>
                        {/*<td>{item.evidenceDetails}</td>
                        <td>{item.auditCheck}</td>
                        <td>{item.approvalStatus}</td> */}
                        <td><div onClick={() => handleEdit(item)} size={15} style={{cursor:'pointer',marginRight:'10px',marginLeft:'10px',backgroundColor:'#ffbf00',height:'40px',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'10px'}}>Approve Task</div></td>
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
                    <DialogTitle style={{fontWeight:'bold'}}>{"Approve Activity"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        <div style={{width:'550px'}}>      
                        <div style={{display:'flex',flexDirection:'row'}}>
                             <label style={{width:'auto',marginRight:'15px'}}>Activity Name </label><span style={{fontWeight:'bold',color:'black',marginLeft:'80px'}}> : {editedItem.activityName}</span>
                           </div>                   
                           <div style={{display:'flex',flexDirection:'row'}}>
                             <label style={{width:'auto',marginRight:'15px'}}>Doer Comments </label><span style={{fontWeight:'bold',color:'black',marginLeft:'63px'}}> : {editedItem.doerComments}</span>
                           </div>
                           <div style={{display:'flex',flexDirection:'row'}}>
                             <label style={{width:'auto',marginRight:'75px'}}>Evidence Details </label> <b>:</b> &nbsp;<button style={{height:'25px',width:'100px',backgroundColor:'grey',display:'flex',justifyContent:'center',alignItems:'center',border:'1px solid black'}}>View File <DownloadIcon/></button>
                           </div>  
                           <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                           <label style={{width:'auto',marginRight:'45px'}}>Approver Comments </label>  <b>:</b> &nbsp;<TextField
                                                                                                          required
                                                                                                          id="outlined-Required"
                                                                                                          label="Approver Comments"
                                                                                                          placeholder="Approver Comments"   
                                                                                                          name="doerComments"
                                                                                                          onChange={handleChange(true)}
                                                                                                          sx={{ 
                                                                                                            '& .MuiInputBase-root': {
                                                                                                              marginBottom:'10px', alignItems: 'center',justifyContent:'center' // Set the height you want here
                                                                                                            }                                                                                                          
                                                                                                           }}/>
                                                                                                           </div>                      
                        </div>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      {/* <Button onClick={handleClose} style={{backgroundColor:'red'}}>Cancel</Button> */}
                      <Button onClick={handleClose} style={{backgroundColor:'Red',width:'150px',marginBottom:'15px',color:'white',right:'160px'}}>Reject</Button>
                      <Button onClick={handleClose} style={{backgroundColor:'darkgreen',width:'150px',marginBottom:'15px',color:'white',right:'100px'}}>Submit</Button>
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

export default ApprovePerformActivity;