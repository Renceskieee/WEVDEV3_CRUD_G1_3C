import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container } from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
          await axios.post('http://localhost:5000/register', formData);
          navigate('/login');
        } catch (error) {
          console.error('Registration Error:', error);
        }
    };

        return (
            <Container>
                <h1>Register</h1>
                <TextField  label="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                <TextField label="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <TextField label="Password" type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                <Button variant="outlined" onClick={handleRegister}>Register</Button>
            </Container>
    );

};

export default Register;