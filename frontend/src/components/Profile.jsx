import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    IconButton,
} from '@mui/material';
import { Edit, Delete, Print } from '@mui/icons-material';

const Profile = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        role: '', // Default value is empty
        department_id: '',
    });
    const [editUser, setEditUser] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const resetForm = () => {
        setFormData({
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            role: '', // Reset role to empty
            department_id: '',
        });
        setEditUser(null);
    };

    const validateForm = () => {
        if (!formData.username.trim() || !formData.department_id.trim()) {
            alert('Please fill in all required fields');
            return false;
        }
        if (!formData.role.trim()) {
            alert('Please select a role');
            return false;
        }
        return true;
    };

    const updateUser = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(`http://localhost:5000/users/${editUser.id}`, formData);
            showSnackbar('User updated successfully.', 'success');
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            showSnackbar('User deleted successfully.', 'success');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditClick = (user) => {
        setEditUser(user);
        setFormData({
            username: user.username || '',       // Default to empty string if null or undefined
            first_name: user.first_name || '',   // Default to empty string if null or undefined
            last_name: user.last_name || '',     // Default to empty string if null or undefined
            email: user.email || '',             // Default to empty string if null or undefined
            role: user.role || '',               // Default to empty string if null or undefined
            department_id: user.department_id?.toString() || '', // Ensure it’s a string, default if null/undefined
        });
    };
    

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const printTable = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
    
        const tableContent = `
            <html>
                <link rel="icon" type="image/png" href="./src/assets/EARIST_Logo.png" />
                <head>
                    <title>Group 1</title>
                    <style>
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: yellow; }
                    </style>
                </head>
                <body>
                    <h2>Users</h2>
                    <table>
                        <thead>
                            <tr>
                                <th><center>Name</center></th>
                                <th><center>Username</center></th>
                                <th><center>Email</center></th> 
                                <th><center>Role</center></th>                                                          
                                <th><center>Department ID</center></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr>
                                    <td><center>${user.last_name}, ${user.first_name}</center></td>
                                    <td><center>${user.username}</center></td>
                                    <td><center>${user.email}</center></td>
                                    <td><center>${user.role}</center></td>
                                    <td><center>${user.department_id}</center></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
    
        printWindow.document.write(tableContent);
        printWindow.document.close();
        printWindow.print();
    };    

    return (
        <Container>
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                User Profiles
            </Typography>

            {!editUser && (
                <Button
                    onClick={printTable}
                    variant="contained"
                    color="info"
                    startIcon={<Print />}
                >
                    Print
                </Button>
            )}

            <div style={{ marginBottom: '20px' }}>
                {editUser && (
                    <>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />

                        <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                label="Role"
                            >
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="User">User</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Department ID"
                            name="department_id"
                            value={formData.department_id}
                            onChange={handleInputChange}
                            sx={{ marginBottom: '10px', width: '100%' }}
                        />

                        <Button onClick={updateUser} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Update User
                        </Button>
                        <Button onClick={resetForm} variant="outlined" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                            Cancel Edit
                        </Button>
                    </>
                )}
            </div>

            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Username</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>First Name</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Last Name</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Email</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Role</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Department ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{user.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.username}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.first_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.last_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{user.email}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{user.role}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{user.department_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>                                    
                                    <IconButton onClick={() => handleEditClick(user)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => deleteUser(user.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Profile;
