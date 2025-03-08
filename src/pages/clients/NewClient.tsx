import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
} from '@mui/material';
import { ClientFormData } from '../../types/client';
import { useClients } from '../../contexts/ClientContext';

const initialFormData: ClientFormData = {
  legalName: '',
  dateOfBirth: null,
  phone: '',
  email: '',
  currentAddress: '',
  status: '',
  statusExpiryDate: null,
};

export const NewClient: React.FC = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    if (!formData.legalName) return 'Legal Name is required';
    if (!formData.phone) return 'Phone is required';
    if (!formData.email) return 'Email is required';
    if (!formData.currentAddress) return 'Current Address is required';
    if (!formData.status) return 'Status is required';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      addClient(formData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/clients');
      }, 1500);
    } catch (err) {
      setError('Failed to create client. Please try again.');
    }
  };

  const handleDateChange = (field: 'dateOfBirth' | 'statusExpiryDate', value: string) => {
    const date = value ? new Date(value) : null;
    setFormData({ ...formData, [field]: date });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        New Client
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Legal Name"
                value={formData.legalName}
                onChange={(e) => {
                  setError('');
                  setFormData({ ...formData, legalName: e.target.value });
                }}
                error={!!error && !formData.legalName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('dateOfBirth', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!error && !formData.status}>
                <InputLabel>Current Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Current Status"
                  onChange={(e) => {
                    setError('');
                    setFormData({ ...formData, status: e.target.value });
                  }}
                >
                  <MenuItem value="Study Permit">Study Permit</MenuItem>
                  <MenuItem value="Work Permit">Work Permit</MenuItem>
                  <MenuItem value="PR">Permanent Resident</MenuItem>
                  <MenuItem value="Citizen">Citizen</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status Expiry Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.statusExpiryDate ? formData.statusExpiryDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('statusExpiryDate', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => {
                  setError('');
                  setFormData({ ...formData, phone: e.target.value });
                }}
                error={!!error && !formData.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setError('');
                  setFormData({ ...formData, email: e.target.value });
                }}
                error={!!error && !formData.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Current Address"
                value={formData.currentAddress}
                onChange={(e) => {
                  setError('');
                  setFormData({ ...formData, currentAddress: e.target.value });
                }}
                error={!!error && !formData.currentAddress}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate('/clients')}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Create Client
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
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
          Client created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}; 