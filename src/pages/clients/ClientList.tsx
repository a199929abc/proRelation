import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../../contexts/ClientContext';

type ViewMode = 'list' | 'card';

export const ClientList: React.FC = () => {
  const navigate = useNavigate();
  const { clients, deleteClient, isLoading } = useClients();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Study Permit': return 'info';
      case 'Work Permit': return 'warning';
      case 'PR': return 'success';
      case 'Citizen': return 'primary';
      default: return 'default';
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = searchTerm === '' || 
        client.personalInfo.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.personalInfo.contact.phone.includes(searchTerm) ||
        client.personalInfo.contact.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || 
        client.personalInfo.status.current === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, statusFilter]);

  const renderListView = () => (
    <List component={Paper}>
      {filteredClients.map((client) => (
        <React.Fragment key={client.id}>
          <ListItem
            sx={{
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1">
                    {client.personalInfo.legalName}
                  </Typography>
                  <Chip
                    label={client.personalInfo.status.current}
                    color={getStatusColor(client.personalInfo.status.current) as any}
                    size="small"
                  />
                </Box>
              }
              secondary={
                <Box display="flex" gap={2} mt={0.5}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {client.personalInfo.contact.phone}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {client.personalInfo.contact.email}
                    </Typography>
                  </Box>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/clients/${client.id}/edit`);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(client.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );

  const renderCardView = () => (
    <Grid container spacing={2}>
      {filteredClients.map((client) => (
        <Grid item xs={12} sm={6} md={4} key={client.id}>
          <Card>
            <CardContent>
              <Box mb={2}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  {client.personalInfo.legalName}
                </Typography>
                <Chip
                  label={client.personalInfo.status.current}
                  color={getStatusColor(client.personalInfo.status.current) as any}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    {client.personalInfo.contact.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {client.personalInfo.contact.email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/clients/${client.id}/edit`)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(client.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Clients
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/clients/new')}
        >
          New Client
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search clients..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Study Permit">Study Permit</MenuItem>
            <MenuItem value="Work Permit">Work Permit</MenuItem>
            <MenuItem value="PR">PR</MenuItem>
            <MenuItem value="Citizen">Citizen</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newValue) => newValue && setViewMode(newValue)}
          size="small"
        >
          <ToggleButton value="list">
            <Tooltip title="List view">
              <ViewListIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="card">
            <Tooltip title="Card view">
              <ViewModuleIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : filteredClients.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            {searchTerm || statusFilter !== 'all'
              ? 'No clients match your search criteria.'
              : 'No clients yet. Click "New Client" to add one.'}
          </Typography>
        </Paper>
      ) : (
        viewMode === 'list' ? renderListView() : renderCardView()
      )}
    </Box>
  );
}; 