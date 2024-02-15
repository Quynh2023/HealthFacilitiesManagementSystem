import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/managersApi';

const DeleteManager = () => {
  const managerId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this manager?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deleteManager/${managerId}`);
        } catch (error) {
          console.error('Error deleting manager:', error);
          alert("Cannot delete this manager because of the relational data");
        }
      }
      navigate('/getAllManagers');
    };

    fetchData();
  }, [managerId, navigate]);
};

export default DeleteManager;