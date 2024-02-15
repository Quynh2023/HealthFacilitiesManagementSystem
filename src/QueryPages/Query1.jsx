import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Components/Nav';


const API_URL = 'http://localhost:4000/queriesApi';

const Query1 = () => {
  const [query1Records, setQuery1Records] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getQuery1`);
        setQuery1Records(response.data);
      } catch (error) {
        console.error('Error fetching query 1:', error);
      }
    };
    fetchData();
  }, [query1Records]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <Nav />
      <div style={{ marginTop: '100px' }}>
        <h4 style={{ marginBottom: '30px' }}>List of facilities with the corresponding number of current employees</h4>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Province</th>
              <th>Phone Number</th>
              <th>Web Address</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>General Manager</th>
              <th>Number of Current employees</th>
            </tr>
          </thead>
          <tbody>
            {query1Records.map((query1Record) => (
              <tr key={query1Record.FacilityName}>
                <td>{query1Record.FacilityName}</td>
                <td>{query1Record.Address}</td>
                <td>{query1Record.City}</td>
                <td>{query1Record.Province}</td>
                <td>{query1Record.PhoneNumber}</td>
                <td>{query1Record.WebAddress}</td>
                <td>{query1Record.Type}</td>
                <td>{query1Record.Capacity}</td>
                <td>{query1Record.GeneralManager}</td>
                <td>{query1Record.NumberOfCurrentEmployees}</td>   
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

export default Query1;
