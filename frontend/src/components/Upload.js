import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function Upload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false); // State to control the modal

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage('Please select a file before uploading.');
            setOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload-xls', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message); // Handle success message from server
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('File upload failed. Please try again.');
        }

        setOpen(true); // Show the modal after upload attempt
    };

    const handleClose = () => {
        setOpen(false); // Close the modal
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Uploads</h1>

            <input
                type="file"
                onChange={handleFileChange}
                style={{ margin: '20px 0', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            />

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleFileUpload}
                style={{ fontSize: '18px', padding: '10px 30px' }}
            >
                Upload
            </Button>

            {/* Modal to show the upload status */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>File Upload Status</DialogTitle>
                <DialogContent>
                    <p>{message}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Upload;
