import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Components/Nav';


const API_URL = 'http://localhost:4000/queriesApi';

const Query3 = () => {
  const [query3Records, setQuery3Records] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getQuery3`);
        setQuery3Records(response.data);
      } catch (error) {
        console.error('Error fetching query 3:', error);
      }
    };
    fetchData();
  }, [query3Records]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <Nav />
      <div style={{ marginTop: '100px' }}>
        <h4 style={{ marginBottom: '30px' }}>List of nurses with the most working hours</h4>
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
            {query3Records.map((query3Record) => (
              <tr key={query3Record.Email}>
                <td>{query3Record.FName}</td>
                <td>{query3Record.LName}</td>
                <td>{new Date(query3Record.FirstDayOfWork).toLocaleDateString()}</td>
                <td>{query3Record.Role}</td>
                <td>{new Date(query3Record.DoBirth).toLocaleDateString()}</td>
                <td>{query3Record.Email}</td>
                <td>{query3Record.TotalHours}</td>
                
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

export default Query3;
