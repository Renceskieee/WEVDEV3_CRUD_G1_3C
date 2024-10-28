import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, List, ListItem, ListItemText, Drawer, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SettingsForm from './SettingsForm';
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const drawerWidth = 240;

function App() {
  const [settings, setSettings] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout dialog

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Update the authentication state
    setOpenLogoutDialog(true); // Open the logout dialog
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header - shown only when authenticated */}
        {isAuthenticated && (
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: settings.header_color || 'primary' }}
          >
            <Toolbar>
              {settings.logo_url && (
                <img
                  src={`http://localhost:5000${settings.logo_url}`}
                  alt="Logo"
                  style={{ height: '40px', marginRight: '10px' }}
                />
              )}
              <Typography variant="h6" noWrap>
                {settings.company_name || 'My Company Name'}
              </Typography>
              <Button onClick={handleLogout} variant="contained" color="error" style={{ marginLeft: 'auto' }}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        )}

        {/* Sidebar - shown only when authenticated */}
        {isAuthenticated && (
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
          >
            <Toolbar />
            <List>
              <ListItem button component={Link} to="/home">
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={Link} to="/dashboard">
                <ListItemText primary="Dashboard" />
              </ListItem>
              <ListItem button component={Link} to="/about">
                <ListItemText primary="About" />
              </ListItem>
              <ListItem button component={Link} to="/contact">
                <ListItemText primary="Contact" />
              </ListItem>
              <ListItem button component={Link} to="/settings">
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px` }}
        >
          <Toolbar />
          <Routes>
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
            <Route path="/contact" element={isAuthenticated ? <Contact /> : <Navigate to="/login" />} />
            <Route path="/settings" element={isAuthenticated ? <SettingsForm onUpdate={fetchSettings} /> : <Navigate to="/login" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          </Routes>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            width: '100%',
            position: 'relative',
            bottom: 0,
            left: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: settings.footer_color || '#ffffff',
            color: 'black',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <Typography variant="body1">
            {settings.footer_text || 'Default Footer Text'}
          </Typography>
        </Box>

        {/* Logout Modal */}
        <Dialog
          open={openLogoutDialog}
          onClose={handleCloseLogoutDialog}
          aria-labelledby="logout-dialog-title"
        >
          <DialogTitle id="logout-dialog-title">Logged Out</DialogTitle>
          <DialogContent>
            <Typography>You have successfully logged out.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLogoutDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Router>
  );
}

export default App;
