import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavSchedule from '../Components/NavSchedule';
import { Link } from 'react-router-dom';


const API_URL = 'http://localhost:4000/schedulesApi';

const AllSchedules = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllSchedules`);
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };
    fetchData();
  }, [schedules]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavSchedule />
      <div>
        <h5>All Schedules</h5>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
          <thead>
            <tr>
              <th>Schedule ID</th>
              <th>Facility ID</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>StartTime</th>
              <th>EndTime</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.ScheduleID}>
                <td>{schedule.ScheduleID}</td>
                <td>{schedule.FacilityID}</td>
                <td>{schedule.EmployeeID}</td>
                <td>{new Date(schedule.Date).toLocaleDateString()}</td>
                <td>{schedule.StartTime}</td>
                <td>{schedule.EndTime}</td>
                <td>
                  <Link to={`/editSchedule/${schedule.ScheduleID}`}>
                    <button style={{ marginRight: '5px', borderWidth: '1px'}}>Edit</button>
                  </Link>
                  <Link to={`/deleteSchedule/${schedule.ScheduleID}`}> 
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

export default AllSchedules;
