import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, List, ListItem, ListItemText, Drawer, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import axios from 'axios';
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
import {
  House,
  DoorClosed,
  Bell,
  File,
  SquareActivity,
  FileType2Icon,
  Paperclip,
  Upload as UploadIcon,
  History as HistoryIcon,
  Info,
  Mail,
  SquareUserRound,
  Settings
} from "lucide-react";

const drawerWidth = 240;

function App() {
  const [settings, setSettings] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout dialog
  const [activeNavIndex, setActiveNavIndex] = useState(0); // Active navigation state

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
              <Typography 
                variant="h6" 
                noWrap 
                sx={{
                  color: settings.company_name_color || 'inherit' // Apply company name color
                }}
              >
                {settings.company_name || 'My Company Name'}
              </Typography>
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
              <ListItem
                button
                component={Link}
                to="/home"
                selected={activeNavIndex === 0}
                onClick={() => setActiveNavIndex(0)}
                style={{
                  backgroundColor: activeNavIndex === 0 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <House style={{ marginRight: '10px' }} />
                <ListItemText primary="Home" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/notification"
                selected={activeNavIndex === 1}
                onClick={() => setActiveNavIndex(1)}
                style={{
                  backgroundColor: activeNavIndex === 1 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <Bell style={{ marginRight: '10px' }} />
                <ListItemText primary="Notifications" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/department"
                selected={activeNavIndex === 2}
                onClick={() => setActiveNavIndex(2)}
                style={{
                  backgroundColor: activeNavIndex === 2 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <DoorClosed style={{ marginRight: '10px' }} />
                <ListItemText primary="Departments" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/document"
                selected={activeNavIndex === 3}
                onClick={() => setActiveNavIndex(3)}
                style={{
                  backgroundColor: activeNavIndex === 3 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <File style={{ marginRight: '10px' }} />
                <ListItemText primary="Documents" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/attachment"
                selected={activeNavIndex === 4}
                onClick={() => setActiveNavIndex(4)}
                style={{
                  backgroundColor: activeNavIndex === 4 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <Paperclip style={{ marginRight: '10px' }} />
                <ListItemText primary="Attachments" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/movement"
                selected={activeNavIndex === 5}
                onClick={() => setActiveNavIndex(5)}
                style={{
                  backgroundColor: activeNavIndex === 5 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <SquareActivity style={{ marginRight: '10px' }} />
                <ListItemText primary="Movements" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/type"
                selected={activeNavIndex === 6}
                onClick={() => setActiveNavIndex(6)}
                style={{
                  backgroundColor: activeNavIndex === 6 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <FileType2Icon style={{ marginRight: '10px' }} />
                <ListItemText primary="Types" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/history"
                selected={activeNavIndex === 7}
                onClick={() => setActiveNavIndex(7)}
                style={{
                  backgroundColor: activeNavIndex === 7 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <HistoryIcon style={{ marginRight: '10px' }} />
                <ListItemText primary="History" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/upload"
                selected={activeNavIndex === 8}
                onClick={() => setActiveNavIndex(8)}
                style={{
                  backgroundColor: activeNavIndex === 8 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <UploadIcon style={{ marginRight: '10px' }} />
                <ListItemText primary="Upload" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/profile"
                selected={activeNavIndex === 9}
                onClick={() => setActiveNavIndex(9)}
                style={{
                  backgroundColor: activeNavIndex === 9 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <SquareUserRound style={{ marginRight: '10px' }} />
                <ListItemText primary="Users" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/contact"
                selected={activeNavIndex === 10}
                onClick={() => setActiveNavIndex(10)}
                style={{
                  backgroundColor: activeNavIndex === 10 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <Mail style={{ marginRight: '10px' }} />
                <ListItemText primary="Contact" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/about"
                selected={activeNavIndex === 11}
                onClick={() => setActiveNavIndex(11)}
                style={{
                  backgroundColor: activeNavIndex === 11 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <Info style={{ marginRight: '10px' }} />
                <ListItemText primary="About" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/settings"
                selected={activeNavIndex === 12}
                onClick={() => setActiveNavIndex(12)}
                style={{
                  backgroundColor: activeNavIndex === 12 ? settings.active_nav_index_color || '#1976d2' : 'transparent',
                }}
              >
                <Settings style={{ marginRight: '10px' }} />
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
            <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
            <Route path="/notification" element={isAuthenticated ? <Notification /> : <Navigate to="/login" />} />
            <Route path="/department" element={isAuthenticated ? <Department /> : <Navigate to="/login" />} />
            <Route path="/document" element={isAuthenticated ? <Document /> : <Navigate to="/login" />} />
            <Route path="/attachment" element={isAuthenticated ? <Attachment /> : <Navigate to="/login" />} />
            <Route path="/movement" element={isAuthenticated ? <Movement /> : <Navigate to="/login" />} />
            <Route path="/type" element={isAuthenticated ? <Type /> : <Navigate to="/login" />} />
            <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
            <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
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
            <Button onClick={handleCloseLogoutDialog} color="error">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Router>
  );
}

export default App;
