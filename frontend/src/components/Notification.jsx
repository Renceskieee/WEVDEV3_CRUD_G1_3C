import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Typography, Snackbar, Alert, IconButton } from '@mui/material';
import axios from 'axios';
import { Edit, Delete } from '@mui/icons-material';

const Notification = () => {
    const [data, setData] = useState([]);
    const [newUserId, setNewUserId] = useState('');
    const [newDocumentId, setNewDocumentId] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [editNotification, setEditNotification] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/notifications');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const addNotification = async () => {
        if (newUserId && newDocumentId && newMessage) {
            const newNotification = {
                user_id: newUserId,
                document_id: newDocumentId,
                message: newMessage
            };

            try {
                const response = await axios.post('http://localhost:5000/notifications', newNotification);
                setSnackbar({ open: true, message: response.data.message, severity: 'success' });
                fetchNotifications(); // Refresh the list
                resetForm(); // Reset input fields
            } catch (error) {
                console.error('Error adding notification:', error);
                setSnackbar({ open: true, message: 'Error adding notification', severity: 'error' });
            }
        } else {
            setSnackbar({ open: true, message: 'Please fill all fields', severity: 'warning' });
        }
    };

    const resetForm = () => {
        setNewUserId('');
        setNewDocumentId('');
        setNewMessage('');
        setEditNotification(null);
    };

    const handleEditClick = (notification) => {
        setEditNotification(notification);
        setNewUserId(notification.user_id);
        setNewDocumentId(notification.document_id);
        setNewMessage(notification.message);
    };

    const updateNotification = async () => {
        if (editNotification) {
            const updatedNotification = {
                user_id: newUserId,
                document_id: newDocumentId,
                message: newMessage
            };

            try {
                await axios.put(`http://localhost:5000/notifications/${editNotification.id}`, updatedNotification);
                setSnackbar({ open: true, message: 'Notification updated successfully', severity: 'success' });
                fetchNotifications();
                resetForm();
            } catch (error) {
                console.error('Error updating notification:', error);
                setSnackbar({ open: true, message: 'Error updating notification', severity: 'error' });
            }
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/notifications/${id}`);
            setSnackbar({ open: true, message: 'Notification deleted', severity: 'success' });
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
            setSnackbar({ open: true, message: 'Error deleting notification', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container>
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Notifications
            </Typography>

            {/* Form for adding new or editing existing notification */}
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="User ID"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Document ID"
                    value={newDocumentId}
                    onChange={(e) => setNewDocumentId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />

                {editNotification ? (
                    <>
                        <Button onClick={updateNotification} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Update Notification
                        </Button>
                        <Button onClick={resetForm} variant="outlined" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                            Cancel Edit
                        </Button>
                    </>
                ) : (
                    <Button onClick={addNotification} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                        Add Notification
                    </Button>
                )}
            </div>

            {/* Table for displaying notifications */}
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>User ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Message</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((notification) => (
                        <TableRow key={notification.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.user_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.message}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <IconButton onClick={() => handleEditClick(notification)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => deleteNotification(notification.id)} color="error">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Snackbar for messages */}
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

export default Notification;
