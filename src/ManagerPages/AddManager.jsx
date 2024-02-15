import React, { useState } from 'react';
import axios from 'axios';
import NavEmployment from '../Components/NavEmployment';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/managersApi';

const AddManager = () => {
  const [facilityId, setFacilityId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(null);
  
  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!facilityId || !employeeId || !startDate) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addManager`, {
        FacilityID:facilityId,
        EmployeeID:employeeId,
        StartDate: startDate,
        EndDate: endDate
      });

      alert("Manager added successfully");
      navigate('/getAllManagers');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id or end date > start date or manager must be administrative personnel");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployment />
      <h5>Add new manager</h5>
      <form>
        <div>
          <label htmlFor="facilityId">Facility ID*</label> <br />
          <input
            type="text"
            name="facilityId"
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            style={{ marginBottom: '10px', width: '200px', height: '35px' }}
            required
          />
        </div>
        <div>
          <label htmlFor="employeeId">Employee ID*</label> <br />
          <input
            type="text"
            name="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{ marginBottom: '10px', width: '200px', height: '35px' }}
            required
          />
        </div>
        <div>
          <label htmlFor="startDate">Start Date*</label> <br />
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginBottom: '10px', width: '200px', height: '35px' }}
            required
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date*</label> <br />
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginBottom: '10px', width: '200px', height: '35px' }}
            required
          />
        </div>

        <button onClick={addHandle} style={{ borderWidth: '1px' }} >Add</button>

      </form>
    </div>
  );
};

export default AddManager;
