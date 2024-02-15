import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavEmployment from '../Components/NavEmployment';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:4000/employmentsApi';

const AllEmployments = () => {
  const [employments, setEmployments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllEmployments`);
        setEmployments(response.data);
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [employments]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployment />
      <div>
        <h5>All Employments</h5>
        <div className="table-container">
          <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
            <thead>
              <tr>
                <th>Employment ID</th>
                <th>Facility ID</th>
                <th>Employee ID</th>
                <th>Contract ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employments.map((employment) => (
                <tr key={employment.EmploymentID}>
                  <td>{employment.EmploymentID}</td>
                  <td>{employment.FacilityID}</td>
                  <td>{employment.EmployeeID}</td>
                  <td>{employment.ContractID}</td>
                  <td>{new Date(employment.StartDate).toLocaleDateString()}</td>
                  <td>{employment.EndDate ? new Date(employment.EndDate).toLocaleDateString() : ''}</td>
                  <td>
                    <Link to={`/editEmployment/${employment.EmploymentID}`}>
                      <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
                    </Link>
                    <Link to={`/deleteEmployment/${employment.EmploymentID}`}>
                      <button style={{ borderWidth: '1px' }}>Delete</button>
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
              width: 70%
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

export default AllEmployments;
