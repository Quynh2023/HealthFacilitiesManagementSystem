import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/infectionsApi';

const DeleteInfection = () => {
  const infectionId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this infection record?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deleteInfection/${infectionId}`);
        } catch (error) {
          console.error('Error deleting infection:', error);
          alert("Cannot delete this infection because of the relational data");
        }
      }
      navigate('/getAllInfections');
    };

    fetchData();
  }, [infectionId, navigate]);
};

export default DeleteInfection;
