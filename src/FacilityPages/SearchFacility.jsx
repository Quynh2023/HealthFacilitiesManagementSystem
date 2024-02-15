import React, { useState, useEffect } from 'react';
import NavFacility from '../Components/NavFacility';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:4000/facilitiesApi';

const SearchFacility = () => {

  const [searchFacility, setSearchFacility] = useState('');
  const searchQuery = useParams().searchQuery;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getFacilities/${searchQuery}`);
          setSearchFacility(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavFacility />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchFacility ? (<div>
        <p><strong>Facility Id:</strong> {searchFacility.FacilityID}</p>
        <p><strong>Name:</strong> {searchFacility.Name}</p>
        <p><strong>Type:</strong> {searchFacility.Type}</p>
        <p><strong>Capacity:</strong> {searchFacility.Capacity}</p>
        <p><strong>Web Address:</strong> {searchFacility.WebAddress}</p>
        <p><strong>Phone Number:</strong> {searchFacility.PhoneNumber}</p>
        <p><strong>Address:</strong> {searchFacility.Address}</p>
        <p><strong>Postal Code Id:</strong> {searchFacility.PostalCodeID}</p>
        <Link to={`/editFacility/${searchFacility.FacilityID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deleteFacility/${searchFacility.FacilityID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchFacility; 