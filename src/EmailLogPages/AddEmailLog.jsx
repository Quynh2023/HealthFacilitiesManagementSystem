import React, { useState } from 'react';
import axios from 'axios';
import NavEmailLog from '../Components/NavEmailLog';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/emailLogsApi';

const AddEmailLog = () => {
  const [facilityId, setFacilityId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!facilityId || !employeeId || !date || !subject || !body) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addEmailLog`, {
        FacilityID: facilityId,
        EmployeeID: employeeId,
        Date:date,
        Subject: subject,
        Body: body
      });

      alert("EmailLog added successfully");
      navigate('/getAllEmailLogs');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmailLog />
      <h5>Add new emailLog</h5>
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
          <label htmlFor="subject">Subject*</label> <br />
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="body">Body*</label> <br />
          <input
            type="text"
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ marginBottom: '10px', width: '300px'}}
          />
        </div>
        <button onClick={addHandle} style={{ borderWidth: '1px', marginBottom: '50px' }} >Add</button>
      </form>
    </div>
  );
};

export default AddEmailLog;
