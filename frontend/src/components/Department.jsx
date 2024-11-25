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
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Add a new department
  const addDepartment = async () => {
    if (!newName) {
      setSnackbarMessage("Name is required!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post("http://localhost:5000/departments", {
        name: newName,
      });
      setNewName("");
      setSnackbarMessage("Department added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
      setSnackbarMessage("Failed to add department!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Update an existing department
  const updateDepartment = async () => {
    if (!editName) {
      setSnackbarMessage("Name is required!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/departments/${editId}`, {
        name: editName,
      });
      setEditId(null);
      setEditName("");
      setSnackbarMessage("Department updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
      setSnackbarMessage("Failed to update department!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Delete a department
  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/departments/${id}`);
      fetchDepartments();
      setSnackbarMessage("Department deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting department:", error);
      setSnackbarMessage("Failed to delete department!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setEditId(null);
    setEditName("");
    setNewName("");
  };

  // Handle Snackbar Close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          <Button
            onClick={addDepartment}
            variant="contained"
            color="error"
            sx={{ marginTop: "10px" }}
          >
            Add Department
          </Button>
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
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>{dept.id}</TableCell>
              <TableCell>{dept.name}</TableCell>
              <TableCell>
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

export default Department;
