import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Print } from '@mui/icons-material';
import axios from "axios";

const Type = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  // Fetch all document types
  const fetchDocumentTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/document-types");
      setDocumentTypes(response.data);
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  // Add a new document type
  const addDocumentType = async () => {
    if (!newName || !newDescription) {
      setSnackbarMessage("Name and description are required!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post("http://localhost:5000/document-types", {
        name: newName,
        description: newDescription,
      });
      setNewName("");
      setNewDescription("");
      setSnackbarMessage("Document type added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchDocumentTypes();
    } catch (error) {
      console.error("Error adding document type:", error);
      setSnackbarMessage("Failed to add document type!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Update an existing document type
  const updateDocumentType = async () => {
    if (!editName || !editDescription) {
      setSnackbarMessage("Name and description are required!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/document-types/${editId}`, {
        name: editName,
        description: editDescription,
      });
      setEditId(null);
      setEditName("");
      setEditDescription("");
      setSnackbarMessage("Document type updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchDocumentTypes();
    } catch (error) {
      console.error("Error updating document type:", error);
      setSnackbarMessage("Failed to update document type!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Delete a document type
  const deleteDocumentType = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/document-types/${id}`);
      fetchDocumentTypes();
      // **Snackbar for successful deletion**
      setSnackbarMessage("Document type deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting document type:", error);
      // **Snackbar for failed deletion**
      setSnackbarMessage("Failed to delete document type!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };  

  // Reset form fields
  const resetForm = () => {
    setEditId(null);
    setEditName("");
    setEditDescription("");
    setNewName("");
    setNewDescription("");
  };

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
              <h2>Document Types</h2>
              <table>
                  <thead>
                      <tr>
                          <th><center>Name</center></th>
                          <th><center>Description</center></th>
                      </tr>
                  </thead>
                  <tbody>
                      ${documentTypes.map(type => `
                          <tr>
                              <td>${type.name}</td>
                              <td>${type.description}</td>
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
      <Typography variant="h5" sx={{ margin: "20px 0" }}>
        Document Types
      </Typography>

      <Box sx={{ marginBottom: "20px" }}>
        <TextField
          label="Name"
          value={editId ? editName : newName}
          onChange={(e) =>
            editId ? setEditName(e.target.value) : setNewName(e.target.value)
          }
          sx={{ marginBottom: "10px", width: "100%" }}
        />
        <TextField
          label="Description"
          value={editId ? editDescription : newDescription}
          onChange={(e) =>
            editId
              ? setEditDescription(e.target.value)
              : setNewDescription(e.target.value)
          }
          sx={{ marginBottom: "10px", width: "100%" }}
        />
        {editId ? (
          <>
            <Button
              onClick={updateDocumentType}
              variant="contained"
              color="error"
              sx={{ marginTop: "10px" }}
            >
              Update Document Type
            </Button>
            <Button
              onClick={resetForm}
              variant="outlined"
              sx={{ marginTop: "10px", marginLeft: "10px" }}
            >
              Cancel Edit
            </Button>
          </>
        ) : (
          <div>
              <Button onClick={addDocumentType} variant="contained" color="error" sx={{ marginTop: '10px' }}>
                  Add Document Type
              </Button>
              <Button onClick={printTable} variant="contained" color="info" sx={{ marginTop: '10px', marginLeft: '10px' }} startIcon={<Print />}>
                  Print
              </Button>
          </div>
        )}
      </Box>

      <Table
        sx={{
          border: "1px solid #000",
          "& td, & th": { border: "1px solid #000" },
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "yellow" }}>
            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>ID</TableCell>
            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Name</TableCell>
            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Description</TableCell>
            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documentTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{type.id}</TableCell>
              <TableCell>{type.name}</TableCell>
              <TableCell>{type.description}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>                                    
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditId(type.id);
                      setEditName(type.name);
                      setEditDescription(type.description);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => deleteDocumentType(type.id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Type;
