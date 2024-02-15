import React, { useState, useEffect } from 'react';
import NavEmailLog from '../Components/NavEmailLog';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/emailLogsApi';

const SearchEmailLog = () => {

  const [searchEmailLog, setSearchEmailLog] = useState('');
  const searchQuery = useParams().searchQuery;
  const navigate = useNavigate();

  if (!searchQuery) {
    navigate('/getAllEmailLogs');
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getEmailLogs/${searchQuery}`);
          setSearchEmailLog(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching vaccine:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmailLog />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchEmailLog ? (<div>
        <p><strong>EmailLog Id:</strong> {searchEmailLog.EmailLogID}</p>
        <p><strong>Facility Id:</strong> {searchEmailLog.FacilityID}</p>
        <p><strong>Employee Id:</strong> {searchEmailLog.EmployeeID}</p>
        <p><strong>Date:</strong> {new Date(searchEmailLog.Date).toLocaleDateString()}</p>
        <p><strong>Subject:</strong> {searchEmailLog.Subject}</p>
        <p><strong>Body:</strong> {searchEmailLog.Body}</p>
        
        <Link to={`/editEmailLog/${searchEmailLog.EmailLogID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deleteEmailLog/${searchEmailLog.EmailLogID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchEmailLog;