import React ,{useState ,useEffect }from "react";
import './UserMaster.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { BiFirstPage , BiLastPage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Config from "../../../Config";

const UserMaster = ({isOpen}) =>{
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
        customerId: '' ,
        createdBy:'',
        status:''
      });

      // {
      //   "name": "string",
      //   "email": "string",
      //   "customerId": 0,
      //   "cliRoleId": 0,
      //   "status": true,
      //   "createdBy": 0
        
        
      // }

    //   = (name) => (e) => 
      const handleChange =(isEdit) => (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        if(name === "status"){
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
        setFormData(prevState => ({
          ...prevState,         
          customerId: parseInt(sessionStorage.getItem('customerid')), 
          createdBy: parseInt(sessionStorage.getItem('userId')) 
        }));
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
        fetch(`${Config.apiBaseUrl}/api/UserMaster?CustomerId=${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setData(data.data),console.log(data))
          .catch(error => console.error('Error fetching data:', error));
      }, [data]);

      useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/RoleMaster/roleslookup?CustomerId=${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setroleData(data))
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
                <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'10px'}}>Masters/<span style={{color:'purple'}}>User</span></label>
                <input
                        type="text"
                        placeholder="Search..."
                        style={{width:'200px',marginLeft:'40px'}}
                        // value={searchQuery}
                        // onChange={handleInputChange}
                    />
                <div className="addnewrole" onClick={toggleArrow}><label style={{fontSize:'15px',color:'white',cursor:'pointer'}}>+ Add New User</label></div>
            </div>
            <div className="rolemastertable">
                <table style={{marginLeft:'120px'}}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th style={{width:'200px'}}>Email</th>
                        {/* <th>PhoneNo</th> */}
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(item => (
                        <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        {/* <td>{item.phoneNo}</td> */}
                        <td>{item.role}</td>
                        <td>{item.status === true ? "Active" : "InActive"}</td>
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
                    <div className="formdiv">
                            <div style={{display:'inline-flex'}}><label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'-20px',width:'200px'}}>New User</label><RxCross2  size={35} color="red" style={{marginLeft:'390px',cursor:'pointer'}} onClick={toggleArrow}/></div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'20px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Role :</h5>
                                <select type="text"
                                // placeholder=""
                                style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'100px',padding:'1px'}}
                                name="cliRoleId"
                                value={selectedValue}
                                onChange={handleChangefordropdown(false)}
                                >
                                <option value="">Select Role</option>
                                {roleData.map(option => (
                                    <option key={option.clientRoleId} value={option.clientRoleId}>{option.roleName}</option>
                                    ))}
                              </select>
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>

                            <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Name :</h5>
                                <input type="text"
                                placeholder="Name"
                                style={{width:'200px',height:'20px',marginLeft:'110px'}}
                                name="name"
                                onChange={handleChange(false)}
                                />
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Email :</h5>
                                <input type="email"
                                placeholder="Email"
                                style={{width:'200px',height:'20px',marginLeft:'80px'}}
                                name="email"
                                onChange={handleChange(false)}
                                />
                            </div>
                            <div style={{display: 'inline-flex'}}>
                                <label style={{marginLeft:'100px',fontSize:'17px',fontWeight:'700'}}> Status :</label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="status" value='true' style={{marginLeft:'140px'}} onChange={handleChange(false)}/>Active
                                </label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="status" value='false' style={{marginLeft:'30px'}} onChange={handleChange(false)}/>Inactive
                                </label>
                            </div>
                        <button type="submit" className="submitbutn" style={{backgroundColor:'#003300',marginLeft:'270px'}}>Submit</button>
                    </div>
                </form>
            </div>):''}
            {selectedItem && (<div className="popup" >
                <form onSubmit={handleSave} >
                    <div className="formdiv">
                            <div style={{display:'inline-flex'}}><label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'-20px',width:'200px'}}>New Role</label><RxCross2  size={35} color="red" style={{marginLeft:'390px',cursor:'pointer'}} onClick={toggleselected}/></div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'20px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Role :</h5>
                                <select type="text"
                                // placeholder=""
                                style={{width:'220px',height:'40px',borderBlockColor:'green',borderRadius:'5px',marginLeft:'100px',padding:'1px'}}
                                name="cliRoleId"
                                value={editedItem.role} 
                                onChange={handleChangefordropdown(true)}
                                >
                                <option value="">Select Role</option>
                                {roleData.map(option => (
                                    <option key={option.clientRoleId} value={option.clientRoleId}>{option.roleName}</option>
                                  ))}
                              </select>
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Name :</h5>
                                <input type="text"
                                placeholder="Name"
                                style={{width:'200px',height:'20px',marginLeft:'110px'}}
                                name="name"
                                onChange={handleChange(true)}
                                value={editedItem.name}
                                />
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Email :</h5>
                                <input type="text"
                                placeholder="Email"
                                style={{width:'200px',height:'20px',marginLeft:'60px'}}
                                name="emailId"
                                onChange={handleChange(true)}
                                value={editedItem.email}
                                readOnly
                                />
                            </div>

                            <div style={{display: 'inline-flex'}}>
                                <label style={{marginLeft:'100px',fontSize:'17px',fontWeight:'700'}}> Status :</label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="status" value="Y" checked={editedItem.status === true}  style={{marginLeft:'140px'}} onChange={handleChange(true)}/>Active
                                </label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="status" value="N" checked={editedItem.status === false} style={{marginLeft:'30px'}} onChange={handleChange(true)}/>Inactive
                                </label>
                            </div>
                        <button type="submit" className="submitbutn" style={{backgroundColor:'#003300',marginLeft:'270px'}}>Submit</button>
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

export default UserMaster;