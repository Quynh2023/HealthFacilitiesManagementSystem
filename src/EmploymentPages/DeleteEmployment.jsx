import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/employmentsApi';

const DeleteEmployment = () => {
  const employmentId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this employment?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deleteEmployment/${employmentId}`);
        } catch (error) {
          console.error('Error deleting employment:', error);
          alert("Cannot delete this employment because of the relational data");
        }
      }
      navigate('/getAllEmployments');
    };

    fetchData();
  }, [employmentId, navigate]);
};

export default DeleteEmployment;
