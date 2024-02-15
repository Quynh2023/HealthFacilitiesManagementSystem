import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavInfection from '../Components/NavInfection';
import { Link } from 'react-router-dom';


const API_URL = 'http://localhost:4000/infectionsApi';

const AllInfections = () => {
  const [infections, setInfections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllInfections`);
        setInfections(response.data);
      } catch (error) {
        console.error('Error fetching infections:', error);
      }
    };
    fetchData();
  }, [infections]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavInfection />
      <div>
        <h5>All Infections</h5>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
          <thead>
            <tr>
              <th>Infection ID</th>
              <th>Employee ID</th>
              <th>Type</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {infections.map((infection) => (
              <tr key={infection.InfectionID}>
                <td>{infection.InfectionID}</td>
                <td>{infection.EmployeeID}</td>
                <td>{infection.Type}</td>
                <td>{new Date(infection.Date).toLocaleDateString()}</td>

                <td>
                  <Link to={`/editInfection/${infection.InfectionID}`}>
                    <button style={{ marginRight: '5px', borderWidth: '1px'}}>Edit</button>
                  </Link>
                  <Link to={`/deleteInfection/${infection.InfectionID}`}> 
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

export default AllInfections;
