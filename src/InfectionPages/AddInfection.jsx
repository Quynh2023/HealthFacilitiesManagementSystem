import React, { useState } from 'react';
import axios from 'axios';
import NavInfection from '../Components/NavInfection';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/infectionsApi';

const AddInfecion = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState('COVID-19');
  const [date, setDate] = useState('');

  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!employeeId || !type || !date) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addInfection`, {
        EmployeeID: employeeId,
        Type: type,
        Date:date
      });

      alert("Infecion added successfully");
      navigate('/getAllInfections');
    } catch (error) {
      alert("Error: check relational constrain of employee id");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavInfection />
      <h5>Add infection</h5>
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

        <button onClick={addHandle} style={{ borderWidth: '1px', marginBottom: '50px' }} >Add</button>

      </form>
    </div>
  );
};

export default AddInfecion;
