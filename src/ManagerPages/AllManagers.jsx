import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavManager from '../Components/NavManager';
import { Link } from 'react-router-dom';


const API_URL = 'http://localhost:4000/managersApi';

const AllManagers = () => {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllManagers`);
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [managers]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavManager />
      <div>
        <h5>All Managers</h5>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
          <thead>
            <tr>
              <th>Manager ID</th>
              <th>Facility ID</th>
              <th>Employee ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager.ManagerID}>
                <td>{manager.ManagerID}</td>
                <td>{manager.FacilityID}</td>
                <td>{manager.EmployeeID}</td>
                <td>{new Date(manager.StartDate).toLocaleDateString()}</td>
                <td>{manager.EndDate ? new Date(manager.EndDate).toLocaleDateString() : ''}</td>

                <td>
                  <Link to={`/editManager/${manager.ManagerID}`}>
                    <button style={{ marginRight: '5px', borderWidth: '1px'}}>Edit</button>
                  </Link>
                  <Link to={`/deleteManager/${manager.ManagerID}`}> 
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

export default AllManagers;
