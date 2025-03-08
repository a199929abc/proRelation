import React from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useClients } from '../contexts/ClientContext';

export const Dashboard: React.FC = () => {
  const { totalClients, isLoading } = useClients();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total Clients
            </Typography>
            {isLoading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            ) : (
              <Typography variant="h3">
                {totalClients}
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Meetings
            </Typography>
            <Typography variant="h3">
              0
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Updates
            </Typography>
            <Typography variant="body1">
              No recent updates
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 