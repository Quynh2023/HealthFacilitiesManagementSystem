import React, { useState } from 'react';
import axios from 'axios';
import NavPostalCode from '../Components/NavPostalCode';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/postalCodesApi';

const AddPostalCode = () => {
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');

  const navigate = useNavigate();

  const addHandle = async (event) => {
    try {
      event.preventDefault();

      if (!postalCode || !city || !province) {
        alert('Please fill in all required fields');
        return;
      }
      await axios.post(`${API_URL}/addPostalCode`, {
        PostalCode: postalCode,
        City: city,
        Province: province,
      });

      alert("Postal code added successfully");
      navigate('/getAllPostalCodes');
    } catch (error) {
      alert("Error: check duplicate postal code");
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavPostalCode />
      <h5>Add new postal code</h5>
      <form>
        <div>
          <label htmlFor="postalCode">Postal Code*</label> <br />
          <input
            type="text"
            name="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            style={{ marginBottom: '10px' }}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City*</label> <br />
          <input
            type="text"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ marginBottom: '10px' }}
            required
          />
        </div>
        <div>
          <label htmlFor="province">Province*</label> <br />
          <input
            type="text"
            name="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            style={{ marginBottom: '10px' }}
            required
          />
        </div>

        <button onClick={addHandle} style={{ borderWidth: '1px' }} >Add</button>

      </form>
    </div>
  );
};

export default AddPostalCode;
