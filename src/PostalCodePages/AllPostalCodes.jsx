import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavPostalCode from '../Components/NavPostalCode';
import { Link } from 'react-router-dom';


const API_URL = 'http://localhost:4000/postalCodesApi';

const AllPostalCodes = () => {
  const [postalCodes, setPostalCodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllPostalCodes`);
        setPostalCodes(response.data);
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [postalCodes]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavPostalCode />
      <div>
        <h5>All Postal Codes</h5>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
          <thead>
            <tr>
              <th>Postal Code ID</th>
              <th>Postal Code</th>
              <th>City</th>
              <th>Province</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {postalCodes.map((postalCode) => (
              <tr key={postalCode.PostalCodeID}>
                <td>{postalCode.PostalCodeID}</td>
                <td>{postalCode.PostalCode}</td>
                <td>{postalCode.City}</td>
                <td>{postalCode.Province}</td>
                <td>
                  <Link to={`/editPostalCode/${postalCode.PostalCodeID}`}>
                    <button style={{ marginRight: '5px', borderWidth: '1px'}}>Edit</button>
                  </Link>
                  <Link to={`/deletePostalCode/${postalCode.PostalCodeID}`}> 
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

export default AllPostalCodes;
