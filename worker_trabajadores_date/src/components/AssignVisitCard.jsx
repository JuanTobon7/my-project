import React, { useState } from 'react';
import { runVisitAssignFlow } from '../services/camundaService';
import './AssignVisitCard.css';

/**
 * AssignVisitCard
 *
 * Tarjeta reutilizable para asignar una visita técnica.
 * Puede usarse dentro de PqrList o EmploymentList.
 *
 * Props:
 *   workers  - People[] lista de trabajadores disponibles
 *   label    - string  título contextual (ej: "PQR #abc123" o "Trabajador: Juan")
 *   onDone   - fn(task) callback cuando la asignación fue exitosa
 */
const AssignVisitCard = ({ workers = [], label = '', onDone }) => {
  const [employementPhone, setEmployementPhone] = useState('');
  const [dateVisit, setDateVisit]               = useState('');
  const [status, setStatus]                     = useState('idle'); // idle | loading | done | error
  const [message, setMessage]                   = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async () => {
    if (!employementPhone || !dateVisit) {
      setStatus('error');
      setMessage('Selecciona un trabajador y una fecha de visita.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const task = await runVisitAssignFlow(dateVisit, employementPhone);
      setStatus('done');
      const worker = workers.find(w => String(w.phone) === String(employementPhone));
      setMessage(
        `Visita asignada a ${worker ? `${worker.name} ${worker.lastName}` : employementPhone} el ${dateVisit}`
      );
      onDone?.(task);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setMessage('');
    setEmployementPhone('');
    setDateVisit('');
  };

  return (
    <div className={`assign-card ${status === 'done' ? 'assign-card--done' : ''}`}>
      {label && <p className="assign-card__label">{label}</p>}

      <h4 className="assign-card__title">Agendar visita técnica</h4>

      {status === 'done' ? (
        <div className="assign-card__success">
          <span className="assign-card__check">✓</span>
          <p>{message}</p>
          <button className="assign-card__reset" onClick={handleReset}>
            Nueva asignación
          </button>
        </div>
      ) : (
        <>
          <div className="assign-card__fields">
            <div className="assign-card__field">
              <label className="assign-card__field-label">Trabajador</label>
              {workers.length === 0 ? (
                <p className="assign-card__empty">No hay trabajadores disponibles.</p>
              ) : (
                <select
                  className="assign-card__select"
                  value={employementPhone}
                  disabled={status === 'loading'}
                  onChange={e => setEmployementPhone(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {workers.map(w => (
                    <option key={w.phone} value={w.phone}>
                      {w.name} {w.lastName} — {w.email}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="assign-card__field">
              <label className="assign-card__field-label">Fecha de visita</label>
              <input
                type="date"
                className="assign-card__date"
                value={dateVisit}
                min={today}
                disabled={status === 'loading'}
                onChange={e => setDateVisit(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <p className={`assign-card__message assign-card__message--error`}>
              {message}
            </p>
          )}

          <button
            className="assign-card__btn"
            disabled={status === 'loading' || workers.length === 0}
            onClick={handleSubmit}
          >
            {status === 'loading' ? (
              <span className="assign-card__spinner" />
            ) : (
              'Confirmar visita'
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default AssignVisitCard;
