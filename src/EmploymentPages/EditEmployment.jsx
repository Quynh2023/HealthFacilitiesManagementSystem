import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavEmployment from '../Components/NavEmployment';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/employmentsApi';

const EditEmployment = () => {
  const employmentId = useParams().id;
  const navigate = useNavigate();

  const [editEmployment, setEditEmployment] = useState(null);
  const [facilityId, setFacilityId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [contractId, setContractId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getEmployments/${employmentId}`);
        setEditEmployment(response.data[0]);
      } catch (error) {
        console.error('Error fetching employment:', error);
      }
    };
    fetchData();
  }, [employmentId]);

  useEffect(() => {
    if (editEmployment && Object.keys(editEmployment).length > 0) {
      setFacilityId(editEmployment.FacilityID);
      setEmployeeId(editEmployment.EmployeeID);
      setContractId(editEmployment.ContractID);

      const formattedStartDate = new Date(editEmployment.StartDate).toISOString().split('T')[0];
      setStartDate(formattedStartDate);

      if (editEmployment.endDate) {
        const formattedEndDate = new Date(editEmployment.EndDate).toISOString().split('T')[0];
        setEndDate(formattedEndDate);
      }

    }
  }, [editEmployment]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updateEmployment/${employmentId}`, {
        FacilityID:facilityId,
        EmployeeID:employeeId,
        ContractID:contractId,
        StartDate: startDate,
        EndDate: endDate
      });

      alert('Employment updated successfully');
      navigate('/getAllEmployments');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id or unique contract id or end date > start date or facility capacity is full");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployment />
      <h4>Edit employment {employmentId}</h4>
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
        <button onClick={editHandle} style={{ borderWidth: '1px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditEmployment;
