import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { ClientList } from './pages/clients/ClientList';
import { NewClient } from './pages/clients/NewClient';
import { ClientProvider } from './contexts/ClientContext';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClientProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="clients" element={<ClientList />} />
              <Route path="clients/new" element={<NewClient />} />
              {/* Add more routes here as we create more pages */}
            </Route>
          </Routes>
        </Router>
      </ClientProvider>
    </ThemeProvider>
  );
}

export default App;
