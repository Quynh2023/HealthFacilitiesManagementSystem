import React, { useState, useEffect } from 'react';
import NavEmployment from '../Components/NavEmployment';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/employmentsApi';

const SearchEmployment = () => {

  const [searchEmployment, setSearchEmployment] = useState('');
  const searchQuery = useParams().searchQuery;
  const navigate = useNavigate();

  if (!searchQuery) {
    navigate('/getAllEmployments');
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getEmployments/${searchQuery}`);
          setSearchEmployment(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching employment:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployment />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchEmployment ? (<div>
        <p><strong>Employment Id:</strong> {searchEmployment.EmploymentID}</p>
        <p><strong>Facility Id:</strong> {searchEmployment.FacilityID}</p>
        <p><strong>Employee Id:</strong> {searchEmployment.EmployeeID}</p>
        <p><strong>Contract Id:</strong> {searchEmployment.ContractID}</p>
        <p><strong>StartDate:</strong> {new Date(searchEmployment.StartDate).toLocaleDateString()}</p>
        <p><strong>EndDate: </strong>{searchEmployment.EndDate ? new Date(searchEmployment.EndDate).toLocaleDateString() : ''}</p>
        

        <Link to={`/editEmployment/${searchEmployment.EmploymentID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deletePostalCode/${searchEmployment.EmploymentID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchEmployment;