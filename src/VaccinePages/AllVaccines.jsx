import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavVaccine from '../Components/NavVaccine';
import { Link } from 'react-router-dom';


const API_URL = 'http://localhost:4000/vaccinesApi';

const AllVaccines = () => {
  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllVaccines`);
        setVaccines(response.data);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };
    fetchData();
  }, [vaccines]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavVaccine />
      <div>
        <h5>All Vaccines</h5>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
          <thead>
            <tr>
              <th>Vaccine ID</th>
              <th>Employee ID</th>
              <th>Facility ID</th>
              <th>Type</th>
              <th>Dose Number</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccines.map((vaccine) => (
              <tr key={vaccine.VaccineID}>
                <td>{vaccine.VaccineID}</td>
                <td>{vaccine.EmployeeID}</td>
                <td>{vaccine.FacilityID}</td>
                <td>{vaccine.Type}</td>
                <td>{vaccine.DoseNumber}</td>
                <td>{new Date(vaccine.Date).toLocaleDateString()}</td>

                <td>
                  <Link to={`/editVaccine/${vaccine.VaccineID}`}>
                    <button style={{ marginRight: '5px', borderWidth: '1px'}}>Edit</button>
                  </Link>
                  <Link to={`/deleteVaccine/${vaccine.VaccineID}`}> 
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

export default AllVaccines;
