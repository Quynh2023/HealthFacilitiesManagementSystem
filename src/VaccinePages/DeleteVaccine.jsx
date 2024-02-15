import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/vaccinesApi';

const DeleteVaccine = () => {
  const vaccineId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this vaccine record?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deleteVaccine/${vaccineId}`);
        } catch (error) {
          console.error('Error deleting vaccine:', error);
          alert("Cannot delete this vaccine because of the relational data");
        }
      }
      navigate('/getAllVaccines');
    };

    fetchData();
  }, [vaccineId, navigate]);
};

export default DeleteVaccine;
