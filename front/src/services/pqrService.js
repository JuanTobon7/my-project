import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const pqrService = {
  startPqrProcess: (pqrType, description, email) => {
    return axios.post(`${API_URL}/pqr/start`, {
      pqrType,
      description,
      email
    });
  },

  getPendingTask: (instanceId) => {
    return axios.get(`${API_URL}/pqr/tasks/${instanceId}`);
  },

  savePqr: (pqr, taskId) => {
    const params = { task_id: taskId };
    return axios.post(`${API_URL}/pqr/save`, pqr, { params });
  },

  getAllPqrByEmail: (email) => {
    return axios.get(`${API_URL}/pqr/${email}`);
  },

  getPqrResult: (email, id) => {
    return axios.get(`${API_URL}/pqr/${email}/result/${id}`);
  }
};

export default pqrService;
