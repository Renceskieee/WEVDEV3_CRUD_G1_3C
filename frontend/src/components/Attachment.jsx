import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Typography } from '@mui/material';
import axios from 'axios';

const Attachment = () => {
    const [data, setData] = useState([]);
    const [newDocumentId, setNewDocumentId] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [newFilePath, setNewFilePath] = useState('');
    const [newUploadedBy, setNewUploadedBy] = useState('');
    const [editAttachment, setEditAttachment] = useState(null);

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
                alert(response.data.message);
                fetchAttachments(); // Refresh the list
                resetForm(); // Reset input fields
            } catch (error) {
                console.error('Error adding attachment:', error);
            }
        } else {
            alert('Please fill all fields');
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
                alert('Attachment updated successfully');
                fetchAttachments();
                resetForm();
            } catch (error) {
                console.error('Error updating attachment:', error);
            }
        }
    };

    const deleteAttachment = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/document_attachments/${id}`);
            alert('Attachment deleted');
            fetchAttachments();
        } catch (error) {
            console.error('Error deleting attachment:', error);
        }
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
                    <Button onClick={addAttachment} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                        Add Attachment
                    </Button>
                )}
            </div>

            {/* Table for displaying attachments */}
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>File Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>File Path</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Uploaded By</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((att) => (
                        <TableRow key={att.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{att.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{att.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{att.file_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{att.file_path}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{att.uploaded_by}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                <Button onClick={() => handleEditClick(att)} variant="outlined" sx={{ marginRight: '5px' }}>
                                    Edit
                                </Button>
                                <Button onClick={() => deleteAttachment(att.id)} variant="outlined" color="error">
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

export default Attachment;
