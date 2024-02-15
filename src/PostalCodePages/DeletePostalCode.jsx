import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/postalCodesApi';

const DeletePostalCode = () => {
  const postalCodeId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this postal code?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deletePostalCode/${postalCodeId}`);
        } catch (error) {
          console.error('Error deleting postal code:', error);
          alert("Cannot delete this postal code because of the relational data");
        }
      }
      navigate('/getAllPostalCodes');
    };

    fetchData();
  }, [postalCodeId, navigate]);
};

export default DeletePostalCode;
