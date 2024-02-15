import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/emailLogsApi';

const DeleteEmailLog = () => {
  const emailLogId = useParams().id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const confirmDelete = window.confirm('Are you sure you want to delete this emailLog record?');

      if (confirmDelete) {
        try {
          await axios.delete(`${API_URL}/deleteEmailLog/${emailLogId}`);
        } catch (error) {
          console.error('Error deleting emailLog:', error);
          alert("Cannot delete this emailLog because of the relational data");
        }
      }
      navigate('/getAllEmailLogs');
    };

    fetchData();
  }, [emailLogId, navigate]);
};

export default DeleteEmailLog;
