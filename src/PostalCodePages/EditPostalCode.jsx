import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavPostalCode from '../Components/NavPostalCode';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/postalCodesApi';

const EditPostalCode = () => {
  const postalCodeId = useParams().id;
  const navigate = useNavigate();

  const [editPostalCode, setEditPostalCode] = useState(null);
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getPostalCodes/${postalCodeId}`);
        setEditPostalCode(response.data[0]);
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [postalCodeId]);

  useEffect(() => {
    if (editPostalCode && Object.keys(editPostalCode).length > 0) {
      setPostalCode(editPostalCode.PostalCode);
      setCity(editPostalCode.City);
      setProvince(editPostalCode.Province);
    }
  }, [editPostalCode]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updatePostalCode/${postalCodeId}`, {
        PostalCode: postalCode,
        City: city,
        Province: province,
      });

      alert('Postal code updated successfully');
      navigate('/getAllPostalCodes');
    } catch (error) {
      alert('Internal server error');
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavPostalCode />
      <h4>Edit postal code {postalCodeId}</h4>
      <form>
        <div>
          <label htmlFor="postalCode">Postal Code*</label> <br />
          <input
            type="text"
            name="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            style={{ marginBottom: '10px' }}
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
          />
        </div>
        <button onClick={editHandle} style={{ borderWidth: '1px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditPostalCode;
