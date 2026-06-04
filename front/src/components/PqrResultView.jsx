import React, { useState, useEffect } from 'react';
import { useClient } from '../context/ClientContext';
import pqrService from '../services/pqrService';
import './PqrResultView.css';

const PqrResultView = ({ pqr, onBack }) => {
  const { client } = useClient();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [pqr.id]);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pqrService.getPqrResult(client.email, pqr.id);
      setResult(response.data);
    } catch (err) {
      setError('Error al cargar el resultado');
      console.error(err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="loading">Cargando resultado...</div>;
  }

  return (
    <div className="result-view-container">
      <button className="btn-back" onClick={onBack}>
        ← Volver a mis PQRs
      </button>

      <div className="result-card">
        <div className="result-header">
          <h2>Resultado de la PQR</h2>
          <span className="badge status-processed">Procesada</span>
        </div>

        {error && (
          <div className="error-alert">{error}</div>
        )}

        {!error && (
          <>
            <div className="result-details">
              <div className="detail-group">
                <label>Tipo de PQR</label>
                <p>{getPqrTypeLabel(pqr.pqrType)}</p>
              </div>

              <div className="detail-group">
                <label>ID de la PQR</label>
                <p className="id-text">{pqr.id}</p>
              </div>

              <div className="detail-group">
                <label>Cliente</label>
                <p>{pqr.clientName} {pqr.clientLastName}</p>
              </div>

              <div className="detail-group">
                <label>Teléfono</label>
                <p>{pqr.clientPhone}</p>
              </div>

              <div className="detail-group full-width">
                <label>Descripción de la Solicitud</label>
                <p className="description-text">{pqr.description}</p>
              </div>

              <div className="detail-group full-width">
                <label>Resultado del Proceso</label>
                <div className="result-content">
                  {result || 'Procesando resultado...'}
                </div>
              </div>

              <div className="detail-group">
                <label>Fecha de Creación</label>
                <p>{new Date(pqr.progationDate).toLocaleDateString('es-CO')}</p>
              </div>
            </div>

            <div className="actions">
              <button className="btn-print" onClick={() => window.print()}>
                📄 Imprimir
              </button>
              <button className="btn-download">
                ⬇ Descargar PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PqrResultView;
