import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useClients } from '../../contexts/ClientContext';

export const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, isLoading } = useClients();
  
  const client = clients.find(c => c.id === id);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!client) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Client not found
      </Alert>
    );
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Client Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/clients/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Legal Name
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.personalInfo.legalName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(client.personalInfo.dateOfBirth)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.personalInfo.contact.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.personalInfo.contact.email}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Address
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.personalInfo.contact.currentAddress}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Current Status
            </Typography>
            <Typography variant="body1" gutterBottom>
              {client.personalInfo.status.current}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status Expiry Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(client.personalInfo.status.expiryDate)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* TODO: Investment Accounts Section - Future Extension */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Investment Accounts
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Coming soon...
        </Typography>
      </Paper>

      {/* TODO: Insurance Information Section - Future Extension */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Insurance Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Coming soon...
        </Typography>
      </Paper>

      {/* TODO: Meeting History Section - Future Extension */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Meeting History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Coming soon...
        </Typography>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Last Updated: {new Date(client.updatedAt).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}; 