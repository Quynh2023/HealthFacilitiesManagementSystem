import React, { useState, useEffect } from 'react';
import NavManager from '../Components/NavManager';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/managersApi';

const SearchManager = () => {

  const [searchManager, setSearchManager] = useState('');
  const searchQuery = useParams().searchQuery;
  const navigate = useNavigate();

  if (!searchQuery) {
    navigate('/getAllManagers');
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getManagers/${searchQuery}`);
          setSearchManager(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching manager:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavManager />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchManager ? (<div>
        <p><strong>Manager Id: </strong> {searchManager.ManagerID}</p>
        <p><strong>Facility Id: </strong> {searchManager.FacilityID}</p>
        <p><strong>Employee Id: </strong> {searchManager.EmployeeID}</p>
        <p><strong>StartDate: </strong> {new Date(searchManager.StartDate).toLocaleDateString()}</p>
        <p><strong>EndDate: </strong>{searchManager.EndDate ? new Date(searchManager.EndDate).toLocaleDateString() : ''}</p>
        
        <Link to={`/editManager/${searchManager.ManagerID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deleteManager/${searchManager.ManagerID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchManager;