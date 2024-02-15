import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/schedulesApi';

const DeleteSchedule = () => {
  const scheduleId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this schedule record?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deleteSchedule/${scheduleId}`);
        } catch (error) {
          console.error('Error deleting schedule:', error);
          alert("Cannot delete this schedule because of the relational data");
        }
      }
      navigate('/getAllSchedules');
    };

    fetchData();
  }, [scheduleId, navigate]);
};

export default DeleteSchedule;
