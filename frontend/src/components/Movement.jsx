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

const Movements = () => {
    const [data, setData] = useState([]);
    const [newDocumentId, setNewDocumentId] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [newFromUserId, setNewFromUserId] = useState('');
    const [newToUserId, setNewToUserId] = useState('');
    const [newFromDepartmentId, setNewFromDepartmentId] = useState('');
    const [newToDepartmentId, setNewToDepartmentId] = useState('');
    const [newRemarks, setNewRemarks] = useState('');
    const [editMovement, setEditMovement] = useState(null);

    // Snackbar State
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success', // success | error | warning | info
        message: '',
    });

    useEffect(() => {
        fetchMovements();
    }, []);

    const fetchMovements = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document_movements');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching movements:', error);
        }
    };

    const validateForm = () => {
        if (!newDocumentId || !newStatus) {
            showSnackbar('Document ID and Status are required.', 'error');
            return false;
        }

        const validStatuses = ['Pending', 'In-Process', 'Completed'];
        if (!validStatuses.includes(newStatus)) {
            showSnackbar('Invalid status value. Choose Pending, In-Process, or Completed.', 'error');
            return false;
        }

        return true;
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const addMovement = async () => {
        if (!validateForm()) return;

        try {
            await axios.post('http://localhost:5000/document_movements', {
                document_id: newDocumentId,
                status: newStatus,
                from_user_id: newFromUserId,
                to_user_id: newToUserId,
                from_department_id: newFromDepartmentId,
                to_department_id: newToDepartmentId,
                remarks: newRemarks,
            });

            showSnackbar('Movement added successfully.', 'success');
            resetForm();
            fetchMovements();
        } catch (error) {
            console.error('Error adding movement:', error);
            showSnackbar('Failed to add movement. Please try again.', 'error');
        }
    };

    const updateMovement = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.put(
                `http://localhost:5000/document_movements/${editMovement.id}`,
                {
                    document_id: newDocumentId,
                    status: newStatus,
                    from_user_id: newFromUserId || null,
                    to_user_id: newToUserId || null,
                    from_department_id: newFromDepartmentId || null,
                    to_department_id: newToDepartmentId || null,
                    remarks: newRemarks || null,
                }
            );

            if (response.status === 200) {
                showSnackbar('Movement updated successfully.', 'success');
                resetForm();
                fetchMovements();
            } else {
                showSnackbar(`Update failed: ${response.data.message}`, 'error');
            }
        } catch (error) {
            console.error('Error updating movement:', error);
            showSnackbar('Failed to update movement. Please try again.', 'error');
        }
    };

    const deleteMovement = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/document_movements/${id}`);
            showSnackbar('Movement deleted successfully.', 'success');
            fetchMovements();
        } catch (error) {
            console.error('Error deleting movement:', error);
            showSnackbar('Failed to delete movement. Please try again.', 'error');
        }
    };

    const resetForm = () => {
        setNewDocumentId('');
        setNewStatus('');
        setNewFromUserId('');
        setNewToUserId('');
        setNewFromDepartmentId('');
        setNewToDepartmentId('');
        setNewRemarks('');
        setEditMovement(null);
    };

    const handleEditClick = (movement) => {
        setEditMovement(movement);
        setNewDocumentId(movement.document_id);
        setNewStatus(movement.status);
        setNewFromUserId(movement.from_user_id);
        setNewToUserId(movement.to_user_id);
        setNewFromDepartmentId(movement.from_department_id);
        setNewToDepartmentId(movement.to_department_id);
        setNewRemarks(movement.remarks);
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
                <h2>Document Movements</h2>
                <table>
                    <thead>
                        <tr>
                            <th><center>Document ID</center></th>
                            <th><center>Status</center></th>
                            <th><center>Remarks</center></th>
                            <th><center>Timestamp</center></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(movement => `
                            <tr>
                                <td><center>${movement.document_id}</center></td>
                                <td><center>${movement.status}</center></td>
                                <td><center>${movement.remarks}</center></td>
                                <td><center>${new Date(movement.timestamp).toLocaleString()}</center></td>
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
                Document Movements
            </Typography>

            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Document ID"
                    value={newDocumentId}
                    onChange={(e) => setNewDocumentId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />

                <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In-Process">In-Process</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="From User ID"
                    value={newFromUserId}
                    onChange={(e) => setNewFromUserId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="To User ID"
                    value={newToUserId}
                    onChange={(e) => setNewToUserId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="From Department ID"
                    value={newFromDepartmentId}
                    onChange={(e) => setNewFromDepartmentId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="To Department ID"
                    value={newToDepartmentId}
                    onChange={(e) => setNewToDepartmentId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Remarks"
                    value={newRemarks}
                    onChange={(e) => setNewRemarks(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />

                {editMovement ? (
                    <>
                        <Button onClick={updateMovement} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Update Movement
                        </Button>
                        <Button onClick={resetForm} variant="outlined" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                            Cancel Edit
                        </Button>
                    </>
                ) : (
                    <div>
                        <Button onClick={addMovement} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Add Movement
                        </Button>
                        <Button onClick={printTable} variant="contained" color="info" sx={{ marginTop: '10px', marginLeft: '10px' }} startIcon={<Print />}>
                            Print
                        </Button>
                    </div>
                )}
            </div>

            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Status</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>From User ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>To User ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>From Department ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>To Department ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Remarks</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((movement) => (
                        <TableRow key={movement.id}>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{movement.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{movement.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{movement.status}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{movement.from_user_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{movement.to_user_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{movement.from_department_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{movement.to_department_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{movement.remarks}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                    <IconButton onClick={() => handleEditClick(movement)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => deleteMovement(movement.id)} color="error">
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

export default Movements;
