import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';

const SuperAdminRegister = () => {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            // Send registration request to your server
            const response = await axios.post('http://localhost:5000/register-super-admin', formData);

            // Show success modal and redirect to login page after 1.5 seconds
            setOpenSuccess(true);
            setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 1500);
        } catch (error) {
            console.error('Registration Error:', error);

            // Show an error message based on the server response
            if (error.response && error.response.status === 400) {
                setErrorMessage('Registration failed. Email may already be in use.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            setOpenError(true);
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
                    height: '60vh', 
                    gap: 2, 
                    maxWidth: '400px', 
                    margin: 'auto', 
                    transform: 'translateX(-100px)',
                }}
            >
                <h1>Super Admin Registration</h1>
                <TextField 
                    label="Email" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
                <TextField 
                    label="Username" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                />
                <Button 
                    onClick={handleRegister} 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                >
                    Register
                </Button>
            </Box>

            {/* Success Modal */}
            <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogContent>
                    <p>Registration successful! Redirecting to login...</p>
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

export default SuperAdminRegister;
