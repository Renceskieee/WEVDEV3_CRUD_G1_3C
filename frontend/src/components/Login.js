import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
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
            const response = await axios.post('http://localhost:5000/login', formData);
            localStorage.setItem('token', response.data.token);
            onLoginSuccess(); // Update authentication state
            setOpenSuccess(true); // Open success modal
            setTimeout(() => {
                navigate('/home'); // Redirect after showing success modal
            }, 1500); // Show for 1.5 seconds
        } catch (error) {
            console.error('Login Error:', error);
            setErrorMessage('Incorrect password or not registered.'); // Set error message
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
                    height: '60vh', // Reducing height to make it more compact
                    gap: 2, // Adds space between TextField and Button
                    maxWidth: '400px', // Max width to limit the form size
                    margin: 'auto', // Center the form horizontally
                    transform: 'translateX(-100px)',
                }}
            >
                <h1>Login</h1>
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
                    color="primary" 
                    fullWidth
                >
                    Login
                </Button>
                
                {/* Register Link */}
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ textDecoration: 'none', color: 'blue' }}>
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
                    <Button onClick={handleCloseSuccess} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Error Modal */}
            <Dialog open={openError} onClose={handleCloseError}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <p>{errorMessage}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseError} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Login;
