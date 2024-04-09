import React from "react";
import './KnowledgeManagement.css';


const KnowledgeManagement = ({isOpen}) =>{
    
    return(
        <div className={`knowledge ${isOpen ? 'open' : ''}`}>
             Hey there
        </div>
    );
};

export default KnowledgeManagement;