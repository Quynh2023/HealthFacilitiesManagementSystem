import React, { useState, useEffect } from 'react';
import NavSchedule from '../Components/NavSchedule';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/schedulesApi';

const SearchSchedule = () => {

  const [searchSchedule, setSearchSchedule] = useState('');
  const searchQuery = useParams().searchQuery;
  const navigate = useNavigate();

  if (!searchQuery) {
    navigate('/getAllSchedules');
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getSchedules/${searchQuery}`);
          setSearchSchedule(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavSchedule />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchSchedule ? (<div>
        <p><strong>Schedule Id:</strong> {searchSchedule.ScheduleID}</p>
        <p><strong>Facility Id:</strong> {searchSchedule.FacilityID}</p>
        <p><strong>Employee Id:</strong> {searchSchedule.EmployeeID}</p>
        <p><strong>Date:</strong> {new Date(searchSchedule.Date).toLocaleDateString()}</p>
        <p><strong>Start Time:</strong> {searchSchedule.StartTime}</p>
        <p><strong>End Time:</strong> {searchSchedule.EndTime}</p>
        
        <Link to={`/editSchedule/${searchSchedule.ScheduleID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deleteSchedule/${searchSchedule.ScheduleID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchSchedule;