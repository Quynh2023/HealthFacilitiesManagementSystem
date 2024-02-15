import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavManager from '../Components/NavManager';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/managersApi';

const EditManager = () => {
  const managerId = useParams().id;
  const navigate = useNavigate();

  const [editManager, setEditManager] = useState(null);
  const [facilityId, setFacilityId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getManagers/${managerId}`);
        setEditManager(response.data[0]);
      } catch (error) {
        console.error('Error fetching manager:', error);
      }
    };
    fetchData();
  }, [managerId]);

  useEffect(() => {
    if (editManager && Object.keys(editManager).length > 0) {
      setFacilityId(editManager.FacilityID);
      setEmployeeId(editManager.EmployeeID);

      const formattedStartDate = new Date(editManager.StartDate).toISOString().split('T')[0];
      setStartDate(formattedStartDate);

      if (editManager.endDate) {
        const formattedEndDate = new Date(editManager.EndDate).toISOString().split('T')[0];
        setEndDate(formattedEndDate);
      }

    }
  }, [editManager]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updateManager/${managerId}`, {
        FacilityID:facilityId,
        EmployeeID:employeeId,
        StartDate: startDate,
        EndDate: endDate
      });

      alert('Manager updated successfully');
      navigate('/getAllManagers');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id or end date > start date or manager must be administrative personnel");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavManager />
      <h4>Edit manager {managerId}</h4>
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
        <button onClick={editHandle} style={{ borderWidth: '1px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditManager;
