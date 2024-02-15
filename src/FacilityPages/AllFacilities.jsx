import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavFacility from '../Components/NavFacility';
import { Link } from 'react-router-dom';


const API_URL = 'http://localhost:4000/facilitiesApi';

const AllFacilities = () => {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllFacilities`);
        setFacilities(response.data);
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [facilities]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavFacility />
      <div >
        <h5 >All Facilities</h5>
        <div className="table-container">
          <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
            <thead>
              <tr>
                <th>Facility ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Postal Code ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.FacilityID}>
                  <td>{facility.FacilityID}</td>
                  <td>{facility.Name}</td>
                  <td>{facility.Type}</td>
                  <td>{facility.Capacity}</td>
                  <td>{facility.PhoneNumber}</td>
                  <td>{facility.Address}</td>
                  <td>{facility.PostalCodeID}</td>
                  <td>
                    <Link to={`/editFacility/${facility.FacilityID}`}>
                      <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
                    </Link>
                    <Link to={`/deleteFacility/${facility.FacilityID}`}>
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
              width: 90%
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

export default AllFacilities;
