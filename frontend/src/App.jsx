import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, List, ListItem, ListItemText, Drawer, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import SettingsForm from './SettingsForm';
import Register from "./components/Register";
import Login from "./components/Login";
import Document from "./components/Document";
import Department from "./components/Department";
import Notification from "./components/Notification";
import Attachment from "./components/Attachment";
import Movement from "./components/Movement";
import Type from "./components/Type";
import History from "./components/History";
import Upload from "./components/Upload";
import Profile from "./components/Profile";

const drawerWidth = 180;
const compactDrawerWidth = 120;

function App() {
  const [settings, setSettings] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout dialog
  const [activeNavIndex, setActiveNavIndex] = useState(0); // Active navigation state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setActiveNavIndex(0); // Reset the activeNavIndex to 0 (Home)
    setOpenLogoutDialog(true); // Open the logout dialog
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const onLoginSuccess = () => {
    setIsAuthenticated(true); // Mark user as authenticated
    setActiveNavIndex(0); // Highlight Home page on login
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header - always visible */}
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
            <Typography 
              variant="h6" 
              noWrap 
              sx={{
                color: settings.company_name_color || 'inherit' // Apply company name color
              }}
            >
              {settings.company_name || 'My Company Name'}
            </Typography>

            {/* Conditionally render the Logout button if authenticated */}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="contained"
                style={{ 
                  backgroundColor: 'yellow',  // Set background color
                  color: '#B60000',  
                  marginLeft: 'auto' 
                }}
              >
                Log out
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        {isAuthenticated && <Sidebar settings={settings} setIsSidebarOpen={setIsSidebarOpen} />}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            marginLeft: isSidebarOpen ? `${drawerWidth}px` : `${compactDrawerWidth}px`,
            transition: 'margin-left 0.3s ease-in-out',
            width: '85%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '80px',
            paddingBottom: '60px',
          }}
        >
          <Toolbar />
          <Routes>
            {/* Authenticated Routes */}
            <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" />} />
            <Route path="/contact" element={isAuthenticated ? <Contact /> : <Navigate to="/login" />} />
            <Route path="/settings" element={isAuthenticated ? <SettingsForm onUpdate={fetchSettings} /> : <Navigate to="/login" />} />
            <Route path="/notification" element={isAuthenticated ? <Notification /> : <Navigate to="/login" />} />
            <Route path="/department" element={isAuthenticated ? <Department /> : <Navigate to="/login" />} />
            <Route path="/document" element={isAuthenticated ? <Document /> : <Navigate to="/login" />} />
            <Route path="/attachment" element={isAuthenticated ? <Attachment /> : <Navigate to="/login" />} />
            <Route path="/movement" element={isAuthenticated ? <Movement /> : <Navigate to="/login" />} />
            <Route path="/type" element={isAuthenticated ? <Type /> : <Navigate to="/login" />} />
            <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
            <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />

            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={!isAuthenticated ? <Login onLoginSuccess={onLoginSuccess} /> : <Navigate to="/home" />} />

            {/* Redirect to /home or /login based on authentication */}
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
          <Typography 
            variant="body1" 
            sx={{ color: settings.footer_text_color || 'inherit' }} // Apply footer text color
          >
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
            <Button onClick={handleCloseLogoutDialog} color="error" variant='contained'>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Router>
  );
}

export default App;
