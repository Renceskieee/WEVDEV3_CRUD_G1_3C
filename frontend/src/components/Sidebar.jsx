import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  House, Bell, DoorClosed, File, SquareActivity, FileType2Icon,
  Paperclip, Upload as UploadIcon, History as HistoryIcon,
  Mail, Info, SquareUserRound, Settings
} from "lucide-react";

const drawerWidth = 180;
const compactDrawerWidth = 70;

const Sidebar = ({ settings, setIsSidebarOpen }) => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsSidebarOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: isHovered ? drawerWidth : compactDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isHovered ? drawerWidth : compactDrawerWidth,
          alignItems: 'center',
          overflowX: 'hidden',
          transition: 'width 0.3s ease-in-out',
        },
      }}
    >
      <Toolbar />
      <List>
        {[
          { icon: <House />, text: 'Home', to: '/home' },
          { icon: <Bell />, text: 'Notifications', to: '/notification' },
          { icon: <DoorClosed />, text: 'Departments', to: '/department' },
          { icon: <FileType2Icon />, text: 'Types', to: '/type' },
          { icon: <File />, text: 'Documents', to: '/document' },
          { icon: <Paperclip />, text: 'Attachments', to: '/attachment' },
          { icon: <SquareActivity />, text: 'Movements', to: '/movement' },
          { icon: <HistoryIcon />, text: 'History', to: '/history' },
          { icon: <UploadIcon />, text: 'Upload', to: '/upload' },
          { icon: <SquareUserRound />, text: 'Users', to: '/profile' },
          { icon: <Mail />, text: 'Contact', to: '/contact' },
          { icon: <Info />, text: 'About', to: '/about' },
          { icon: <Settings />, text: 'Settings', to: '/settings' }
        ].map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.to}
            onClick={() => setActiveNavIndex(index)}
            sx={{
              padding: '10px',
              display: 'flex',
              width: '100%',
              backgroundColor: activeNavIndex === index ? settings.active_nav_index_color || '#1976d2' : 'transparent',
              minHeight: '40px',
              borderRadius: '5px',
              '&:hover': {
                backgroundColor: settings.active_nav_index_color || '#1976d2',
              }
            }}
          >
            {item.icon}
            {isHovered && <ListItemText primary={item.text} sx={{ marginLeft: 2, fontSize: '12px' }} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
