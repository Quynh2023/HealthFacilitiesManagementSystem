import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavEmailLog from '../Components/NavEmailLog';
import { Link } from 'react-router-dom';


const API_URL = 'http://localhost:4000/emailLogsApi';

const AllEmailLogs = () => {
  const [emailLogs, setEmailLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getAllEmailLogs`);
        setEmailLogs(response.data);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };
    fetchData();
  }, [emailLogs]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmailLog />
      <div>
        <h5>All EmailLogs</h5>
        <div className="table-container">
        <table className="table table-striped" style={{ width: '100%', fontSize: '16px' }}>
          <thead>
            <tr>
              <th>EmailLog ID</th>
              <th>Facility ID</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Subject</th>
              <th>Body</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {emailLogs.map((emailLog) => (
              <tr key={emailLog.EmailLogID}>
                <td>{emailLog.EmailLogID}</td>
                <td>{emailLog.FacilityID}</td>
                <td>{emailLog.EmployeeID}</td>
                <td>{new Date(emailLog.Date).toLocaleDateString()}</td>
                <td>{emailLog.Subject}</td>
                <td>{emailLog.Body}</td>
                <td>
                  <Link to={`/editEmailLog/${emailLog.EmailLogID}`}>
                    <button style={{ marginRight: '5px', borderWidth: '1px'}}>Edit</button>
                  </Link>
                  <Link to={`/deleteEmailLog/${emailLog.EmailLogID}`}> 
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
              width: 99%
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

export default AllEmailLogs;
