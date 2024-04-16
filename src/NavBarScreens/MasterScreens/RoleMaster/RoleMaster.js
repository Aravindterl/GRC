import React ,{useState ,useEffect}from "react";
import './RoleMaster.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { BiFirstPage , BiLastPage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Config from "../../../Config";

const RoleMaster = ({isOpen}) =>{
    const [IsClickadd, setIsClickadd] = useState(false);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setmessage] = useState('');

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const [formData, setFormData] = useState({
        roleName: '',
        description: '',
        comments:'',        
        createdBy:'',
        active:'',
        CustomerId:'',
      });
  
      const handleChange =(isEdit) => (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        if(name === "active"){
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

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsClickadd(false);
        const AddingColumn = {
          ...formData,
          CustomerId: parseInt(sessionStorage.getItem('customerid')), // Modify this to your specific needs
          createdBy : parseInt(sessionStorage.getItem('userid'))
        }
        console.log(AddingColumn)
        await fetch(`${Config.apiBaseUrl}/api/RoleMaster`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(AddingColumn)
        })
        .then(response => response.json())
        .then(data => {
          setShowPopup(true);
          setmessage(data.message);

          setTimeout(() => {
            setShowPopup(false);
            window.location.reload();
          }, 4000);
          console.log('Success:', data.message);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      };

      const handleSave = async() => {

        const editedItemWithExtraColumn = {
          ...editedItem,
          CustomerId: parseInt(sessionStorage.getItem('customerid')), // Modify this to your specific needs
          createdBy : parseInt(sessionStorage.getItem('userid'))
        };
        console.log(editedItemWithExtraColumn)

       // http://192.168.29.51:108/api/RoleMaster?Roleid=21
         await fetch(`${Config.apiBaseUrl}/api/RoleMaster?Roleid=${editedItemWithExtraColumn.sysRoleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedItemWithExtraColumn)
        })
        .then(response => {
          if (response.ok) {
           // const newData = data.map(item => (item.sysRoleId === editedItem.sysRoleId ? editedItem : item));
           // setData(newData);
            setSelectedItem(null);
            setEditedItem(null);

            setShowPopup(true);
            response.json().then(data => {
              // Access data properties and set the message state
              setmessage(data.message);
            });
            setTimeout(() => {
              setShowPopup(false);
            }, 4000);
          } else {
            console.error('Failed to update item:', response.status);
          }
        })
        .catch(error => console.error('Error updating item:', error));
      };

      const handleDelete = (sysRoleId) => {
        fetch(`${Config.apiBaseUrl}/api/RoleMaster/${sysRoleId}`, {
          method: 'DELETE',
        })
        .then(response => {
          if (response.ok) {
            setData(prevData => prevData.filter(item => item.sysRoleId !== sysRoleId));
            setShowPopup(true);
            response.json().then(data => {
              // Access data properties and set the message state
              setmessage(data.message);
            });

          setTimeout(() => {
            setShowPopup(false);
          }, 4000);
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
      //http://192.168.29.128:107/api/RoleMasters     
        fetch(`${Config.apiBaseUrl}/api/RoleMaster?CustomerId=${sessionStorage.getItem('customerid')}`)
          .then(response => response.json())
          .then(data => setData(data.data))
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
        window.location.reload();
      };
     
    return(
        <div className={`role ${isOpen ? 'open' : ''}`}>
            <div style={{flexDirection:'row',marginTop:'45px',marginLeft:'25px',height:'90px',backgroundColor:'#DEF5E5',borderRadius:'9px'}}>
                <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'10px'}}>Masters/<span style={{color:'purple'}}>Role</span></label>
                <input
                        type="text"
                        placeholder="Search..."
                        style={{width:'200px',marginLeft:'40px'}}
                        // value={searchQuery}
                        // onChange={handleInputChange}
                    />
                <div className="addnewrole" onClick={toggleArrow}><label style={{fontSize:'15px',color:'white',cursor:'pointer'}}>+ Add New Role</label></div>
            </div>
            <div className="rolemastertable">
                <table style={{marginLeft:'90px'}}>
                    <thead>
                    <tr>                        
                        <th style={{width:'200px'}}>Role Name</th>
                        <th style={{width:'200px'}}>Role Description</th>
                        <th style={{width:'200px'}}>Comments</th>
                        <th style={{width:'100px'}}>Status</th>
                        <th style={{width:'100px'}}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(item => (
                        <tr key={item.sysRoleId}>
                        <td>{item.roleName}</td>
                        <td>{item.description}</td>
                        <td>{item.comments}</td>
                        <td>{item.active === true ? "Yes" : "No"}</td>
                        <td><FiEdit onClick={() => handleEdit(item)} size={15} style={{cursor:'pointer',marginRight:'10px',marginLeft:'10px'}}/>   <MdDeleteForever size={20} style={{cursor:'pointer',color:'red',marginLeft:'10px'}}  onClick={() => handleDelete(item.sysRoleId)}/></td>
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
                            <div style={{display:'inline-flex'}}><label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'-20px',width:'200px'}}>New Role</label><RxCross2  size={35} color="red" style={{marginLeft:'390px',cursor:'pointer'}} onClick={toggleArrow}/></div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'20px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Role Name :</h5>
                                <input type="text"
                                placeholder="Role Name"
                                style={{width:'200px',height:'20px',marginLeft:'100px'}}
                                name="roleName"
                                onChange={handleChange(false)}
                                />
                                {/* {errors.name && <span className="error">{errors.name}</span>} */}
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'10px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Role Description :</h5>
                                <input type="text"
                                placeholder="Role Description"
                                style={{width:'200px',height:'20px',marginLeft:'60px'}}
                                name="description"
                                onChange={handleChange(false)}
                                />
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Comments :</h5>
                                <input type="text"
                                placeholder="Comments"
                                style={{width:'200px',height:'30px',marginLeft:'60px'}}
                                name="comments"
                                onChange={handleChange(false)}
                              />
                            </div>
                            <div style={{display: 'inline-flex'}}>
                                <label style={{marginLeft:'100px',fontSize:'17px',fontWeight:'700'}}> Disable :</label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="active" value="true" style={{marginLeft:'140px'}} onChange={handleChange(false)}/>YES
                                </label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="active" value="false" style={{marginLeft:'30px'}} onChange={handleChange(false)}/>NO
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
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Role Name :</h5>
                                <input type="text"
                                placeholder="Role Name"
                                style={{width:'200px',height:'20px',marginLeft:'100px'}}
                                name="roleName"
                                onChange={handleChange(true)}
                                value={editedItem.roleName}
                                />
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Role Description :</h5>
                                <input type="text"
                                placeholder="Role Description"
                                style={{width:'200px',height:'20px',marginLeft:'60px'}}
                                name="description"
                                onChange={handleChange(true)}
                                value={editedItem.description}
                                />
                            </div>
                            <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                <h5 style={{marginLeft:'100px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Comments :</h5>
                                <input type="text"
                                placeholder="Comments"
                                style={{width:'200px',height:'30px',marginLeft:'60px'}}
                                name="comments"
                                onChange={handleChange(true)}
                                value={editedItem.comments}
                                />
                            </div>
                            <div style={{display: 'inline-flex'}}>
                                <label style={{marginLeft:'100px',fontSize:'17px',fontWeight:'700'}}> Disable :</label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="active" value="true" checked={editedItem.active === true} style={{marginLeft:'140px'}} onChange={handleChange(true)}/>YES
                                </label>
                                <label style={{display: 'inline-flex'}}> 
                                    <input type="radio" name="active" value="false" checked={editedItem.active === false} style={{marginLeft:'30px'}} onChange={handleChange(true)}/>NO
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

export default RoleMaster;