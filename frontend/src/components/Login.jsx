import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    
    // State for dialog
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            console.log('Attempting login with:', formData);  // Debug log

            // Send login request to your server
            const response = await axios.post('http://localhost:5000/login', formData);
            console.log('Login response:', response);  // Debug log

            // If login is successful, store the JWT token in local storage
            localStorage.setItem('token', response.data.token);
            onLoginSuccess(); // Update authentication state
            
            // Show success modal
            setOpenSuccess(true);
            
            // Set a 5-second delay before redirecting to home
            setTimeout(() => {
                navigate('/home'); // Redirect to home
            }, 5000); // 5000ms = 5 seconds
        } catch (error) {
            console.error('Login Error:', error);

            // Show an error message based on the server response
            if (error.response && error.response.status === 400) {
                setErrorMessage('Incorrect password or not registered.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            setOpenError(true); // Open error modal
        }
    };

    const handleCloseSuccess = () => {
        setOpenSuccess(false);
    };

    const handleCloseError = () => {
        setOpenError(false);
    };

    return (
        <Container>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '70vh', 
                    gap: 2, 
                    maxWidth: '400px', 
                    marginLeft: '405px', 
                    marginTop: '20px',
                    transform: 'translateX(-100px)',
                }}
            >
                <Typography variant="h4" sx={{ margin: '0' }}>
                    Login
                </Typography>
                <TextField 
                    label="Email" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                />
                <Button 
                    onClick={handleLogin} 
                    variant="outlined" 
                    style={{ 
                        backgroundColor: '#B60000',  // Set background color
                        color: '#FFEA00',  
                        marginLeft: 'auto' 
                    }}
                    fullWidth
                >
                    Login
                </Button>
                
                {/* Register Link */}
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ textDecoration: 'none', color: '#B60000' }}>
                        Register here
                    </Link>
                </Typography>
            </Box>

            {/* Success Modal */}
            <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                <DialogTitle>Login Successful</DialogTitle>
                <DialogContent>
                    <p>Welcome back! You will be redirected shortly.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccess} color="error" variant='contained'>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Error Modal */}
            <Dialog open={openError} onClose={handleCloseError}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <p>{errorMessage}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError} color="error" variant='contained'>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Login;
