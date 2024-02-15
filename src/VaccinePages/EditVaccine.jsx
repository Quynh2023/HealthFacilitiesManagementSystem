import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavVaccine from '../Components/NavVaccine';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/vaccinesApi';

const EditVaccine = () => {
  const vaccineId = useParams().id;
  const navigate = useNavigate();

  const [editVaccine, setEditVaccine] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [type, setType] = useState('Pfizer');
  const [doseNumber, setDoseNumber] = useState('');
  const [date, setDate] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getVaccines/${vaccineId}`);
        setEditVaccine(response.data[0]);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };
    fetchData();
  }, [vaccineId]);

  useEffect(() => {
    if (editVaccine && Object.keys(editVaccine).length > 0) {
      setEmployeeId(editVaccine.EmployeeID);
      setFacilityId(editVaccine.FacilityID);
      setType(editVaccine.Type);
      setDoseNumber(editVaccine.DoseNumber);

      const formattedDate = new Date(editVaccine.Date).toISOString().split('T')[0];
      setDate(formattedDate);

    }
  }, [editVaccine]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updateVaccine/${vaccineId}`, {
        EmployeeID: employeeId,
        FacilityID: facilityId,
        Type: type,
        DoseNumber: doseNumber,
        Date:date
      });

      alert('Vaccine updated successfully');
      navigate('/getAllVaccines');
    } catch (error) {
      alert('Error: check relational constrain of facility id or employee id or unique (employee id, dose number)');
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavVaccine />
      <h4>Edit vaccine {vaccineId}</h4>
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

        <button onClick={editHandle} style={{ borderWidth: '1px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditVaccine;
