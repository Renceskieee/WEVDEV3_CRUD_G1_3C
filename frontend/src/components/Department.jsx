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
import { Delete, Edit, Print } from "@mui/icons-material"; // Added Print icon
import axios from "axios";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const addDepartment = async () => {
    if (!newName) {
      showSnackbar("Name is required!", "error");
      return;
    }

    try {
      await axios.post("http://localhost:5000/departments", { name: newName });
      setNewName("");
      showSnackbar("Department added successfully!", "success");
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
      showSnackbar("Failed to add department!", "error");
    }
  };

  const updateDepartment = async () => {
    if (!editName) {
      showSnackbar("Name is required!", "error");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/departments/${editId}`, {
        name: editName,
      });
      setEditId(null);
      setEditName("");
      showSnackbar("Department updated successfully!", "success");
      fetchDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
      showSnackbar("Failed to update department!", "error");
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/departments/${id}`);
      showSnackbar("Department deleted successfully!", "success");
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      showSnackbar("Failed to delete department!", "error");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setEditName("");
    setNewName("");
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const printTable = () => {
    const printWindow = window.open("", "", "width=800,height=600");

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
            <h2>Departments</h2>
            <table>
                <thead>
                    <tr>
                        <th><center>Name</center></th>
                    </tr>
                </thead>
                <tbody>
                    ${departments.map(
                      (dept) => `
                        <tr>
                            <td>${dept.name}</td>
                        </tr>
                    `
                    ).join("")}
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
        Departments
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
        {editId ? (
          <>
            <Button
              onClick={updateDepartment}
              variant="contained"
              color="error"
              sx={{ marginTop: "10px" }}
            >
              Update Department
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
          <>
            <Button
              onClick={addDepartment}
              variant="contained"
              color="error"
              sx={{ marginTop: "10px" }}
            >
              Add Department
            </Button>
            <Button
              onClick={printTable}
              variant="contained"
              color="info"
              sx={{ marginTop: "10px", marginLeft: "10px" }}
              startIcon={<Print />}
            >
              Print
            </Button>
          </>
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
            <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell sx={{ border: '1px solid black', textAlign: 'center' }}>{dept.id}</TableCell>
              <TableCell>{dept.name}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>                                    
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditId(dept.id);
                      setEditName(dept.name);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => deleteDepartment(dept.id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

export default Department;
