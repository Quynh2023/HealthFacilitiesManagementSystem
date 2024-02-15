import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavSchedule from '../Components/NavSchedule';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/schedulesApi';

const EditSchedule = () => {
  const scheduleId = useParams().id;
  const navigate = useNavigate();

  const [editSchedule, setEditSchedule] = useState(null);
  const [facilityId, setFacilityId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getSchedules/${scheduleId}`);
        setEditSchedule(response.data[0]);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };
    fetchData();
  }, [scheduleId]);

  useEffect(() => {
    if (editSchedule && Object.keys(editSchedule).length > 0) {
      setFacilityId(editSchedule.FacilityID);
      setEmployeeId(editSchedule.EmployeeID);
      
      const formattedDate = new Date(editSchedule.Date).toISOString().split('T')[0];
      setDate(formattedDate);

      setStartTime(editSchedule.StartTime);
      setEndTime(editSchedule.EndTime);
    }
  }, [editSchedule]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updateSchedule/${scheduleId}`, {
        FacilityID: facilityId,
        EmployeeID: employeeId,
        Date:date,
        StartTime: startTime,
        EndTime: endTime
      });

      alert('Schedule updated successfully');
      navigate('/getAllSchedules');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id or unique (facility, employee id, date, start time) or vaccinated employee");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavSchedule />
      <h4>Edit schedule {scheduleId}</h4>
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

        <button onClick={editHandle} style={{ borderWidth: '1px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditSchedule;
