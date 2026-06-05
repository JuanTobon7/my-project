// App.jsx
import React, { useEffect, useState } from 'react';
import { ClientProvider, useClient } from './context/ClientContext';
import ClientLoginForm from './components/ClientLoginForm';
import Dashboard from './components/Dashboard';
import PersonRegistrationForm from './components/PersonRegistrationForm';
import './App.css';

const AppContent = () => {
  const { client, loadClientFromStorage } = useClient();
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    loadClientFromStorage();
  }, []);

  if (!client) return <ClientLoginForm />;

  return (
    <div className="app">
      {currentPage === "dashboard" && (
        <Dashboard onNavigate={setCurrentPage} />
      )}
      {currentPage === "register-person" && (
        <PersonRegistrationForm onBack={() => setCurrentPage("dashboard")} />
      )}
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