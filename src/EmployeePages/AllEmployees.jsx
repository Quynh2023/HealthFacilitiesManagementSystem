import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavEmployee from '../Components/NavEmployee';
import { Link } from 'react-router-dom';


const API_URL = 'http://localhost:4000/employeesApi';

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllEmployees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [employees]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployee />
      <div>
        <h5 >All Employees</h5>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '13px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>DateOfBirth</th>
              <th>Medicare#</th>
              <th>Email</th>
              <th>Citizenship</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>PostalCode ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.EmployeeID}>
                <td>{employee.EmployeeID}</td>
                <td>{employee.FName}</td>
                <td>{employee.LName}</td>
                <td>{employee.Role}</td>
                <td>{new Date(employee.DoBirth).toLocaleDateString()}</td>
                <td>{employee.MedicareNumber}</td>
                <td>{employee.Email}</td>
                <td>{employee.Citizenship}</td>
                <td>{employee.PhoneNumber}</td>
                <td>{employee.Address}</td>
                <td>{employee.PostalCodeID}</td>
                
                <td>
                  <Link to={`/editEmployee/${employee.EmployeeID}`}>
                    <button style={{ marginRight: '5px', borderWidth: '1px'}}>Edit</button>
                  </Link>
                  <Link to={`/deleteEmployee/${employee.EmployeeID}`}> 
                    <button style={{borderWidth: '1px'}}>Delete</button> 
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <style>
          {`
            .table-container {
              overflow: auto;
              max-height: 78vh; /* Set a maximum height for the scrolling */
              width: 100%
            }

            .table thead th {
              position: sticky;
              top: 0;
              background-color: #fff; /* Set the background color for the fixed header */
              z-index: 1;
            }
          `}
      </style>
    </div>
  );
};

export default AllEmployees;