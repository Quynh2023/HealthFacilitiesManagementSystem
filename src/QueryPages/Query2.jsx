import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Components/Nav';


const API_URL = 'http://localhost:4000/queriesApi';

const Query2 = () => {
  const [query2Records, setQuery2Records] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getQuery2`);
        setQuery2Records(response.data);
      } catch (error) {
        console.error('Error fetching query 2:', error);
      }
    };
    fetchData();
  }, [query2Records]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <Nav />
      <div style={{ marginTop: '100px' }}>
        <h4 style={{ marginBottom: '30px' }}>List of doctors and nurses infected 3 or more times by COVID-19</h4>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>First Day of Work</th>
              <th>Role</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Total Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {query2Records.map((query2Record) => (
              <tr key={query2Record.Email}>
                <td>{query2Record.FName}</td>
                <td>{query2Record.LName}</td>
                <td>{new Date(query2Record.FirstDayOfWork).toLocaleDateString()}</td>
                <td>{query2Record.Role}</td>
                <td>{new Date(query2Record.DoBirth).toLocaleDateString()}</td>
                <td>{query2Record.Email}</td>
                <td>{query2Record.TotalHours}</td>
                
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
              max-height: 85vh; /* Set a maximum height for the scrolling */
              width: 99%
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

export default Query2;