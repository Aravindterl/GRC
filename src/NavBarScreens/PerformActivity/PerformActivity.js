import React ,{useState ,useEffect }from "react";
import './PerformActivity.css';
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
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Bars ,RotatingLines} from 'react-loader-spinner';
import Nodata from "../../Nodata.jpg";




const PerformActivity = ({isOpen}) =>{
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
    const [isLoading, setIsLoading] = useState(false);


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

      const notify = () => {{
        NotificationManager.success('', message,2000);
      }};

      useEffect(() => {
        if (showPopup) {
            notify();
        }
    }, [showPopup]);

    const handleSave = async () => {
      console.log(editedItem)
      setIsLoading(true);
      setEditedItem(prevState => ({
          ...prevState,
          customerId: parseInt(sessionStorage.getItem('customerid'))         
      }));
  
      try {
          const response = await fetch(`${Config.apiBaseUrl}/api/AssignmentMaster/ForUser/${editedItem.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(editedItem)
          });
  
          if (response.ok) {
              // const newData = data.map(item => (item.id === editedItem.roleId ? editedItem : item));
              // setData(newData);
              setOpen(false);
              setIsLoading(false);
              setSelectedItem(null);
              setEditedItem(null);
            
  
              const data = await response.json();
              // Access data properties and set the message state
              setmessage(data.message);
              setShowPopup(true);
              setTimeout(() => {
                  setShowPopup(false);
              }, 4000);
          } else {
              console.error('Failed to update item:', response.status);
          }
      } catch (error) {
          console.error('Error updating item:', error);
      }
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
        setOpen(true);  
        setSelectedItem(item);
        setEditedItem({ ...item });
      };

    useEffect(() => {
      // https://localhost:7062/api/AssignmentMaster/AssignmentsForUser?CustomerId=1&Userid=11&ComplianceId=1${sessionStorage.getItem('customerid')}${sessionStorage.getItem('userid')}
       let CustomerId = parseInt(sessionStorage.getItem('customerid'));
       let userid = parseInt(sessionStorage.getItem('userId'));
        fetch(`${Config.apiBaseUrl}/api/AssignmentMaster/AssignmentsForUser?CustomerId=${CustomerId}&Userid=${userid}&ComplianceId=1`)
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

      // https://localhost:7062/api/AssignmentMaster/ForUser/2566
    
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
                <label style={{fontSize:'20px',fontWeight:'700',color:"black",marginLeft:'25px',marginTop:'10px'}}>PerformActivity /<span style={{color:'black'}}>Open</span></label>
                <input
                        type="text"
                        placeholder="Search..."
                        style={{width:'200px',marginLeft:'40px'}}
                        // value={searchQuery}
                        // onChange={handleInputChange}
                />
            </div>
            {currentItems.length !== 0 ? <div className="rolemastertable">
                <table style={{borderCollapse:'collapse',width:'800px',marginLeft:'100px'}}>
                    <thead>
                        <tr>
                            <th style={{width:'auto'}}>Activity Name</th>
                            <th style={{width:'auto'}}>Activity Descr</th>
                            <th style={{width:'150px'}}>Doer Comments</th>
                            <th style={{width:'150px'}}>Evidence Details</th>                            
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
                    <DialogTitle style={{fontWeight:'bold'}}>{"Perform Activity"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-slide-description">
                        <div style={{width:'550px'}}>                         
                           <div style={{display:'flex',flexDirection:'row',marginTop:'10px'}}>
                             <label style={{width:'auto',marginRight:'15px'}}>Doer Comments :</label> <TextField
                                                                                                          required
                                                                                                          id="outlined-Required"
                                                                                                          label="Doer Comments"
                                                                                                          placeholder="Doer Comments"   
                                                                                                          name="doerComments"
                                                                                                          onChange={handleChange(true)}
                                                                                                          sx={{ 
                                                                                                            '& .MuiInputBase-root': {
                                                                                                              marginBottom:'10px', alignItems: 'center',justifyContent:'center' // Set the height you want here
                                                                                                            }                                                                                                          
                                                                                                           }} 
                                                                                                          //  InputLabelProps={{
                                                                                                          //   style: { textAlign: 'center' },
                                                                                                          // }}                                                                                                                                                                                                         
                                                                                                          />
                           </div>
                           <div style={{display:'flex',flexDirection:'row'}}>
                             <label style={{width:'auto',marginRight:'15px'}}>Evidence Details :</label><input type='file' style={{width:'auto'}}/>
                           </div>                          
                        </div>

                        
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      {/* <Button onClick={handleClose} style={{backgroundColor:'red'}}>Cancel</Button> */}
                     <Button onClick={handleSave} style={{backgroundColor:'darkgreen',width:'150px',right:'220px',marginBottom:'15px',color:'white'}}> {isLoading ? <RotatingLines 
                                      visible={true}
                                      height="25"
                                      width="25"
                                      color="grey"
                                      strokeColor='white'
                                      strokeWidth="5"
                                      animationDuration="0.75"
                                      ariaLabel="rotating-lines-loading"
                                      wrapperStyle={{}}
                                      wrapperClass=""
                                      /> : <span>Submit</span>}</Button>
                    </DialogActions>
                  </Dialog>
                </React.Fragment>)}
                {showPopup && (
                <NotificationContainer/>
                )}
        </div>
    );
};

export default PerformActivity;