import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, List, ListItem, ListItemText, Drawer } from '@mui/material';
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
  }, []);

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
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
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
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
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
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

        {/* Main Content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px` }}
        >
          <Toolbar />
          <Routes>

          <Route  path="/"  element={<Register />}  />
      <Route  path="/login"  element={<Login />}  />
      <Route  path="/dashboard"  element={<Dashboard />}  />



            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<SettingsForm onUpdate={fetchSettings} />} />
          </Routes>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            width: '100%', // Make sure it spans the full width
            position: 'relative', // Adjust positioning
            bottom: 0, // Fix it to the bottom
            left: 0, // Align to the left side
            zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above the drawer z-index
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
      </Box>
    </Router>
  );
}

export default App;