// App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ClientProvider, useClient } from './context/ClientContext';
import ClientLoginForm from './components/ClientLoginForm';
import Dashboard from './components/Dashboard';
import PersonRegistrationForm from './components/PersonRegistrationForm';
import './App.css';

const AppContent = () => {
  const { client, loadClientFromStorage } = useClient();

  useEffect(() => {
    loadClientFromStorage();
  }, []);

  if (!client) return <ClientLoginForm />;

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register-person" element={<PersonRegistrationForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
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