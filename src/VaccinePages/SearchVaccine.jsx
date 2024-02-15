import React, { useState, useEffect } from 'react';
import NavVaccine from '../Components/NavVaccine';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000/vaccinesApi';

const SearchVaccine = () => {

  const [searchVaccine, setSearchVaccine] = useState('');
  const searchQuery = useParams().searchQuery;
  const navigate = useNavigate();

  if (!searchQuery) {
    navigate('/getAllVaccines');
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery) {
          const response = await axios.get(`${API_URL}/getVaccines/${searchQuery}`);
          setSearchVaccine(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching vaccine:', error);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div style={{ marginLeft: '20px' }}>
      <NavVaccine />
      <h4 style={{marginBottom: '20px'}}>Search result</h4>
      {searchVaccine ? (<div>
        <p><strong>Vaccine Id:</strong> {searchVaccine.VaccineID}</p>
        <p><strong>Employee Id:</strong> {searchVaccine.EmployeeID}</p>
        <p><strong>Facility Id:</strong> {searchVaccine.FacilityID}</p>
        <p><strong>Type:</strong> {searchVaccine.Type}</p>
        <p><strong>Dose Number:</strong> {searchVaccine.DoseNumber}</p>
        <p><strong>Date:</strong> {new Date(searchVaccine.Date).toLocaleDateString()}</p>
        
        <Link to={`/editVaccine/${searchVaccine.VaccineID}`}>
          <button style={{ marginRight: '5px', borderWidth: '1px' }}>Edit</button>
        </Link>
        <Link to={`/deleteVaccine/${searchVaccine.VaccineID}`}>
          <button style={{ borderWidth: '1px' }}>Delete</button>
        </Link>
      </div>) : (<div>
        <p>Result not found.</p>
      </div>)}
    </div>
  )
}

export default SearchVaccine;