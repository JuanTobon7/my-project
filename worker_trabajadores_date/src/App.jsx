import React, { useEffect, useState } from 'react';
import { ClientProvider, useClient } from './context/ClientContext';
import PqrList from './components/PqrList';
import EmploymentList from './components/EmploymentList';
import './App.css';

const AppContent = () => {
  const { client, loadClientFromStorage } = useClient();
  const [refreshPqrs, setRefreshPqrs] = useState(0);
  const [selectedPqr, setSelectedPqr] = useState(null);

  useEffect(() => {
    loadClientFromStorage();
  }, []);

  return (
    <div className="app">

      {/* PQRs del cliente + agendar visita desde cada PQR */}
      {client && (
        <section className="app-section">
          <PqrList
            refresh={refreshPqrs}
            onSelectPqr={(pqr) => setSelectedPqr(pqr)}
          />
        </section>
      )}

      {/* Detalle de PQR procesada */}
      {selectedPqr && (
        <section className="app-section app-section--highlight">
          <div className="pqr-result">
            <div className="pqr-result__header">
              <h3>Resultado PQR</h3>
              <button
                className="pqr-result__close"
                onClick={() => setSelectedPqr(null)}
              >
                ✕
              </button>
            </div>
            <pre className="pqr-result__body">
              {JSON.stringify(selectedPqr, null, 2)}
            </pre>
          </div>
        </section>
      )}

      {/* Lista de trabajadores + agendar visita desde cada trabajador */}
      <section className="app-section">
        <EmploymentList />
      </section>

    </div>
  );
};

function App() {
  return (
    <ClientProvider>
      <AppContent />
    </ClientProvider>
  );
}

export default App;
