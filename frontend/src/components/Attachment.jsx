import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Typography, Snackbar, Alert, IconButton } from '@mui/material';
import axios from 'axios';
import { Edit, Delete, Print } from '@mui/icons-material';

const Attachment = () => {
    const [data, setData] = useState([]);
    const [newDocumentId, setNewDocumentId] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [newFilePath, setNewFilePath] = useState('');
    const [newUploadedBy, setNewUploadedBy] = useState('');
    const [editAttachment, setEditAttachment] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchAttachments();
    }, []);

    const fetchAttachments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document_attachments');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching attachments:', error);
        }
    };

    const addAttachment = async () => {
        if (newDocumentId && newFileName && newFilePath && newUploadedBy) {
            const newAttachment = {
                document_id: newDocumentId,
                file_name: newFileName,
                file_path: newFilePath,
                uploaded_by: newUploadedBy
            };

            try {
                const response = await axios.post('http://localhost:5000/document_attachments', newAttachment);
                setSnackbar({ open: true, message: response.data.message, severity: 'success' });
                fetchAttachments(); // Refresh the list
                resetForm(); // Reset input fields
            } catch (error) {
                console.error('Error adding attachment:', error);
                setSnackbar({ open: true, message: 'Error adding attachment', severity: 'error' });
            }
        } else {
            setSnackbar({ open: true, message: 'Please fill all fields', severity: 'warning' });
        }
    };

    const resetForm = () => {
        setNewDocumentId('');
        setNewFileName('');
        setNewFilePath('');
        setNewUploadedBy('');
        setEditAttachment(null);
    };

    const handleEditClick = (attachment) => {
        setEditAttachment(attachment);
        setNewDocumentId(attachment.document_id);
        setNewFileName(attachment.file_name);
        setNewFilePath(attachment.file_path);
        setNewUploadedBy(attachment.uploaded_by);
    };

    const updateAttachment = async () => {
        if (editAttachment) {
            const updatedAttachment = {
                document_id: newDocumentId,
                file_name: newFileName,
                file_path: newFilePath,
                uploaded_by: newUploadedBy
            };

            try {
                await axios.put(`http://localhost:5000/document_attachments/${editAttachment.id}`, updatedAttachment);
                setSnackbar({ open: true, message: 'Attachment updated successfully', severity: 'success' });
                fetchAttachments();
                resetForm();
            } catch (error) {
                console.error('Error updating attachment:', error);
                setSnackbar({ open: true, message: 'Error updating attachment', severity: 'error' });
            }
        }
    };

    const deleteAttachment = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/document_attachments/${id}`);
            setSnackbar({ open: true, message: 'Attachment deleted', severity: 'success' });
            fetchAttachments();
        } catch (error) {
            console.error('Error deleting attachment:', error);
            setSnackbar({ open: true, message: 'Error deleting attachment', severity: 'error' });
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
                <h2>Document Attachments</h2>
                <table>
                    <thead>
                        <tr>
                            <th><center>File Name</center></th>
                            <th><center>File Path</center></th>
                            <th><center>Uploaded at</center></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(att => `
                            <tr>
                                <td><center>${att.file_name}</center></td>
                                <td><center>${att.file_path}</center></td>
                                <td><center>${new Date(att.uploaded_at).toLocaleString()}</center></td>
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
                Document Attachments
            </Typography>

            {/* Form for adding new or editing existing attachment */}
            <div style={{ marginBottom: '20px' }}>
                <TextField
                    label="Document ID"
                    value={newDocumentId}
                    onChange={(e) => setNewDocumentId(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="File Name"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="File Path"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Uploaded By"
                    value={newUploadedBy}
                    onChange={(e) => setNewUploadedBy(e.target.value)}
                    sx={{ marginBottom: '10px', width: '100%' }}
                />

                {editAttachment ? (
                    <>
                        <Button onClick={updateAttachment} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Update Attachment
                        </Button>
                        <Button onClick={resetForm} variant="outlined" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                            Cancel Edit
                        </Button>
                    </>
                ) : (
                    <div>
                        <Button onClick={addAttachment} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                            Add Attachment
                        </Button>
                        <Button onClick={printTable} variant="contained" color="info" sx={{ marginTop: '10px', marginLeft: '10px' }} startIcon={<Print />}>
                            Print
                        </Button>
                    </div>
                )}
            </div>

            {/* Table for displaying attachments */}
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>File Name</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>File Path</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Uploaded By</TableCell>
                        <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((att) => (
                        <TableRow key={att.id}>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{att.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{att.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{att.file_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{att.file_path}</TableCell>
                            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{att.uploaded_by}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>                                    
                                    <IconButton onClick={() => handleEditClick(att)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => deleteAttachment(att.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </div>
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

export default Attachment;
