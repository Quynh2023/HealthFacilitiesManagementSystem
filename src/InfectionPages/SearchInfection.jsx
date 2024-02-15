import React, { useState, useEffect } from 'react';
import NavInfection from '../Components/NavInfection';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/infectionsApi';

const SearchInfection = () => {

  const [searchInfection, setSearchInfection] = useState('');
  const searchQuery = useParams().searchQuery;
  const navigate = useNavigate();

  if (!searchQuery) {
    navigate('/getAllInfections');
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getInfections/${searchQuery}`);
          setSearchInfection(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching infection:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavInfection />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchInfection ? (<div>
        <p><strong>Infection Id:</strong> {searchInfection.InfectionID}</p>
        <p><strong>Employee Id:</strong> {searchInfection.EmployeeID}</p>
        <p><strong>Type:</strong> {searchInfection.Type}</p>
        <p><strong>Date:</strong> {new Date(searchInfection.Date).toLocaleDateString()}</p>
        
        <Link to={`/editInfection/${searchInfection.InfectionID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deleteInfection/${searchInfection.InfectionID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchInfection;