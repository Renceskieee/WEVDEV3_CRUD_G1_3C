import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Container, Typography, Grid } from '@mui/material';

function Dashboard() {
    const [documentData, setDocumentData] = useState([]);
    const [attachmentData, setAttachmentData] = useState([]);

    // Fetch documents and attachments on component mount
    useEffect(() => {
        fetchDocuments();
        fetchAttachments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document');
            setDocumentData(response.data);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const fetchAttachments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document_attachments');
            setAttachmentData(response.data);
        } catch (error) {
            console.error('Error fetching attachments:', error);
        }
    };

    return (
        <Container>
            {/* Dashboard Header */}
            <Typography variant="h4" component="h1" sx={{ margin: '20px 0', textAlign: 'center' }}>
                Dashboard
            </Typography>

            {/* Documents Table */}
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Documents
            </Typography>
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document Code</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Title</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Description</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Type ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Created By</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Current Handler</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Current Status</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Priority</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Created At</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Updated At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documentData.map((doc) => (
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
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(doc.created_at).toLocaleString()}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(doc.updated_at).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Attachment Table */}
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Document Attachments
            </Typography>
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>File Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>File Path</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Uploaded By</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Uploaded At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {attachmentData.map((att) => (
                        <TableRow key={att.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{att.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{att.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{att.file_name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{att.file_path}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{att.uploaded_by}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(att.uploaded_at).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}

export default Dashboard;
