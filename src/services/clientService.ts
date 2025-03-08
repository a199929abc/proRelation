import { Client, ClientFormData, PersonalInfo } from '../types/client';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'apple_crm_clients';

// Helper function to get clients from localStorage
const getClients = (): Client[] => {
  const clients = localStorage.getItem(STORAGE_KEY);
  return clients ? JSON.parse(clients) : [];
};

// Helper function to save clients to localStorage
const saveClients = (clients: Client[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
};

export const clientService = {
  // Create a new client
  createClient: (formData: ClientFormData): Client => {
    const clients = getClients();
    
    const newClient: Client = {
      id: uuidv4(),
      personalInfo: {
        legalName: formData.legalName,
        dateOfBirth: formData.dateOfBirth,
        contact: {
          phone: formData.phone,
          email: formData.email,
          currentAddress: formData.currentAddress,
        },
        status: {
          current: formData.status as PersonalInfo['status']['current'],
          expiryDate: formData.statusExpiryDate,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    clients.push(newClient);
    saveClients(clients);
    return newClient;
  },

  // Get all clients
  getAllClients: (): Client[] => {
    return getClients();
  },

  // Get client by ID
  getClientById: (id: string): Client | undefined => {
    const clients = getClients();
    return clients.find(client => client.id === id);
  },

  // Update client
  updateClient: (id: string, updates: Partial<Client>): Client | undefined => {
    const clients = getClients();
    const index = clients.findIndex(client => client.id === id);
    
    if (index === -1) return undefined;

    const updatedClient = {
      ...clients[index],
      ...updates,
      updatedAt: new Date(),
    };

    clients[index] = updatedClient;
    saveClients(clients);
    return updatedClient;
  },

  // Delete client
  deleteClient: (id: string): boolean => {
    const clients = getClients();
    const filteredClients = clients.filter(client => client.id !== id);
    
    if (filteredClients.length === clients.length) return false;
    
    saveClients(filteredClients);
    return true;
  },
}; 