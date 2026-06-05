// components/CreatePqrForm.jsx
import React, { useState } from 'react';
import { useClient } from '../context/ClientContext';
import pqrService from '../services/pqrService';
import './CreatePqrForm.css';

const PQR_TYPES = [
  { value: 'PETICION', label: 'Petición' },
  { value: 'QUEJA', label: 'Queja' },
  { value: 'RECLAMO', label: 'Reclamo' }
];

const CreatePqrForm = ({ onSuccess, onCancel }) => {
  const { client } = useClient();
  const [formData, setFormData] = useState({
    pqrType: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pqrType) {
      newErrors.pqrType = 'Selecciona un tipo de PQR';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // PASO 1: Iniciar el proceso en Camunda
      console.log('✅ PASO 1: Iniciando proceso PQR...');
      let instanceId;

      try {
        const startResponse = await pqrService.startPqrProcess(
          formData.pqrType,
          formData.description,
          client.email
        );
        instanceId = startResponse.data.instanceId;
        console.log('✅ PASO 1 Éxito - instanceId:', instanceId);

      } catch (startError) {
        // Si es 404, el cliente no existe en el sistema pero el proceso arrancó
        if (startError.response?.status === 404) {
          instanceId = startError.response.data.instanceId;
          console.log('⚠️ Cliente no en sistema, proceso arrancó igual - instanceId:', instanceId);
          setSuccessMessage('Tu solicitud fue enviada. Recibirás un correo con instrucciones.');
          setFormData({ pqrType: '', description: '' });
          setTimeout(() => {
            setSuccessMessage('');
            if (onSuccess) onSuccess();
          }, 2000);
          return;
        }
        throw startError; // otros errores sí se propagan
      }

      // PASO 2: Obtener el taskId pendiente
      console.log('✅ PASO 2: Obteniendo taskId del proceso...');
      const taskResponse = await pqrService.getPendingTask(instanceId);
      const taskId = taskResponse.data.taskId;
      console.log('✅ PASO 2 Éxito - taskId:', taskId);

      // PASO 3: Construir objeto PQR completo
      console.log('✅ PASO 3: Construyendo objeto PQR...');
      const completePqr = {
        pqr:           `PQR-${Date.now()}`,
        description:   formData.description,
        clientName:    client.name,
        clientLastName: client.lastName,
        clientEmail:   client.email,
        clientPhone:   parseInt(client.phone),
        pqrType:       formData.pqrType,
        progationDate: new Date().toISOString(),
        isProcessed:   false
      };
      console.log('Objeto PQR:', completePqr);

      // PASO 4: Guardar PQR y completar tarea Camunda
      console.log('✅ PASO 4: Guardando PQR en base de datos...');
      const saveResponse = await pqrService.savePqr(completePqr, taskId);
      console.log('✅ PASO 4 Éxito - Respuesta:', saveResponse.data);

      setSuccessMessage('¡PQR creada exitosamente!');
      setFormData({ pqrType: '', description: '' });

      setTimeout(() => {
        setSuccessMessage('');
        if (onSuccess) onSuccess();
      }, 2000);

    } catch (error) {
      console.error('❌ Error en el proceso:', error);
      setErrors({
        submit: error.response?.data?.message || error.message || 'Error al crear la PQR'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-pqr-container">
      <div className="create-pqr-card">
        <h2>Crear Nueva PQR</h2>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {errors.submit && (
          <div className="error-alert">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="pqr-form">
          <div className="form-group">
            <label htmlFor="pqrType">Tipo de PQR *</label>
            <select
              id="pqrType"
              name="pqrType"
              value={formData.pqrType}
              onChange={handleChange}
              className={errors.pqrType ? 'input-error' : ''}
            >
              <option value="">Selecciona un tipo...</option>
              {PQR_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.pqrType && <span className="error-message">{errors.pqrType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe tu petición, queja o reclamo con detalles..."
              rows="8"
              className={errors.description ? 'input-error' : ''}
            />
            <div className="char-count">
              {formData.description.length}/500 caracteres
            </div>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="info-box">
            <p><strong>Cliente:</strong> {client.name} {client.lastName}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Teléfono:</strong> {client.phone}</p>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Procesando...' : 'Enviar PQR'}
            </button>
            {onCancel && (
              <button type="button" className="btn-cancel" onClick={onCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePqrForm;