export interface PersonalInfo {
  legalName: string;
  dateOfBirth: Date | null;
  contact: {
    phone: string;
    email: string;
    currentAddress: string;
  };
  status: {
    current: 'Study Permit' | 'Work Permit' | 'PR' | 'Citizen';
    expiryDate?: Date | null;
  };
}

export interface Client {
  id: string;
  personalInfo: PersonalInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientFormData {
  legalName: string;
  dateOfBirth: Date | null;
  phone: string;
  email: string;
  currentAddress: string;
  status: string;
  statusExpiryDate: Date | null;
} 