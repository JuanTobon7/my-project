import React, { useState, useEffect } from 'react';
import { useClient } from '../context/ClientContext';
import pqrService from '../services/pqrService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './PqrList.css';

const PqrList = ({ onSelectPqr, refresh }) => {
  const { client } = useClient();
  const [pqrs, setPqrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPqrs();
  }, [refresh]);

  const fetchPqrs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pqrService.getAllPqrByEmail(client.email);
      setPqrs(response.data || []);
    } catch (err) {
      setError('Error al cargar las PQRs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPqrTypeColor = (type) => {
    switch (type) {
      case 'PETICION':
        return 'type-peticion';
      case 'QUEJA':
        return 'type-queja';
      case 'RECLAMO':
        return 'type-reclamo';
      default:
        return 'type-default';
    }
  };

  const getPqrTypeLabel = (type) => {
    switch (type) {
      case 'PETICION':
        return 'Petición';
      case 'QUEJA':
        return 'Queja';
      case 'RECLAMO':
        return 'Reclamo';
      default:
        return type;
    }
  };

  const getStatusBadge = (isProcessed) => {
    return isProcessed ? 'status-processed' : 'status-pending';
  };

  const getStatusLabel = (isProcessed) => {
    return isProcessed ? 'Procesada' : 'Pendiente';
  };

  if (loading) {
    return <div className="loading">Cargando PQRs...</div>;
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  if (pqrs.length === 0) {
    return (
      <div className="empty-state">
        <p>No has creado ninguna PQR aún.</p>
      </div>
    );
  }

  return (
    <div className="pqr-list-container">
      <h2>Mis PQRs</h2>
      <div className="pqr-list">
        {pqrs.map((pqr) => (
          <div key={pqr.id} className="pqr-item">
            <div className="pqr-header">
              <div>
                <span className={`badge ${getPqrTypeColor(pqr.pqrType)}`}>
                  {getPqrTypeLabel(pqr.pqrType)}
                </span>
                <span className={`status ${getStatusBadge(pqr.isProcessed)}`}>
                  {getStatusLabel(pqr.isProcessed)}
                </span>
              </div>
              <div className="pqr-date">
                {formatDistanceToNow(new Date(pqr.progationDate), {
                  addSuffix: true,
                  locale: es
                })}
              </div>
            </div>

            <div className="pqr-description">
              {pqr.description}
            </div>

            <div className="pqr-info">
              <span className="info-item">
                <strong>ID:</strong> {pqr.id?.substring(0, 8)}...
              </span>
              <span className="info-item">
                <strong>Cliente:</strong> {pqr.clientName} {pqr.clientLastName}
              </span>
            </div>

            {pqr.isProcessed && (
              <button
                className="btn-view-result"
                onClick={() => onSelectPqr(pqr)}
              >
                Ver Resultado
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PqrList;
