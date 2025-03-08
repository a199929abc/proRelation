import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ClientFormData } from '../../types/client';
import { useClients } from '../../contexts/ClientContext';

export const EditClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, updateClient, isLoading } = useClients();
  const [formData, setFormData] = useState<ClientFormData>({
    legalName: '',
    dateOfBirth: null,
    phone: '',
    email: '',
    currentAddress: '',
    status: '',
    statusExpiryDate: null,
  });
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const client = clients.find(c => c.id === id);
    if (client) {
      setFormData({
        legalName: client.personalInfo.legalName,
        dateOfBirth: client.personalInfo.dateOfBirth,
        phone: client.personalInfo.contact.phone,
        email: client.personalInfo.contact.email,
        currentAddress: client.personalInfo.contact.currentAddress,
        status: client.personalInfo.status.current,
        statusExpiryDate: client.personalInfo.status.expiryDate,
      });
    }
  }, [id, clients]);

  const validateForm = () => {
    // Required fields validation
    if (!formData.legalName) return 'Legal Name is required';
    if (!formData.phone) return 'Phone is required';
    if (!formData.email) return 'Email is required';
    if (!formData.currentAddress) return 'Current Address is required';
    if (!formData.status) return 'Status is required';

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    // Phone format validation (assuming North American format)
    const phoneRegex = /^\+?1?\d{10,}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      return 'Please enter a valid phone number (minimum 10 digits)';
    }

    // Date validations
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      if (birthDate > new Date()) {
        return 'Date of birth cannot be in the future';
      }
    }

    // Status expiry date validation
    if (formData.status === 'Citizen' && formData.statusExpiryDate) {
      return 'Citizens do not need a status expiry date';
    }

    if (['Study Permit', 'Work Permit'].includes(formData.status) && !formData.statusExpiryDate) {
      return `${formData.status} requires an expiry date`;
    }

    if (formData.statusExpiryDate) {
      const expiryDate = new Date(formData.statusExpiryDate);
      if (expiryDate < new Date()) {
        return 'Status expiry date cannot be in the past';
      }
    }

    return '';
  };

  // Add real-time field validation
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateField = (field: keyof ClientFormData, value: any) => {
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value ? 'Email is required' : 
               !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      
      case 'phone':
        const phoneRegex = /^\+?1?\d{10,}$/;
        return !value ? 'Phone is required' : 
               !phoneRegex.test(value.replace(/\D/g, '')) ? 'Please enter a valid phone number (minimum 10 digits)' : '';
      
      case 'status':
        if (!value) return 'Status is required';
        if (['Study Permit', 'Work Permit'].includes(value) && !formData.statusExpiryDate) {
          return `${value} requires an expiry date`;
        }
        return '';

      case 'statusExpiryDate':
        if (['Study Permit', 'Work Permit'].includes(formData.status) && !value) {
          return 'Expiry date is required for this status';
        }
        if (value && new Date(value) < new Date()) {
          return 'Expiry date cannot be in the past';
        }
        return '';

      case 'dateOfBirth':
        if (value && new Date(value) > new Date()) {
          return 'Date of birth cannot be in the future';
        }
        return '';

      default:
        if (field === 'legalName' || field === 'currentAddress') {
          return !value ? `${field} is required` : '';
        }
        return '';
    }
  };

  const handleFieldChange = (field: keyof ClientFormData, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    const error = validateField(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));

    // Update related fields' errors
    if (field === 'status') {
      const expiryError = validateField('statusExpiryDate', formData.statusExpiryDate);
      setFieldErrors(prev => ({
        ...prev,
        statusExpiryDate: expiryError
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const updatedClient = updateClient(id!, {
        personalInfo: {
          legalName: formData.legalName,
          dateOfBirth: formData.dateOfBirth,
          contact: {
            phone: formData.phone,
            email: formData.email,
            currentAddress: formData.currentAddress,
          },
          status: {
            current: formData.status as any,
            expiryDate: formData.statusExpiryDate,
          },
        },
      });

      if (updatedClient) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate(`/clients/${id}`);
        }, 1500);
      } else {
        setError('Failed to update client. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (field: 'dateOfBirth' | 'statusExpiryDate', value: string) => {
    const date = value ? new Date(value) : null;
    setFormData({ ...formData, [field]: date });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!clients.find(c => c.id === id)) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Client not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/clients/${id}`)}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Edit Client
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Legal Name"
              value={formData.legalName}
              onChange={(e) => handleFieldChange('legalName', e.target.value)}
              error={!!fieldErrors.legalName}
              helperText={fieldErrors.legalName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date of Birth"
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleFieldChange('dateOfBirth', date);
              }}
              error={!!fieldErrors.dateOfBirth}
              helperText={fieldErrors.dateOfBirth}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              error={!!fieldErrors.phone}
              helperText={fieldErrors.phone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Current Address"
              value={formData.currentAddress}
              onChange={(e) => handleFieldChange('currentAddress', e.target.value)}
              error={!!fieldErrors.currentAddress}
              helperText={fieldErrors.currentAddress}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              select
              label="Current Status"
              value={formData.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              error={!!fieldErrors.status}
              helperText={fieldErrors.status}
            >
              <MenuItem value="Study Permit">Study Permit</MenuItem>
              <MenuItem value="Work Permit">Work Permit</MenuItem>
              <MenuItem value="PR">PR</MenuItem>
              <MenuItem value="Citizen">Citizen</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Status Expiry Date"
              InputLabelProps={{ shrink: true }}
              value={formData.statusExpiryDate ? new Date(formData.statusExpiryDate).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleFieldChange('statusExpiryDate', date);
              }}
              error={!!fieldErrors.statusExpiryDate}
              helperText={fieldErrors.statusExpiryDate}
              disabled={formData.status === 'Citizen'}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/clients/${id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Client updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}; 