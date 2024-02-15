import React, { useState } from 'react';
import axios from 'axios';
import NavSchedule from '../Components/NavSchedule';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/schedulesApi';

const AddSchedule = () => {
  const [facilityId, setFacilityId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!facilityId || !employeeId || !date || !startTime || !endTime) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addSchedule`, {
        FacilityID: facilityId,
        EmployeeID: employeeId,
        Date:date,
        StartTime: startTime,
        EndTime: endTime
      });

      alert("Schedule added successfully");
      navigate('/getAllSchedules');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id or unique (facility, employee id, date, start time) or vaccinated employee");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavSchedule />
      <h5>Add new schedule</h5>
      <form>
        <div>
          <label htmlFor="facilityId">Facility ID*</label> <br />
          <input
            type="number"
            name="facilityId"
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="employeeId">Employee ID*</label> <br />
          <input
            type="number"
            name="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="date">Date*</label> <br />
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="startTime">Start Time*</label> <br />
          <input
            type="time"
            name="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="startTime">End Time*</label> <br />
          <input
            type="time"
            name="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <button onClick={addHandle} style={{ borderWidth: '1px', marginBottom: '50px' }} >Add</button>
      </form>
    </div>
  );
};

export default AddSchedule;
