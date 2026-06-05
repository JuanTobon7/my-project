import React, { createContext, useState, useContext } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [client, setClient] = useState(null);

  const setClientData = (clientData) => {
    setClient(clientData);
    localStorage.setItem('client', JSON.stringify(clientData));
  };

  const logout = () => {
    setClient(null);
    localStorage.removeItem('client');
  };

  const loadClientFromStorage = () => {
    const stored = localStorage.getItem('client');
    if (stored) {
      setClient(JSON.parse(stored));
    }
  };

  return (
    <ClientContext.Provider value={{ client, setClientData, logout, loadClientFromStorage }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient debe ser usado dentro de ClientProvider');
  }
  return context;
};
