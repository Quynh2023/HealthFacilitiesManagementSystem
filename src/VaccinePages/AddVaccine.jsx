import React, { useState } from 'react';
import axios from 'axios';
import NavVaccine from '../Components/NavVaccine';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/vaccinesApi';

const AddVaccine = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [type, setType] = useState('Pfizer');
  const [doseNumber, setDoseNumber] = useState('');
  const [date, setDate] = useState('');

  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!employeeId || !facilityId || !type || !doseNumber || !date) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addVaccine`, {
        EmployeeID: employeeId,
        FacilityID: facilityId,
        Type: type,
        DoseNumber: doseNumber,
        Date:date
      });

      alert("Vaccine added successfully");
      navigate('/getAllVaccines');
    } catch (error) {
      alert("Error: check relational constrain of facility id or employee id or unique (employee id, dose number)");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavVaccine />
      <h5>Add new vaccine</h5>
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
            <option value="Pfizer">Pfizer</option>
            <option value="Moderna">Moderna</option>
            <option value="AstraZeneca">AstraZeneca</option>
            <option value="Johnson & Johnson">Johnson & Johnson</option>
          </select>
        </div>
        <div>
          <label htmlFor="doseNumber">Dose Number*</label> <br />
          <input
            type="number"
            name="doseNumber"
            value={doseNumber}
            onChange={(e) => setDoseNumber(e.target.value)}
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

        <button onClick={addHandle} style={{ borderWidth: '1px', marginBottom: '50px' }} >Add</button>

      </form>
    </div>
  );
};

export default AddVaccine;
