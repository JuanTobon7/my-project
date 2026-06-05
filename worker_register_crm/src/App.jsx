// App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ClientProvider, useClient } from './context/ClientContext';
import PersonRegistrationForm from './components/PersonRegistrationForm';
import './App.css';

const AppContent = () => {
  const { client, loadClientFromStorage } = useClient();

  useEffect(() => {
    loadClientFromStorage();
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/register-person" element={<PersonRegistrationForm />} />
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