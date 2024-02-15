import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/employeesApi';

const DeleteEmployee = () => {
  const employeeId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this employee?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deleteEmployee/${employeeId}`);
        } catch (error) {
          console.error('Error deleting employee:', error);
          alert("Cannot delete this employee because of the relational data");
        }
      }

      navigate('/getAllEmployees');
    };

    fetchData();
  }, [employeeId, navigate]);
};

export default DeleteEmployee;