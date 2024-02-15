import React, { useState } from 'react';
import axios from 'axios';
import NavEmployee from '../Components/NavEmployee';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/employeesApi';

const AddEmployee = () => {
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

  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!fname || !lname || !dobirth || !medicareNumber || !email|| !citizenship|| !phoneNumber || !address || !postalCodeId) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addEmployee`, {
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

      alert("Employee added successfully");
      navigate('/getAllEmployees');
    } catch (error) {
      alert("Error: check available postal code id");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavEmployee />
      <h5>Add new employee</h5>
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

        <button onClick={addHandle} style={{ borderWidth: '1px', marginBottom: '50px' }} >Add</button>

      </form>
    </div>
  );
};

export default AddEmployee;
