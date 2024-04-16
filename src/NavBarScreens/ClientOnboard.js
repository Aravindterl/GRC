import React ,{useState ,useEffect }from "react";
import '../NavBarScreens/ClientOnboard.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { BiFirstPage , BiLastPage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Config from "../Config";

const ClientOnboard = ({isOpen}) =>{
    const [IsClickadd, setIsClickadd] = useState(false);
    const [data, setData] = useState([]);
    const [roleData, setroleData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [errors] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState(null);
    //const [options, setOptions] = useState([]);
    // const [selectedValue, setSelectedValue] = useState();
    const [showPopup, setShowPopup] = useState(false);
    const [message, setmessage] = useState('');

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const [formData, setFormData] = useState({
        customerName: '',
        street:'',
        city:'',
        state:'',
        contactName:'',
        contactEmail:'',
        description:'',
        contactPhone:'',
        createdBy:1,        
        country: '',
        isActive:true
      });
    //   = (name) => (e) => 
      const handleChange = (isEdit) => (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
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

      const handleChangefordropdown =(isEdit)=> (e) => {
        // setSelectedValue(e.target.value);
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
        try{
          fetch(`${Config.apiBaseUrl}/api/CustomerMaster`, {
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

      const removeItem = (keyToRemove) => {
        const updatedEditedItem = { ...editedItem };
        delete updatedEditedItem[keyToRemove];
        setEditedItem(null);
        setEditedItem(updatedEditedItem);
      };
      

      const handleSave = () => {
      
        removeItem('customerName');
        removeItem('createdBy');
        removeItem('createdDateTime');
        console.log(editedItem)
        fetch(`${Config.apiBaseUrl}/api/CustomerMaster?CustomerId=${editedItem.customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedItem)
        })
        .then(response => {
          if (response.ok) {
            const newData = data.map(item => (item.customerId === editedItem.customerId ? editedItem : item));
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
                const response = await fetch(`${Config.apiBaseUrl}/api/CustomerMaster`);
                const data = await response.json();
                setData(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [data]);

      // useEffect(() => {
      //   fetch('${Config.apiBaseUrl}/api/LookUp/CountryMasterlookup')
      //     .then(response => response.json())
      //     .then(data => setroleData(data))
      //     .catch(error => console.error('Error fetching data:', error));
      // }, []);

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
                <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'10px'}}>ClientManagement/<span style={{color:'purple'}}>Client Onboarding</span></label>
                <input
                    type="text"
                    placeholder="Search..."
                    style={{width:'200px',marginLeft:'40px'}}
                    // value={searchQuery}
                    // onChange={handleInputChange}
                />
                <div className="addnewrole" onClick={toggleArrow}><label style={{fontSize:'15px',color:'white',cursor:'pointer',marginTop:'10px'}}>+ Add New Client</label></div>
            </div>
            <div className="rolemastertable">
                <table style={{borderCollapse:'collapse',width:'1210px'}}>
                    <thead>
                        <tr>
                            <th style={{width:'150px'}}>Customer Name</th>
                            <th style={{width:'130px'}}>City</th>
                            <th style={{width:'130px'}}>Address</th>
                            <th style={{width:'130px'}}>State</th>
                            <th style={{width:'170px'}}>Country of Operation</th>
                            <th style={{width:'150px'}}>Contact Name</th>
                            <th style={{width:'130px'}}>Phone Number</th>
                            <th style={{width:'120px'}}>Email Id</th>
                            <th style={{width:'100px'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(item => (
                        <tr key={item.customerId}>
                        <td>{item.customerName}</td>
                        <td>{item.city}</td>
                        <td>{item.street}</td>
                        <td>{item.state}</td>
                        <td>{item.country}</td>
                        <td>{item.contactName}</td>
                        <td>{item.contactPhone}</td>
                        <td>{item.contactEmail}</td>
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
                              <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'30px',width:'200px'}}>New Client</label>
                              <RxCross2  size={35} color="red" style={{marginLeft:'590px',cursor:'pointer',marginTop:'30px'}} onClick={toggleArrow}/>
                            </div>
                            <div style={{paddingTop:'10px',overflowY:'auto',height:'calc(100% - 60px)',display:'flex',flexDirection:'column',boxShadow:'inset 0 0 5px rgba(0, 0, 0, 0.5)'}}>
                              <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Customer Name :</h5>
                                    <input type="text"
                                    placeholder="Customer Name"
                                    style={{width:'200px',height:'20px',marginLeft:'50px'}}
                                    name="customerName"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>City :</h5>
                                    <input type="text"
                                    placeholder="City"
                                    style={{width:'200px',height:'20px',marginLeft:'50px'}}
                                    name="city"
                                    onChange={handleChange(false)}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Address:</h5>
                                  <input type="text"
                                    placeholder="Address"
                                    style={{width:'200px',height:'20px',marginLeft:'90px'}}
                                    name="street"                                    
                                    onChange={handleChange(false)}
                                    />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>State :</h5>
                                    <input type="text"
                                    placeholder="State"
                                    style={{width:'200px',height:'20px',marginLeft:'90px'}}
                                    name="state"                                   
                                    onChange={handleChange(false)}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Country / Origin :</h5>
                                    <input type="text"
                                    placeholder="Country"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="country"
                                    onChange={handleChange(false)}
                                  />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Contact Name:</h5>
                                  <input type="text"
                                    placeholder="Contact Name"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="contactName"
                                    onChange={handleChange(false)}
                                  />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                            </div>
                              
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Phone No:</h5>
                                  <input type="text"
                                    placeholder="Phone No"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="contactPhone"
                                    onChange={handleChange(false)}
                                  />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Email Id:</h5>
                                  <input type="email"
                                    placeholder="Email"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="contactEmail"
                                    onChange={handleChange(false)}
                                  />
                              </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'inline-flex',flexDirection:'row',marginTop:'-5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Description :</h5>
                                    <input type="text"
                                        placeholder="Description"
                                        style={{width:'200px',height:'20px',marginLeft:'35px'}}
                                        name="description"
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
                              <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'30px',width:'200px'}}>New Client</label>
                              <RxCross2  size={35} color="red" style={{marginLeft:'590px',cursor:'pointer',marginTop:'30px'}} onClick={toggleselected}/>
                            </div>
                            <div style={{paddingTop:'10px',overflowY:'auto',height:'calc(100% - 60px)',display:'flex',flexDirection:'column',boxShadow:'inset 0 0 5px rgba(0, 0, 0, 0.5)'}}>
                              <div style={{display:'flex',flexDirection:'row'}}>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>Customer Name :</h5>
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'50px',backgroundColor:'lightgrey'}}
                                    name="customerName"
                                    value={editedItem.customerName}
                                    onChange={handleChange(true)}
                                    readOnly
                                    />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'15px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}>City :</h5>
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'50px'}}
                                    name="city"
                                    value={editedItem.city}
                                    onChange={handleChange(true)}
                                    />
                                </div>
                            </div>

                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Address:</h5>
                                  <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'90px'}}
                                    name="street"
                                    value={editedItem.street}
                                    onChange={handleChange(true)}
                                    />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>State :</h5>
                                    <input type="text"
                                    placeholder="Name"
                                    style={{width:'200px',height:'20px',marginLeft:'90px'}}
                                    name="state"
                                    value={editedItem.state}
                                    onChange={handleChange(true)}
                                    />
                                </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Country / Origin :</h5>
                                    <input type="text"
                                    placeholder="Contact Name"
                                    style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                    name="country "
                                    value={editedItem.country}
                                    onChange={handleChange(true)}
                                  />
                                </div>
                                <div style={{display:'flex',flexDirection:'row',marginTop:'5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Contact Name:</h5>
                                  <input type="text"
                                  placeholder="Email"
                                  style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                  name="contactName"
                                  value={editedItem.contactName}
                                  onChange={handleChange(true)}
                                  />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                            </div>
                              
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'10px'}}> Phone No:</h5>
                                  <input type="text"
                                  placeholder="Contact Phone"
                                  style={{width:'200px',height:'20px',marginLeft:'45px'}}
                                  name="contactPhone"
                                  value={editedItem.contactPhone}
                                  onChange={handleChange(true)}
                                  />
                                  {errors.name && <span className="error">{errors.name}</span>}
                              </div>
                              <div style={{display:'flex',flexDirection:'row',marginTop:'-5px'}}>
                                  <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Email Id:</h5>
                                  <input type="email"
                                  placeholder="Email"
                                  style={{width:'200px',height:'20px',marginLeft:'45px',backgroundColor:'lightgrey'}}
                                  name="contactEmail"
                                  value={editedItem.contactEmail}
                                  onChange={handleChange(true)}
                                  readOnly
                                  />
                              </div>
                            </div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                              <div style={{display:'inline-flex',flexDirection:'row',marginTop:'-5px'}}>
                                    <h5 style={{marginLeft:'50px',fontFamily:'sans-serif',fontSize:'15px',marginTop:'5px'}}>Description :</h5>
                                    <input type="text"
                                    placeholder="Description"
                                    style={{width:'200px',height:'20px',marginLeft:'35px'}}
                                    name="description"
                                    value={editedItem.description}
                                    onChange={handleChange(true)}
                                    />
                              </div>
                              <div style={{display:'inline-flex' ,marginLeft:'50px'}}>
                                  <label style={{marginLeft:'10px',fontSize:'17px',fontWeight:'700'}}> Active :</label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="isActive" value='true' checked={editedItem.isActive === true}  style={{marginLeft:'50px'}} onChange={handleChange(true)}/> Yes
                                  </label>
                                  <label style={{display: 'inline-flex'}}> 
                                      <input type="radio" name="isActive" value='false' checked={editedItem.isActive === false} style={{marginLeft:'30px'}} onChange={handleChange(true)}/> No
                                  </label>
                              </div>
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

export default ClientOnboard;