import React, { useState, useEffect } from 'react';
import employmentService from '../services/employService';
import AssignVisitCard from './AssignVisitCard';
import './EmploymentList.css';

/**
 * EmploymentList
 *
 * Lista todos los trabajadores. Desde cada uno se puede
 * agendar una visita técnica — completa el mismo topic
 * receive_data_visit que PqrList.
 */
const EmploymentList = ({ refresh }) => {
  const [workers, setWorkers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [expandedWorker, setExpandedWorker] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, [refresh]);

  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employmentService.getAll();
      setWorkers(data || []);
    } catch (err) {
      setError('Error al cargar trabajadores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando trabajadores...</div>;
  if (error)   return <div className="error-alert">{error}</div>;
  if (workers.length === 0) {
    return <div className="empty-state"><p>No hay trabajadores registrados.</p></div>;
  }

  return (
    <div className="employment-list-container">
      <h2>Trabajadores</h2>
      <div className="employment-list">
        {workers.map((worker) => (
          <div key={worker.phone} className="employment-item">

            {/* info del trabajador */}
            <div className="employment-header">
              <div className="employment-avatar">
                {worker.name?.charAt(0)}{worker.lastName?.charAt(0)}
              </div>
              <div className="employment-info">
                <p className="employment-name">{worker.name} {worker.lastName}</p>
                <p className="employment-contact">{worker.email}</p>
                <p className="employment-contact">{worker.phone}</p>
              </div>
            </div>

            {/* botón para expandir asignación */}
            <button
              className="btn-schedule"
              onClick={() =>
                setExpandedWorker(expandedWorker === worker.phone ? null : worker.phone)
              }
            >
              {expandedWorker === worker.phone ? 'Cancelar' : 'Agendar visita'}
            </button>

            {/* AssignVisitCard — reutiliza el mismo flujo Camunda */}
            {expandedWorker === worker.phone && (
              <div style={{ marginTop: 12 }}>
                <AssignVisitCard
                  workers={workers}
                  label={`Trabajador: ${worker.name} ${worker.lastName}`}
                  onDone={() => setExpandedWorker(null)}
                />
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default EmploymentList;
