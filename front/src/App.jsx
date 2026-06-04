import React, { useEffect } from 'react';
import { ClientProvider, useClient } from './context/ClientContext';
import ClientLoginForm from './components/ClientLoginForm';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent = () => {
  const { client, loadClientFromStorage } = useClient();

  useEffect(() => {
    loadClientFromStorage();
  }, []);

  return (
    <div className="app">
      {client ? <Dashboard /> : <ClientLoginForm />}
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
