import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import NavEmployee from '../Components/NavEmployee';

const API_URL = 'http://localhost:4000/employeesApi';

const EditEmployee = () => {
  const employeeId = useParams().id;
  const navigate = useNavigate();

  const [editEmployee, setEditEmployee] = useState(null);
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [role, setRole] = useState('Nurse');
  const [dobirth, setDobirth] = useState('');
  const [medicareNumber, setMedicareNumber] = useState('');
  const [email, setEmail] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [postalCodeId, setPostalCodeId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getEmployees/${employeeId}`);
        setEditEmployee(response.data[0]);
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [employeeId]);

  useEffect(() => {
    if (editEmployee && Object.keys(editEmployee).length > 0) {
      setFName(editEmployee.FName);
      setLName(editEmployee.LName);
      setRole(editEmployee.Role);

      // Format the date to "YYYY-MM-DD"
      const formattedDobirth = new Date(editEmployee.DoBirth).toISOString().split('T')[0];
      setDobirth(formattedDobirth);

      setMedicareNumber(editEmployee.MedicareNumber);
      setEmail(editEmployee.Email);
      setCitizenship(editEmployee.Citizenship);
      setPhoneNumber(editEmployee.PhoneNumber);
      setAddress(editEmployee.Address);
      setPostalCodeId(editEmployee.PostalCodeID);
    }
  }, [editEmployee]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updateEmployee/${employeeId}`, {
        FName: fname,
        LName: lname,
        Role: role,
        DoBirth: dobirth,
        MedicareNumber: medicareNumber,
        Email: email,
        Citizenship: citizenship,
        PhoneNumber: phoneNumber,
        Address: address,
        PostalCodeID: postalCodeId
      });

      alert('Employee updated successfully');
      navigate('/getAllEmployees');
    } catch (error) {
      alert('Error: check available postal code');
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployee />
      <h4>Edit employee {employeeId}</h4>
      <form>
      <div>
          <label htmlFor="name">FName*</label> <br />
          <input
            type="text"
            name="fname"
            value={fname}
            onChange={(e) => setFName(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="name">LName*</label> <br />
          <input
            type="text"
            name="lname"
            value={lname}
            onChange={(e) => setLName(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div class="col-md-9 pe-5">
          <label htmlFor="role">Select role⮟</label> <br />
          <select
            className="form-control form-control-lg"
            name="role"
            required
            style={{ width: '300px', marginBottom: '20px', height: '40px', borderWidth: '2px' }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Nurse">Nurse</option>
            <option value="Doctor">Doctor</option>
            <option value="Cashier">Cashier</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Administrative personnel">Administrative personnel</option>
            <option value="Security personnel">Security personnel</option>
            <option value="Regular employee">Regular employee</option>
          </select>
        </div>
        <div>
          <label htmlFor="dobirth">Date of Birth*</label> <br />
          <input
            type="date"
            name="dobirth"
            value={dobirth}
            onChange={(e) => setDobirth(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="medicareNumber">Medicare Number*</label> <br />
          <input
            type="text"
            name="medicareNumber"
            value={medicareNumber}
            onChange={(e) => setMedicareNumber(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="email">Email*</label> <br />
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>
        <div>
          <label htmlFor="citizenship">Citizenship*</label> <br />
          <input
            type="text"
            name="citizenship"
            value={citizenship}
            onChange={(e) => setCitizenship(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>

        <div>
          <label htmlFor="phone number">Phone Number*</label> <br />
          <input
            type="text"
            name="phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>

        <div>
          <label htmlFor="address">Address*</label> <br />
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>

        <div>
          <label htmlFor="postal code id">Postal Code ID*</label> <br />
          <input
            type="text"
            name="postalCodeId"
            value={postalCodeId}
            onChange={(e) => setPostalCodeId(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>

        <button onClick={editHandle} style={{ borderWidth: '1px', marginBottom: '50px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditEmployee;
