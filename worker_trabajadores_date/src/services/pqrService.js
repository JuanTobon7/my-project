import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const pqrService = {
  // PASO 1: Inicia el proceso PQR en Camunda
  startPqrProcess: (pqrType, description, email) => {
    return axios.post(`${API_URL}/pqr/start`, {
      pqrType,
      description,
      email
    });
  },

  // PASO 2: Obtiene el taskId pendiente del proceso
  getPendingTask: (instanceId) => {
    return axios.get(`${API_URL}/pqr/tasks/${instanceId}`);
  },

  // PASO 4: Guarda la PQR y completa la tarea en Camunda
  savePqr: (pqr, taskId) => {
    return axios.post(`${API_URL}/pqr/save`, pqr, {
      params: { task_id: taskId }
    });
  },

  getAllPqrByEmail: (email) => {
    return axios.get(`${API_URL}/pqr/${email}`);
  },

  getPqrResult: (email, id) => {
    return axios.get(`${API_URL}/pqr/${email}/result/${id}`);
  }
};

export default pqrService;
