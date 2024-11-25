import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Container, Typography, Grid } from '@mui/material';

function Home() {
    const [documentData, setDocumentData] = useState([]);
    const [attachmentData, setAttachmentData] = useState([]);
    const [movementData, setMovementData] = useState([]);
    const [typeData, setTypeData] = useState([]); // State for the Type table data
    const [departmentData, setDepartmentData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [historyData, setHistoryData] = useState([]);

    // Fetch documents, attachments, movements, and types on component mount
    useEffect(() => {
        fetchDocuments();
        fetchAttachments();
        fetchMovements();
        fetchTypes(); // Fetch the type data
        fetchDepartments();
        fetchNotifications();
        fetchHistory();
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

    const fetchMovements = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document_movements');
            setMovementData(response.data);
        } catch (error) {
            console.error('Error fetching movements:', error);
        }
    };

    const fetchTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document-types'); // Assuming the endpoint for types is here
            setTypeData(response.data);
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/departments'); // Assuming endpoint for departments
            setDepartmentData(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await axios.get('http://localhost:5000/document_history'); // Assuming this is the endpoint for history
            setHistoryData(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" sx={{ margin: '20px 0', textAlign: 'center' }}>
                Dashboard
            </Typography>

            {/* Departments Table */}
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Departments
            </Typography>
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Created At</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Updated At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {departmentData.map((dept) => (
                        <TableRow key={dept.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{dept.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{dept.name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(dept.created_at).toLocaleString()}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(dept.updated_at).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Document Types Table (replacing Type.jsx table) */}
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Document Types
            </Typography>
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Name</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Description</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Created At</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Updated At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {typeData.map((type) => (
                        <TableRow key={type.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{type.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{type.name}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{type.description}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(type.created_at).toLocaleString()}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(type.updated_at).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Notifications Table */}
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Notifications
            </Typography>
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>User ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Message</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Is Read</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Timestamp</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notifications.map((notification) => (
                        <TableRow key={notification.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.user_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.message}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{notification.is_read ? 'Yes' : 'No'}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(notification.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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

            {/* Movements Table */}
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Document Movements
            </Typography>
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Status</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>From User ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>To User ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>From Department ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>To Department ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Remarks</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Timestamp</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {movementData.map((move) => (
                        <TableRow key={move.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{move.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{move.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{move.status}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{move.from_user_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{move.to_user_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{move.from_department_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{move.to_department_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{move.remarks}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(move.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* History Table */}
            <Typography variant="h5" sx={{ margin: '20px 0' }}>
                Document History
            </Typography>
            <Table sx={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
                <TableHead sx={{ backgroundColor: 'yellow' }}>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid black' }}>ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Document ID</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Changed By</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Change Type</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Previous Status</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>New Status</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Previous Handler</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>New Handler</TableCell>
                        <TableCell sx={{ border: '1px solid black' }}>Timestamp</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {historyData.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell sx={{ border: '1px solid black' }}>{entry.id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{entry.document_id}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{entry.changed_by}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{entry.change_type}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{entry.previous_status}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{entry.new_status}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{entry.previous_handler}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{entry.new_handler}</TableCell>
                            <TableCell sx={{ border: '1px solid black' }}>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}

export default Home;
