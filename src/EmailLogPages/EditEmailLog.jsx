import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavEmailLog from '../Components/NavEmailLog';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/emailLogsApi';

const EditEmailLog = () => {
  const emailLogId = useParams().id;
  const navigate = useNavigate();

  const [editEmailLog, setEditEmailLog] = useState(null);
  const [facilityId, setFacilityId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getEmailLogs/${emailLogId}`);
        setEditEmailLog(response.data[0]);
      } catch (error) {
        console.error('Error fetching emailLogs:', error);
      }
    };
    fetchData();
  }, [emailLogId]);

  useEffect(() => {
    if (editEmailLog && Object.keys(editEmailLog).length > 0) {
      setFacilityId(editEmailLog.FacilityID);
      setEmployeeId(editEmailLog.EmployeeID);
      
      const formattedDate = new Date(editEmailLog.Date).toISOString().split('T')[0];
      setDate(formattedDate);

      setSubject(editEmailLog.Subject);
      setBody(editEmailLog.Body);
    }
  }, [editEmailLog]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updateEmailLog/${emailLogId}`, {
        FacilityID: facilityId,
        EmployeeID: employeeId,
        Date:date,
        Subject: subject,
        Body: body
      });

      alert('EmailLog updated successfully');
      navigate('/getAllEmailLogs');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmailLog />
      <h4>Edit schedule {emailLogId}</h4>
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

        <button onClick={editHandle} style={{ borderWidth: '1px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditEmailLog;
