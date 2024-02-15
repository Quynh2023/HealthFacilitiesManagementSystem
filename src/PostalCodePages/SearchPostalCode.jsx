import React, { useState, useEffect } from 'react';
import NavPostalCode from '../Components/NavPostalCode';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/postalCodesApi';

const SearchPostalCode = () => {

  const [searchPostalCode, setSearchPostalCode] = useState('');
  const searchQuery = useParams().searchQuery;
  const navigate = useNavigate();

  if (!searchQuery) {
    navigate('/getAllPostalCodes');
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getPostalCodes/${searchQuery}`);
          setSearchPostalCode(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching postal codes:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavPostalCode />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchPostalCode ? (<div>
        <p><strong>Postal Code Id:</strong> {searchPostalCode.PostalCodeID}</p>
        <p><strong>Postal Code:</strong> {searchPostalCode.PostalCode}</p>
        <p><strong>City:</strong> {searchPostalCode.City}</p>
        <p><strong>Province:</strong> {searchPostalCode.Province}</p>
        <Link to={`/editPostalCode/${searchPostalCode.PostalCodeID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deletePostalCode/${searchPostalCode.PostalCodeID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchPostalCode;