import React, { useState, useEffect } from 'react';
import NavEmployee from '../Components/NavEmployee';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:4000/employeesApi';

const SearchFacility = () => {

  const [searchEmployee, setSearchEmployee] = useState('');
  const searchQuery = useParams().searchQuery;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getEmployees/${searchQuery}`);
          setSearchEmployee(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployee />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchEmployee ? (<div>
        <p><strong>Employee Id:</strong> {searchEmployee.EmployeeID}</p>
        <p><strong>First Name:</strong> {searchEmployee.FName}</p>
        <p><strong>Last Name:</strong> {searchEmployee.LName}</p>
        <p><strong>Role:</strong> {searchEmployee.Role}</p>
        <p><strong>Date of Birth:</strong> {new Date(searchEmployee.DoBirth).toLocaleDateString()}</p>
        <p><strong>Medicare Number:</strong> {searchEmployee.MedicareNumber}</p>
        <p><strong>Email:</strong> {searchEmployee.Email}</p>
        <p><strong>Citizenship:</strong> {searchEmployee.Citizenship}</p>
        <p><strong>Phone Number:</strong> {searchEmployee.PhoneNumber}</p>
        <p><strong>Address:</strong> {searchEmployee.Address}</p>
        <p><strong>Postal Code Id:</strong> {searchEmployee.PostalCodeID}</p>
        
        <Link to={`/editEmployee/${searchEmployee.EmployeeID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deleteEmployee/${searchEmployee.EmployeeID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchFacility; 