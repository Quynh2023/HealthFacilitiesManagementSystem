import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavInfection from '../Components/NavInfection';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/infectionsApi';

const EditInfection = () => {
  const infectionId = useParams().id;
  const navigate = useNavigate();

  const [editInfection, setEditInfection] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState('COVID-19');
  const [date, setDate] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getInfections/${infectionId}`);
        setEditInfection(response.data[0]);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };
    fetchData();
  }, [infectionId]);

  useEffect(() => {
    if (editInfection && Object.keys(editInfection).length > 0) {
      setEmployeeId(editInfection.EmployeeID);
      setType(editInfection.Type);
      
      const formattedDate = new Date(editInfection.Date).toISOString().split('T')[0];
      setDate(formattedDate);
    }
  }, [editInfection]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updateInfection/${infectionId}`, {
        EmployeeID: employeeId,
        Type: type,
        Date:date
      });

      alert('Infection updated successfully');
      navigate('/getAllInfections');
    } catch (error) {
      alert('Error: check relational constrain of employee id');
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavInfection />
      <h4>Edit infection {infectionId}</h4>
      <form>
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
        <div class="col-md-9 pe-5">
          <label htmlFor="type">Select type⮟</label> <br />
          <select
            className="form-control form-control-lg"
            name="type"
            required
            style={{ width: '300px', marginBottom: '20px', height: '40px', borderWidth: '2px' }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="COVID-19">COVID-19</option>
            <option value="SARS-Cov-2 Variant">SARS-Cov-2 Variant</option>
            <option value="Flu">Flu</option>
          </select>
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

        <button onClick={editHandle} style={{ borderWidth: '1px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditInfection;
