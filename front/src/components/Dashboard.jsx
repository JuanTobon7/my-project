import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../context/ClientContext';
import CreatePqrForm from './CreatePqrForm';
import PqrList from './PqrList';
import PqrResultView from './PqrResultView';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { client, logout } = useClient();
  const [view, setView] = useState('list'); // 'list', 'create', 'result'
  const [selectedPqr, setSelectedPqr] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateClick = () => {
    setView('create');
  };

  const handleCreateSuccess = () => {
    setView('list');
    setRefreshKey(prev => prev + 1);
  };

  const handleSelectPqr = (pqr) => {
    setSelectedPqr(pqr);
    setView('result');
  };

  const handleBack = () => {
    setSelectedPqr(null);
    setView('list');
  };

  const handleLogout = () => {
    if (window.confirm('¿Deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <h1>🎯 Sistema de PQR</h1>
            <p>Peticiones, Quejas y Reclamos</p>
          </div>

          <div className="nav-user">
            <div className="user-info">
              <p className="user-name">{client.name} {client.lastName}</p>
              <p className="user-email">{client.email}</p>
            </div>
            <button className="btn-register-person" onClick={() => navigate('/register-person')}>
              Registrar Persona
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {view === 'list' && (
          <>
            <div className="view-header">
              <h2>Mis PQRs</h2>
              <button className="btn-create" onClick={handleCreateClick}>
                + Nueva PQR
              </button>
            </div>
            <PqrList
              onSelectPqr={handleSelectPqr}
              refresh={refreshKey}
            />
          </>
        )}

        {view === 'create' && (
          <CreatePqrForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setView('list')}
          />
        )}

        {view === 'result' && selectedPqr && (
          <PqrResultView
            pqr={selectedPqr}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
