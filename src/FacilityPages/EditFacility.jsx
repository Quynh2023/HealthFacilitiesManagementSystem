import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavFacility from '../Components/NavFacility';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/facilitiesApi';

const EditFacility = () => {
  const facilityId = useParams().id;
  const navigate = useNavigate();

  const [editFacility, setEditFacility] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [webAddress, setWebAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [postalCodeId, setPostalCodeId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/getFacilities/${facilityId}`);
        setEditFacility(response.data[0]);
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [facilityId]);

  useEffect(() => {
    if (editFacility && Object.keys(editFacility).length > 0) {
      setName(editFacility.Name);
      setType(editFacility.Type);
      setCapacity(editFacility.Capacity);
      setWebAddress(editFacility.WebAddress);
      setPhoneNumber(editFacility.PhoneNumber);
      setAddress(editFacility.Address);
      setPostalCodeId(editFacility.PostalCodeID);
    }
  }, [editFacility]);

  const editHandle = async (event) => {
    try {
      event.preventDefault();

      await axios.patch(`${API_URL}/updateFacility/${facilityId}`, {
        Name: name,
        Type: type,
        Capacity: capacity,
        WebAddress: webAddress,
        PhoneNumber: phoneNumber,
        Address: address,
        PostalCodeID: postalCodeId
      });

      alert('Facility updated successfully');
      navigate('/getAllFacilities');
    } catch (error) {
      alert('Error: check available postal code');
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavFacility />
      <h4>Edit facility {facilityId}</h4>
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

        <button onClick={editHandle} style={{ borderWidth: '1px' }}>Update</button>
      </form>
    </div>
  );
};

export default EditFacility;
