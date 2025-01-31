import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Typography, Snackbar, Alert, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { Edit, Delete, Print } from '@mui/icons-material';

const History = () => {
    const [data, setData] = useState([]);
    const [newDocumentId, setNewDocumentId] = useState('');
    const [newChangedBy, setNewChangedBy] = useState('');
    const [newChangeType, setNewChangeType] = useState('');
    const [newPreviousStatus, setNewPreviousStatus] = useState('');
    const [newNewStatus, setNewNewStatus] = useState('');
    const [newPreviousHandler, setNewPreviousHandler] = useState('');
    const [newNewHandler, setNewNewHandler] = useState('');
    const [editHistory, setEditHistory] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Define change type options
    const changeTypeOptions = ['Created', 'Updated', 'Moved', 'Status Changed'];

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document_history');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const addHistory = async () => {
        if (newDocumentId && newChangedBy && newChangeType) {
            const newEntry = {
                document_id: newDocumentId,
                changed_by: newChangedBy,
                change_type: newChangeType,
                previous_status: newPreviousStatus,
                new_status: newNewStatus,
                previous_handler: newPreviousHandler,
                new_handler: newNewHandler,
            };

            try {
                const response = await axios.post('http://localhost:5000/document_history', newEntry);
                setSnackbar({ open: true, message: response.data.message, severity: 'success' });
                fetchHistory();
                resetForm();
            } catch (error) {
                console.error('Error adding history:', error);
                setSnackbar({ open: true, message: 'Error adding entry', severity: 'error' });
            }
        } else {
            setSnackbar({ open: true, message: 'Please fill required fields', severity: 'warning' });
        }
    };

    const resetForm = () => {
        setNewDocumentId('');
        setNewChangedBy('');
        setNewChangeType('');
        setNewPreviousStatus('');
        setNewNewStatus('');
        setNewPreviousHandler('');
        setNewNewHandler('');
        setEditHistory(null);
    };

    const handleEditClick = (history) => {
        setEditHistory(history);
        setNewDocumentId(history.document_id);
        setNewChangedBy(history.changed_by);
        setNewChangeType(history.change_type);
        setNewPreviousStatus(history.previous_status);
        setNewNewStatus(history.new_status);
        setNewPreviousHandler(history.previous_handler);
        setNewNewHandler(history.new_handler);
    };

    const updateHistory = async () => {
        if (editHistory) {
            const updatedEntry = {
                document_id: newDocumentId,
                changed_by: newChangedBy,
                change_type: newChangeType,
                previous_status: newPreviousStatus,
                new_status: newNewStatus,
                previous_handler: newPreviousHandler,
                new_handler: newNewHandler,
            };

            try {
                await axios.put(`http://localhost:5000/document_history/${editHistory.id}`, updatedEntry);
                setSnackbar({ open: true, message: 'History updated successfully', severity: 'success' });
                fetchHistory();
                resetForm();
            } catch (error) {
                console.error('Error updating history:', error);
                setSnackbar({ open: true, message: 'Error updating entry', severity: 'error' });
            }
        }
    };

    const deleteHistory = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/document_history/${id}`);
            setSnackbar({ open: true, message: 'History deleted', severity: 'success' });
            fetchHistory();
        } catch (error) {
            console.error('Error deleting history:', error);
            setSnackbar({ open: true, message: 'Error deleting entry', severity: 'error' });
        }
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
                <h2>Document History</h2>
                <table>
                    <thead>
                        <tr>
                            <th><center>Document ID</center></th>
                            <th><center>Change Type</center></th>
                            <th><center>Previous Status</center></th>
                            <th><center>New Status</center></th>
                            <th><center>Timestamp</center></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(entry => `
                            <tr>
                                <td><center>${entry.document_id}</center></td>
                                <td><center>${entry.change_type}</center></td>
                                <td><center>${entry.previous_status}</center></td>
                                <td><center>${entry.new_status}</center></td>
                                <td><center>${new Date(entry.timestamp).toLocaleString()}</center></td>
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
                Document History
            </Typography>

            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Document ID"
                    value={newDocumentId}
                    onChange={(e) => setNewDocumentId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Changed By"
                    value={newChangedBy}
                    onChange={(e) => setNewChangedBy(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <FormControl sx={{ marginBottom: '10px', width: '100%' }}>
                    <InputLabel>Change Type</InputLabel>
                    <Select
                        value={newChangeType}
                        onChange={(e) => setNewChangeType(e.target.value)}
                        label="Change Type"
                        fullWidth
                    >
                        {changeTypeOptions.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Previous Status"
                    value={newPreviousStatus}
                    onChange={(e) => setNewPreviousStatus(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="New Status"
                    value={newNewStatus}
                    onChange={(e) => setNewNewStatus(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Previous Handler"
                    value={newPreviousHandler}
                    onChange={(e) => setNewPreviousHandler(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="New Handler"
                    value={newNewHandler}
                    onChange={(e) => setNewNewHandler(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />

                {editHistory ? (
                    <>
                        <Button onClick={updateHistory} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Update Entry
                        </Button>
                        <Button onClick={resetForm} variant="outlined" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                            Cancel Edit
                        </Button>
                    </>
                ) : (
                    <div>
                        <Button onClick={addHistory} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Add Entry
                        </Button>
                        <Button onClick={printTable} variant="contained" color="info" sx={{ marginTop: '10px', marginLeft: '10px' }} startIcon={<Print />}>
                            Print
                        </Button>
                    </div>
                )}
            </div>

            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Changed By</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Change Type</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Previous Status</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>New Status</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Previous Handler</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>New Handler</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{entry.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{entry.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{entry.changed_by}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{entry.change_type}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{entry.previous_status}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{entry.new_status}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{entry.previous_handler}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{entry.new_handler}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>                                    
                                    <IconButton onClick={() => handleEditClick(entry)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => deleteHistory(entry.id)} color="error">
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

export default History;
