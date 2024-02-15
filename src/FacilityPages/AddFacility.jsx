import React, { useState } from 'react';
import axios from 'axios';
import NavFacility from '../Components/NavFacility';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/facilitiesApi';

const AddFacility = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Hospital');
  const [capacity, setCapacity] = useState('');
  const [webAddress, setWebAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [postalCodeId, setPostalCodeId] = useState('');

  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!name || !type || !capacity || !webAddress || !phoneNumber || !address || !postalCodeId) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addFacility`, {
        Name: name,
        Type: type,
        Capacity: capacity,
        WebAddress: webAddress,
        PhoneNumber: phoneNumber,
        Address: address,
        PostalCodeID: postalCodeId
      });

      alert("Facility added successfully");
      navigate('/getAllFacilities');
    } catch (error) {
      alert("Error: check available postal code id");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavFacility />
      <h5>Add new facility</h5>
      <form>
        <div>
          <label htmlFor="name">Name*</label> <br />
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            <option value="Hospital">Hospital</option>
            <option value="CLSC">CLSC</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Special instalment">Special instalment</option>
            <option value="Clinic">Clinic</option>
          </select>
        </div>

        <div>
          <label htmlFor="capacity">Capacity*</label> <br />
          <input
            type="text"
            name="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            style={{ marginBottom: '10px', width: '300px' }}
          />
        </div>

        <div>
          <label htmlFor="web address">Web Address*</label> <br />
          <input
            type="text"
            name="webAddress"
            value={webAddress}
            onChange={(e) => setWebAddress(e.target.value)}
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

        <button onClick={addHandle} style={{ borderWidth: '1px' }} >Add</button>

      </form>
    </div>
  );
};

export default AddFacility;
