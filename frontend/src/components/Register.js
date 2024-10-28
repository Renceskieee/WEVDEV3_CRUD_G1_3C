import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation
import { TextField, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography } from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();
    
    // State for dialog
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/register', formData);
            setOpenSuccess(true); // Open success modal
            setTimeout(() => {
                navigate('/login'); // Redirect after showing success modal
            }, 1500); // Show for 1.5 seconds
        } catch (error) {
            console.error('Registration Error:', error);
            setErrorMessage('Registration failed. Please try again.'); // Set error message
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
                <h1>Register</h1>
                <TextField 
                    label="Username" 
                    variant="outlined" 
                    fullWidth 
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                />
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
                    onClick={handleRegister} 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                >
                    Register
                </Button>

                {/* Login Link */}
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>
                        Login here
                    </Link>
                </Typography>
            </Box>

            {/* Success Modal */}
            <Dialog open={openSuccess} onClose={handleCloseSuccess}>
                <DialogTitle>Registration Successful</DialogTitle>
                <DialogContent>
                    <p>Registration completed successfully! You will be redirected shortly.</p>
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

export default Register;
