import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/facilitiesApi';

const DeletePostalCode = () => {
  const facilityId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this facility?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deleteFacility/${facilityId}`);
        } catch (error) {
          console.error('Error deleting facility:', error);
          alert("Cannot delete this facility because of the relational data");
        }
      }

      navigate('/getAllFacilities');
    };

    fetchData();
  }, [facilityId, navigate]);
};

export default DeletePostalCode;