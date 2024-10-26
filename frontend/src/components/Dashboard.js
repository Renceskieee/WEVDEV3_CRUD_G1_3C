import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Assuming you are using react-router for navigation

const Dashboard = () => {
    const [data, setData] = useState([]);   // To hold items data
    const [newItem, setNewItem] = useState('');  // To hold input for new item

    const [newItem2, setNewItem2] = useState('');  // To hold input for new last name

    const [editItem, setEditItem] = useState(null);  // To hold item being edited
    const navigate = useNavigate();  // Hook for navigating to different routes

    // Fetch all items on component mount
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const response = await axios.get('http://localhost:5000/items');
        setData(response.data);
    };

    // Add new item
    const addItem = async () => {
        if (newItem.trim() === '' || newItem2.trim() === '') return;
        await axios.post('http://localhost:5000/items', { name: newItem, lastname: newItem2 });
        setNewItem('');
        setNewItem2('');
        fetchItems();
    };

    // Update item
    const updateItem = async () => {
        if (!editItem || editItem.name.trim() === '' || editItem.lastname.trim() === '') return;
        await axios.put(`http://localhost:5000/items/${editItem.id}`, { name: editItem.name, lastname: editItem.lastname });
        setEditItem(null);
        fetchItems();
    };

    // Delete item
    const deleteItem = async (id) => {
        await axios.delete(`http://localhost:5000/items/${id}`);
        fetchItems();
    };

    // Handle Logout
    const handleLogout = () => {
        // Clear authentication (for example, token)
        localStorage.removeItem('authToken');  // Assuming the token is stored in localStorage
        navigate('/login');  // Redirect to login page after logout
    };

    return (
        <Container>
        <h1>Dashboard</h1>

        {/* Logout Button */}
        <Button onClick={handleLogout} variant="contained" color="secondary" style={{ float: 'right' }}>
            Logout
        </Button>
      
        {/* Add New Item */}
        <div>
            <TextField label="First Name" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
            <TextField label="Last Name" value={newItem2} onChange={(e) => setNewItem2(e.target.value)} />
            <Button onClick={addItem} variant="contained" color="primary">Add</Button>
        </div>

        {/* Items Table */}
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(item => (
                    <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>
                            {/* Editable field */}
                            {editItem && editItem.id === item.id ? (
                                <TextField
                                    value={editItem.name}
                                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                />
                            ) : (
                                item.name
                            )}
                        </TableCell>
                
                            {/* cell for the last name */}    
                            <TableCell>
                                {/* Editable field */}
                                {editItem && editItem.id === item.id ? (
                                    <TextField
                                        value={editItem.lastname}
                                        onChange={(e) => setEditItem({ ...editItem, lastname: e.target.value })}
                                    />
                                ) : (
                                    item.lastname
                                )}
                            </TableCell>
                
                            <TableCell>
                                {/* Show Save/Cancel if editing */}
                                {editItem && editItem.id === item.id ? (
                                    <>
                                        <Button onClick={updateItem} variant="contained" color="primary">Save</Button>
                                        <Button onClick={() => setEditItem(null)} variant="outlined" color="secondary">Cancel</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => setEditItem(item)} variant="outlined" color="primary">Edit</Button>
                                        <Button onClick={() => deleteItem(item.id)} variant="outlined" color="secondary">Delete</Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default Dashboard;
