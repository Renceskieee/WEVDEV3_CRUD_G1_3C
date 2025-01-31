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

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [newDocumentCode, setNewDocumentCode] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newTypeId, setNewTypeId] = useState('');
    const [newCreatedBy, setNewCreatedBy] = useState('');
    const [newCurrentHandler, setNewCurrentHandler] = useState('');
    const [newCurrentStatus, setNewCurrentStatus] = useState('');
    const [newPriority, setNewPriority] = useState('');
    const [editDocument, setEditDocument] = useState(null);

    // Snackbar State
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success', // success | error | warning | info
        message: '',
    });
    
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const validateEditForm = () => {
        if (!newDocumentCode.trim() || !newTitle.trim() || !newTypeId.trim() || !newCreatedBy.trim() || 
            !String(newCurrentHandler).trim() || !newCurrentStatus.trim() || !newPriority.trim()) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const addDocument = async () => {
        if (!validateEditForm()) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await axios.post('http://localhost:5000/document', {
                document_code: newDocumentCode,
                title: newTitle,
                description: newDescription,
                type_id: newTypeId,
                created_by: newCreatedBy,
                current_handler: newCurrentHandler,
                current_status: newCurrentStatus,
                priority: newPriority
            });

            showSnackbar('Document added successfully.', 'success');
            resetForm();
            fetchDocuments();
        } catch (error) {
            console.error('Error adding document:', error);
        }
    };

    const updateDocument = async () => {
        if (!validateEditForm()) {
            return;
        }

        try {
            const updatedDocument = {
                id: editDocument.id,
                document_code: newDocumentCode,
                title: newTitle,
                description: newDescription,
                type_id: newTypeId,
                created_by: newCreatedBy,
                current_handler: newCurrentHandler,
                current_status: newCurrentStatus,
                priority: newPriority
            };

            const response = await fetch(`http://localhost:5000/document/${updatedDocument.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDocument),
            });

            if (response.ok) {
                const result = await response.json();

                const updatedDocuments = data.map(doc =>
                    doc.id === updatedDocument.id ? updatedDocument : doc
                );
                showSnackbar('Document updated successfully.', 'success');
                setData(updatedDocuments);
                resetForm();
            } else {
                const errorData = await response.json();
                alert('Update failed: ' + errorData.message);
            }
        } catch (error) {
            console.error('Error updating document:', error);
            alert('An error occurred while updating the document.');
        }
    };

    const deleteDocument = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/document/${id}`);
            fetchDocuments();
            showSnackbar("Document deleted successfully!", "success");
        } catch (error) {
            console.error('Error deleting document:', error);
            showSnackbar("Failed to delete document!", "error");
        }
    };    

    const resetForm = () => {
        setNewDocumentCode('');
        setNewTitle('');
        setNewDescription('');
        setNewTypeId('');
        setNewCreatedBy('');
        setNewCurrentHandler('');
        setNewCurrentStatus('');
        setNewPriority('');
        setEditDocument(null);
    };

    const handleEditClick = (doc) => {
        setEditDocument(doc);
        setNewDocumentCode(doc.document_code);
        setNewTitle(doc.title);
        setNewDescription(doc.description);
        setNewTypeId(doc.type_id.toString());
        setNewCreatedBy(doc.created_by.toString());
        setNewCurrentHandler(doc.current_handler);
        setNewCurrentStatus(doc.current_status);
        setNewPriority(doc.priority);
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
                <h2>Documents</h2>
                <table>
                    <thead>
                        <tr>
                            <th><center>Document Code</center></th>
                            <th><center>Title</center></th>
                            <th><center>Description</center></th> 
                            <th><center>Status</center></th>                           
                            <th><center>Priority</center></th>                                                      
                            <th><center>Created at</center></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(doc => `
                            <tr>
                                <td><center>${doc.document_code}</center></td>
                                <td>${doc.title}</td>
                                <td>${doc.description}</td>
                                <td><center>${doc.current_status}</center></td>
                                <td><center>${doc.priority}</center></td>
                                <td><center>${new Date(doc.created_at).toLocaleString()}</center></td>
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
                Documents
            </Typography>

            {/* Form for adding new or editing existing document */}
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Document Code"
                    value={newDocumentCode}
                    onChange={(e) => setNewDocumentCode(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Type ID"
                    value={newTypeId}
                    onChange={(e) => setNewTypeId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Created By"
                    value={newCreatedBy}
                    onChange={(e) => setNewCreatedBy(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Current Handler"
                    value={newCurrentHandler}
                    onChange={(e) => setNewCurrentHandler(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />

                {/* Current Status Dropdown */}
                <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                    <InputLabel>Current Status</InputLabel>
                    <Select
                        value={newCurrentStatus}
                        onChange={(e) => setNewCurrentStatus(e.target.value)}
                        label="Current Status"
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In-Process">In-Process</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Archived">Archived</MenuItem>
                    </Select>
                </FormControl>

                {/* Priority Dropdown */}
                <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value)}
                        label="Priority"
                    >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Urgent">Urgent</MenuItem>
                    </Select>
                </FormControl>

                {editDocument ? (
                    <>
                        <Button onClick={updateDocument} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Update Document
                        </Button>
                        <Button onClick={resetForm} variant="outlined" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                            Cancel Edit
                        </Button>
                    </>
                ) : (
                    <div>
                        <Button onClick={addDocument} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Add Notification
                        </Button>
                        <Button onClick={printTable} variant="contained" color="info" sx={{ marginTop: '10px', marginLeft: '10px' }} startIcon={<Print />}>
                            Print
                        </Button>
                    </div>
                )}
            </div>

            {/* Table for displaying documents */}
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Document Code</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Title</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Description</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Type</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Created By</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Current Handler</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Status</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Priority</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((doc) => (
                        <TableRow key={doc.id}>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{doc.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{doc.document_code}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.title}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.description}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{doc.type_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{doc.created_by}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{doc.current_handler}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{doc.current_status}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{doc.priority}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                    <IconButton onClick={() => handleEditClick(doc)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => deleteDocument(doc.id)} color="error">
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

export default Dashboard;
