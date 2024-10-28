import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container } from '@mui/material';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [newDocumentCode, setNewDocumentCode] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newTypeId, setNewTypeId] = useState('');
    const [newCreatedBy, setNewCreatedBy] = useState('');
    const [newCurrentHandler, setNewCurrentHandler] = useState('');
    const [editDocument, setEditDocument] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        const response = await axios.get('http://localhost:5000/document_table');
        setData(response.data);
    };

    const addDocument = async () => {
        if (newDocumentCode.trim() === '' || newTitle.trim() === '' || newTypeId.trim() === '' || newCreatedBy.trim() === '' || newCurrentHandler.trim() === '') {
            return;
        }

        await axios.post('http://localhost:5000/document_table', {
            document_code: newDocumentCode,
            title: newTitle,
            description: newDescription,
            type_id: newTypeId,
            created_by: newCreatedBy,
            current_handler: newCurrentHandler
        });

        setNewDocumentCode('');
        setNewTitle('');
        setNewDescription('');
        setNewTypeId('');
        setNewCreatedBy('');
        setNewCurrentHandler('');
        fetchDocuments();
    };

    const updateDocument = async () => {
        if (!editDocument || editDocument.document_code.trim() === '' || editDocument.title.trim() === '') return;

        await axios.put(`http://localhost:5000/document_table/${editDocument.id}`, {
            document_code: editDocument.document_code,
            title: editDocument.title,
            description: editDocument.description,
            type_id: editDocument.type_id,
            created_by: editDocument.created_by,
            current_handler: editDocument.current_handler,
            current_status: editDocument.current_status,
            priority: editDocument.priority
        });

        setEditDocument(null);
        fetchDocuments();
    };

    const deleteDocument = async (id) => {
        await axios.delete(`http://localhost:5000/document_table/${id}`);
        fetchDocuments();
    };

    return (
        <Container>
            <h1>Document Table Dashboard</h1>
                
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

                <Button onClick={addDocument} variant="contained" color="primary" sx={{ marginTop: '10px' }}>
                    Add
                </Button>
            </div>

            {/* Documents Table */}
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document Code</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Title</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Description</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Type ID</TableCell> {/* Added Type ID */}
                        <TableCell sx={{ border: '1px solid black' }}>Created By</TableCell> {/* Added Created By */}
                        <TableCell sx={{ border: '1px solid black' }}>Current Handler</TableCell> {/* Added Current Handler */}
                        <TableCell sx={{ border: '1px solid black' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((document) => (
                        <TableRow key={document.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{document.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                {editDocument && editDocument.id === document.id ? (
                                    <TextField
                                        value={editDocument.document_code}
                                        onChange={(e) => setEditDocument({ ...editDocument, document_code: e.target.value })}
                                        sx={{ width: '100%' }}
                                    />
                                ) : (
                                    document.document_code
                                )}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                {editDocument && editDocument.id === document.id ? (
                                    <TextField
                                        value={editDocument.title}
                                        onChange={(e) => setEditDocument({ ...editDocument, title: e.target.value })}
                                        sx={{ width: '100%' }}
                                    />
                                ) : (
                                    document.title
                                )}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                {editDocument && editDocument.id === document.id ? (
                                    <TextField
                                        value={editDocument.description}
                                        onChange={(e) => setEditDocument({ ...editDocument, description: e.target.value })}
                                        sx={{ width: '100%' }}
                                    />
                                ) : (
                                    document.description
                                )}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                {editDocument && editDocument.id === document.id ? (
                                    <TextField
                                        value={editDocument.type_id}
                                        onChange={(e) => setEditDocument({ ...editDocument, type_id: e.target.value })}
                                        sx={{ width: '100%' }} // Show Type ID in edit mode
                                    />
                                ) : (
                                    document.type_id // Display Type ID
                                )}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                {editDocument && editDocument.id === document.id ? (
                                    <TextField
                                        value={editDocument.created_by}
                                        onChange={(e) => setEditDocument({ ...editDocument, created_by: e.target.value })}
                                        sx={{ width: '100%' }} // Show Created By in edit mode
                                    />
                                ) : (
                                    document.created_by // Display Created By
                                )}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>
                                {editDocument && editDocument.id === document.id ? (
                                    <TextField
                                        value={editDocument.current_handler}
                                        onChange={(e) => setEditDocument({ ...editDocument, current_handler: e.target.value })}
                                        sx={{ width: '100%' }} // Show Current Handler in edit mode
                                    />
                                ) : (
                                    document.current_handler // Display Current Handler
                                )}
                            </TableCell>
                            <TableCell sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                {editDocument && editDocument.id === document.id ? (
                                    <>
                                        <Button onClick={updateDocument} variant="contained" color="primary">Save</Button>
                                        <Button onClick={() => setEditDocument(null)} variant="contained" color="error">Cancel</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => setEditDocument(document)} variant="contained" color="primary">Edit</Button>
                                        <Button onClick={() => deleteDocument(document.id)} variant="contained" color="error">Delete</Button>
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
