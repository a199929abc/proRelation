import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, ClientFormData } from '../types/client';
import { clientService } from '../services/clientService';

interface ClientContextType {
  clients: Client[];
  totalClients: number;
  loadClients: () => void;
  addClient: (clientData: ClientFormData) => Client;
  updateClient: (id: string, updates: Partial<Client>) => Client | undefined;
  deleteClient: (id: string) => boolean;
  isLoading: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadClients = () => {
    const loadedClients = clientService.getAllClients();
    setClients(loadedClients);
    setIsLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const addClient = (clientData: ClientFormData) => {
    const newClient = clientService.createClient(clientData);
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updatedClient = clientService.updateClient(id, updates);
    if (updatedClient) {
      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
    }
    return updatedClient;
  };

  const deleteClient = (id: string) => {
    const success = clientService.deleteClient(id);
    if (success) {
      setClients(prev => prev.filter(client => client.id !== id));
    }
    return success;
  };

  const value = {
    clients,
    totalClients: clients.length,
    loadClients,
    addClient,
    updateClient,
    deleteClient,
    isLoading,
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}; 