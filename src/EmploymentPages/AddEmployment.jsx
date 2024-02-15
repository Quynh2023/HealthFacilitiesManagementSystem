import React, { useState } from 'react';
import axios from 'axios';
import NavEmployment from '../Components/NavEmployment';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/employmentsApi';

const AddEmployment = () => {
  const [facilityId, setFacilityId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [contractId, setContractId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(null);
  
  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!facilityId || !employeeId || !contractId || !startDate) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addEmployment`, {
        FacilityID:facilityId,
        EmployeeID:employeeId,
        ContractID:contractId,
        StartDate: startDate,
        EndDate: endDate
      });

      alert("Employment added successfully");
      navigate('/getAllEmployments');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id or unique contract id or end date > start date or facility capacity is full");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployment />
      <h5>Add new employment</h5>
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
          <label htmlFor="contractId">Contract ID*</label> <br />
          <input
            type="text"
            name="contractId"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
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

export default AddEmployment;
