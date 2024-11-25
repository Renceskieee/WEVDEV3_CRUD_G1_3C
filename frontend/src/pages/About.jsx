import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Container, Paper } from '@mui/material';

// Add Roboto font in the global styles
const useStyles = {
    container: {
        fontFamily: 'Roboto, sans-serif',
        padding: '20px',
        maxWidth: '1200px',
        margin: 'auto',
        lineHeight: 1.5, // line spacing of 1.5
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        fontWeight: 'bold',
    },
    table: {
        marginBottom: '30px',
        borderCollapse: 'collapse',
        width: '100%',
    },
    tableHeader: {
        backgroundColor: '#ffea00',
        border: '1px solid #000000',
    },
    tableCell: {
        border: '1px solid #000000',
        padding: '8px',
        textAlign: 'left',
    },
};

function About() {
    return (
        <Container style={useStyles.container}>
            <Paper style={{ padding: '20px' }}>
                <Typography variant="h3" style={useStyles.title}>
                    Document Tracking System
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    The Document Tracking System is designed to help organizations manage documents by tracking
                    their movements, status, and history. The system ensures smooth operations by allowing users
                    to track documents in real-time, providing transparency and ease of access.
                </Typography>

                <Typography variant="h6" style={useStyles.title}>
                    Tables and Structure
                </Typography>

                {/* Users Table */}
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>1. Users Table</Typography>
                <Table style={useStyles.table}>
                    <TableHead style={useStyles.tableHeader}>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}><strong>Column Name</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Data Type</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (PK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique identifier for the user</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>username</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(100)</TableCell>
                            <TableCell style={useStyles.tableCell}>Username for login</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>password</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(255)</TableCell>
                            <TableCell style={useStyles.tableCell}>Encrypted password</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>first_name</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(100)</TableCell>
                            <TableCell style={useStyles.tableCell}>User's first name</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>last_name</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(100)</TableCell>
                            <TableCell style={useStyles.tableCell}>User's last name</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>email</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(100)</TableCell>
                            <TableCell style={useStyles.tableCell}>User's email address</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>role</TableCell>
                            <TableCell style={useStyles.tableCell}>ENUM('Admin', 'User')</TableCell>
                            <TableCell style={useStyles.tableCell}>User's role (admin or regular user)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>department_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Department the user belongs to</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>created_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Record creation timestamp</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>updated_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Record update timestamp</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Departments Table */}
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>2. Departments Table</Typography>
                <Table style={useStyles.table}>
                    <TableHead style={useStyles.tableHeader}>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}><strong>Column Name</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Data Type</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (PK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique identifier for the department</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>name</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(100)</TableCell>
                            <TableCell style={useStyles.tableCell}>Department name</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>created_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Record creation timestamp</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>updated_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Record update timestamp</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Document Table */}
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>3. Document Table</Typography>
                <Table style={useStyles.table}>
                    <TableHead style={useStyles.tableHeader}>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}><strong>Column Name</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Data Type</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (PK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique document identifier</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>document_code</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(100)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique code for identifying the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>title</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(255)</TableCell>
                            <TableCell style={useStyles.tableCell}>Document title</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>description</TableCell>
                            <TableCell style={useStyles.tableCell}>TEXT</TableCell>
                            <TableCell style={useStyles.tableCell}>Detailed description of the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>type_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Type of document (from Document Types)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>created_by</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>User who created the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>current_handler</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>User currently responsible for the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>current_status</TableCell>
                            <TableCell style={useStyles.tableCell}>ENUM('Pending', 'In-Process', 'Completed', 'Archived')</TableCell>
                            <TableCell style={useStyles.tableCell}>Current status of the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>priority</TableCell>
                            <TableCell style={useStyles.tableCell}>ENUM('Low', 'Medium', 'High', 'Urgent')</TableCell>
                            <TableCell style={useStyles.tableCell}>Priority level of the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>created_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Document creation timestamp</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>updated_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Document update timestamp</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Document Types Table */}
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    4. Document Types Table
                </Typography>
                <Table style={useStyles.table}>
                    <TableHead style={useStyles.tableHeader}>
                        <TableRow>
                        <TableCell style={useStyles.tableCell}><strong>Column Name</strong></TableCell>
                        <TableCell style={useStyles.tableCell}><strong>Data Type</strong></TableCell>
                        <TableCell style={useStyles.tableCell}><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (PK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique identifier for the document type</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>name</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(100)</TableCell>
                            <TableCell style={useStyles.tableCell}>Name of the document type</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>description</TableCell>
                            <TableCell style={useStyles.tableCell}>TEXT</TableCell>
                            <TableCell style={useStyles.tableCell}>Brief description of the document type</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>created_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Record creation timestamp</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>updated_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Record update timestamp</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Document History Table */}
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    5. Document History Table
                </Typography>
                <Table style={useStyles.table}>
                    <TableHead style={useStyles.tableHeader}>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}><strong>Column Name</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Data Type</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (PK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique identifier for the history log</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>document_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Reference to the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>changed_by</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>User who made the change</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>change_type</TableCell>
                            <TableCell style={useStyles.tableCell}>ENUM('Created', 'Updated', 'Moved', 'Status Changed')</TableCell>
                            <TableCell style={useStyles.tableCell}>Type of change made</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>previous_status</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(50)</TableCell>
                            <TableCell style={useStyles.tableCell}>Previous status (before change)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>new_status</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(50)</TableCell>
                            <TableCell style={useStyles.tableCell}>New status (after change)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>previous_handler</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Previous handler (before change)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>new_handler</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>New handler (after change)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>timestamp</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Date and time of the change</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Document Attachments Table */}
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    6. Document Attachments Table
                </Typography>
                <Table style={useStyles.table}>
                    <TableHead style={useStyles.tableHeader}>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}><strong>Column Name</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Data Type</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (PK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique identifier for the attachment</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>document_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Reference to the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>file_name</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(255)</TableCell>
                            <TableCell style={useStyles.tableCell}>Name of the attached file</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>file_path</TableCell>
                            <TableCell style={useStyles.tableCell}>VARCHAR(255)</TableCell>
                            <TableCell style={useStyles.tableCell}>Location where the file is stored</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>uploaded_by</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>User who uploaded the attachment</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>uploaded_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Date and time the attachment was uploaded</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Document Movements Table */}
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    7. Document Movements Table
                </Typography>
                <Table style={useStyles.table}>
                    <TableHead style={useStyles.tableHeader}>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}><strong>Column Name</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Data Type</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (PK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique identifier for each movement</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>document_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Reference to the document being moved</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>from_user_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>User who is transferring the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>to_user_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>User receiving the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>from_department_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Department sending the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>to_department_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Department receiving the document</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>status</TableCell>
                            <TableCell style={useStyles.tableCell}>ENUM('Pending', 'In-Process', 'Completed')</TableCell>
                            <TableCell style={useStyles.tableCell}>Status during the movement</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>timestamp</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Date and time of the movement</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>remarks</TableCell>
                            <TableCell style={useStyles.tableCell}>TEXT</TableCell>
                            <TableCell style={useStyles.tableCell}>Additional comments or notes</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Notifications Table */}
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    8. Notifications Table
                </Typography>
                <Table style={useStyles.table}>
                    <TableHead style={useStyles.tableHeader}>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}><strong>Column Name</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Data Type</strong></TableCell>
                            <TableCell style={useStyles.tableCell}><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (PK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Unique identifier for the notification</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>user_id</TableCell>
                            <TableCell style={useStyles.tableCell}>INT (FK)</TableCell>
                            <TableCell style={useStyles.tableCell}>Reference to the user receiving the notification</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>message</TableCell>
                            <TableCell style={useStyles.tableCell}>TEXT</TableCell>
                            <TableCell style={useStyles.tableCell}>Content of the notification</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>status</TableCell>
                            <TableCell style={useStyles.tableCell}>ENUM('Unread', 'Read')</TableCell>
                            <TableCell style={useStyles.tableCell}>Status of the notification</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={useStyles.tableCell}>created_at</TableCell>
                            <TableCell style={useStyles.tableCell}>TIMESTAMP</TableCell>
                            <TableCell style={useStyles.tableCell}>Notification creation timestamp</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Container>
    );
}

export default About;
