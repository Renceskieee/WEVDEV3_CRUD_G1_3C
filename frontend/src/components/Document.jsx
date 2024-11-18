import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';

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
                alert(result.message);

                const updatedDocuments = data.map(doc =>
                    doc.id === updatedDocument.id ? updatedDocument : doc
                );
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
        } catch (error) {
            console.error('Error deleting document:', error);
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
                    <Button onClick={addDocument} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                        Add Document
                    </Button>
                )}
            </div>

            {/* Table for displaying documents */}
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document Code</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Title</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Description</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Type</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Created By</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Current Handler</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Status</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Priority</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((doc) => (
                        <TableRow key={doc.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.document_code}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.title}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.description}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.type_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.created_by}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.current_handler}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.current_status}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{doc.priority}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <Button
                                    onClick={() => handleEditClick(doc)}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ marginRight: '10px' }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => deleteDocument(doc.id)}
                                    variant="outlined"
                                    color="error"
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default Dashboard;
