import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container } from '@mui/material';


const Login = () => { 
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Error:', error);
        }
    };


    return(
        <Container>
            <h1>Login</h1>
            <TextField label="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField label="Password" type="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <Button onClick={handleLogin}>Login</Button>
        </Container>
    );
};

export default Login;