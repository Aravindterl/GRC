import React ,{useState ,useEffect }from "react";
import './CreateAssignments.css';
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { BiFirstPage , BiLastPage } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Config from "../../../../Config";

const CreateAssignments = ({isOpen}) =>{
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
        fetch(`${Config.apiBaseUrl}/api/CompliancePeriod/CreateAssignmentsForComplincePeriod?CustomerId=${parseInt(sessionStorage.getItem('customerid'))}&ComplainceId=${editedItem.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // body: JSON.stringify(formData)
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

      const handleEdit = async (item) => {
        setSelectedItem(item);
        setEditedItem(prevItem => ({ ...prevItem, ...item }));
        let value = editedItem.id;
      
        try {
          const response = await fetch(`${Config.apiBaseUrl}/api/CompliancePeriod/CreateAssignmentsForComplincePeriod?CustomerId=${parseInt(sessionStorage.getItem('customerid'))}&ComplainceId=${value}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify()
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          setmessage(data.message);
          if(response.ok){
            setShowPopup(true);
          }

          setTimeout(() => {
            setShowPopup(false);
          }, 4000);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      

    useEffect(() => {
        fetch(`${Config.apiBaseUrl}/api/CompliancePeriod?CustomerId=${parseInt(sessionStorage.getItem('customerid'))}`)
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
                <label style={{fontSize:'20px',fontWeight:'700',color:"red",marginLeft:'25px',marginTop:'10px'}}>Create Assignments</label>
                <input
                      type="text"
                      placeholder="Search..."
                      style={{width:'200px',marginLeft:'40px'}}
                      // value={searchQuery}
                      // onChange={handleInputChange}
                  />
            </div>
            <div className="rolemastertable">
                <table>
                    <thead>
                    <tr>
                        <th>Standard</th>
                        <th style={{width:'200px'}}>StartDate</th>
                        <th>EndDate</th>
                        <th>Open Status</th>
                        <th>Active</th>
                        <th>Assignments</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map(item => (
                        <tr key={item.id}>
                        <td>{item.standardname}</td>
                        <td>{item.complStartDate}</td>
                        <td>{item.complEndDate}</td>
                        <td>{item.isOpen === true ? "Open" : "Close"}</td>
                        <td>{item.isActive === true ? "Yes" : "No"}</td>
                        {/* <td>{item.disable}</td> */}
                        {/* <MdDeleteForever size={20} style={{cursor:'pointer',color:'red',marginLeft:'10px'}}  onClick={() => handleDelete(item.id)}/> */}
                        <td>{item.isAssignmentCreated ? (<div style={{cursor:'default',marginRight:'10px',marginLeft:'10px',backgroundColor:'green' , color:'white' , height:'40px' , width:'100px' , justifyContent:'center',alignItems:'center',display:'flex' , borderRadius:'5px'}}>Created</div>) : (<button style={{cursor:'pointer',marginRight:'10px',marginLeft:'10px',backgroundColor:'#ffbf00' , color:'white' , height:'40px' , width:'100px' , justifyContent:'center',alignItems:'center',display:'flex' , borderRadius:'5px'}}  onClick={() => handleEdit(item)}>Create </button>)}</td>
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

            {showPopup && (
            <div className="responsepopup">
              <p>{message}</p>
              <button className="okbuttonforresponse" onClick={togglepopup}>OK</button>
            </div>
            )}
        </div>
    );
};

export default CreateAssignments;