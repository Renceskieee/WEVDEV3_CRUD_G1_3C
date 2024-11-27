const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise'); // Use promise-based mysql2
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx'); // For processing XLS files
const moment = require('moment'); // For timestamp formatting

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data
app.use('/uploads', express.static('uploads')); 

// Database connection
let db;

// Initialize database connection
const initializeDBConnection = async () => {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'earist',
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process if the connection fails
    }
};

initializeDBConnection();

// File upload config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Route to handle XLS file upload and insert into a selected table
app.post('/upload-xls/:table', upload.single('file'), async (req, res) => {
    const { table } = req.params; // Get the table name from the route parameter
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Read the uploaded XLS file
        const workbook = xlsx.readFile(req.file.path);
        const sheet_name = workbook.SheetNames[0];
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

        if (!sheet.length) {
            return res.status(400).json({ error: 'No data in uploaded file' });
        }

        // Dynamically generate SQL and insert data into the selected table
        const columns = Object.keys(sheet[0]); // Extract column names from the first row of data
        const placeholders = columns.map(() => '?').join(', ');
        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

        for (const row of sheet) {
            const values = columns.map((col) => row[col]);
            await db.query(sql, values);
        }

        // Send success response
        res.json({ message: `File uploaded and data inserted successfully into ${table}` });

    } catch (error) {
        console.error('Error processing XLS file:', error);
        res.status(500).json({ error: 'Error processing XLS file' });
    } finally {
        // Delete the uploaded file after processing
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Error deleting uploaded file:', err);
            }
        });
    }
});

// Routes
app.get('/api/settings', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM company_settings WHERE id = 1');
        res.send(result[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error fetching settings' });
    }
});

// Helper function to delete old logo
const deleteOldLogo = (logoUrl) => {
    if (!logoUrl) return;

    const logoPath = path.join(__dirname, logoUrl);
    fs.unlink(logoPath, (err) => {
        if (err) {
            console.error(`Error deleting old logo at ${logoPath}: ${err}`);
        } else {
            console.log(`Previous logo at ${logoPath} deleted successfully.`);
        }
    });
};

// User registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Set role to "User" for all new registrations
    const role = 'User';

    // SQL query to insert the new user
    const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database with "User" as role
        await db.query(query, [username, email, hashedPassword, role]);

        res.status(200).send({ message: 'User Registered' });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).send({ error: 'Registration failed' });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    try {
        const [result] = await db.query(query, [email]);
        if (result.length === 0) return res.status(400).send({ message: 'User not found' });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).send({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).send({ token, user: { username: user.username, email: user.email } });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).send({ error: 'Login failed' });
    }
});

// CRUD operations for documents
// Get all documents
app.get('/document', async (req, res) => {
    const query = 'SELECT * FROM documents';
    try {
        const [result] = await db.query(query);
        res.status(200).send(result);
    } catch (err) {
        console.error('Error fetching documents:', err);
        return res.status(500).send({ error: 'Failed to fetch documents' });
    }
});

// Add new document
app.post('/document', async (req, res) => {
    const { document_code, title, description, type_id, created_by, current_handler, current_status, priority } = req.body;

    if (!document_code || !title || !type_id || !created_by || !current_handler || !current_status || !priority) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO documents (document_code, title, description, type_id, created_by, current_handler, current_status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await db.query(query, [document_code, title, description, type_id, created_by, current_handler, current_status, priority]);
        res.status(201).send({ message: 'Document created', id: result.insertId });
    } catch (err) {
        console.error('SQL Error:', err);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

// Update document
app.put('/document/:id', async (req, res) => {
  const { id } = req.params;
  const { document_code, title, description, type_id, created_by, current_handler, current_status, priority } = req.body;

  // Validate the required fields
  if (!document_code || !title || !type_id || !created_by || !current_handler || !current_status || !priority) {
      return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
      const [result] = await db.query(
          `UPDATE documents SET 
              document_code = ?, 
              title = ?, 
              description = ?, 
              type_id = ?, 
              created_by = ?, 
              current_handler = ?, 
              current_status = ?, 
              priority = ? 
          WHERE id = ?`, 
          [document_code, title, description, type_id, created_by, current_handler, current_status, priority, id]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Document not found' });
      }

      res.status(200).json({ message: 'Document updated successfully' });
  } catch (error) {
      console.error('Error updating document:', error); // Log the error
      res.status(500).json({ message: 'An error occurred while updating the document.', error: error.message }); // Send detailed error message
  }
});

// Delete document
app.delete('/document/:id', async (req, res) => {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM documents WHERE id = ?';
    try {
        const [result] = await db.query(deleteQuery, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Document not found' });
        }
        res.status(200).send({ message: 'Document deleted successfully' });
    } catch (err) {
        console.error('SQL Error:', err);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

// Route to fetch all document attachments
app.get('/document_attachments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM document_attachments');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching attachments:', error);
        res.status(500).json({ error: 'Error fetching attachments' });
    }
});

// Route to add a new attachment
app.post('/document_attachments', async (req, res) => {
    const { document_id, file_name, file_path, uploaded_by } = req.body;
    
    if (!document_id || !file_name || !file_path || !uploaded_by) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = `
            INSERT INTO document_attachments (document_id, file_name, file_path, uploaded_by) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [document_id, file_name, file_path, uploaded_by]);
        res.status(201).json({ message: 'Attachment added successfully', attachmentId: result.insertId });
    } catch (error) {
        console.error('Error adding attachment:', error);
        res.status(500).json({ error: 'Error adding attachment' });
    }
});

// Route to update an attachment
app.put('/document_attachments/:id', async (req, res) => {
    const { id } = req.params;
    const { document_id, file_name, file_path, uploaded_by } = req.body;

    if (!document_id || !file_name || !file_path || !uploaded_by) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = `
            UPDATE document_attachments 
            SET document_id = ?, file_name = ?, file_path = ?, uploaded_by = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [document_id, file_name, file_path, uploaded_by, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Attachment not found' });
        }

        res.status(200).json({ message: 'Attachment updated successfully' });
    } catch (error) {
        console.error('Error updating attachment:', error);
        res.status(500).json({ error: 'Error updating attachment' });
    }
});

// Route to delete an attachment
app.delete('/document_attachments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM document_attachments WHERE id = ?`;
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Attachment not found' });
        }

        res.status(200).json({ message: 'Attachment deleted successfully' });
    } catch (error) {
        console.error('Error deleting attachment:', error);
        res.status(500).json({ error: 'Error deleting attachment' });
    }
});

// Get all document movements
app.get('/document_movements', async (req, res) => {
    const query = 'SELECT * FROM document_movements';
    try {
        const [result] = await db.query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching document movements:', error);
        res.status(500).json({ error: 'Failed to fetch document movements' });
    }
});

// Add new document movement
app.post('/document_movements', async (req, res) => {
    const { document_id, from_user_id, to_user_id, from_department_id, to_department_id, status, remarks } = req.body;

    if (!document_id || !from_user_id || !to_user_id || !from_department_id || !to_department_id || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO document_movements (document_id, from_user_id, to_user_id, from_department_id, to_department_id, status, remarks) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const [result] = await db.query(query, [document_id, from_user_id, to_user_id, from_department_id, to_department_id, status, remarks]);
        res.status(201).json({ message: 'Movement added', id: result.insertId });
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).json({ error: 'Failed to add movement' });
    }
});

// Update document movement
app.put('/document_movements/:id', async (req, res) => {
    const { id } = req.params;
    const { document_id, status, from_user_id, to_user_id, from_department_id, to_department_id, remarks } = req.body;

    console.log(`Received update request for movement with ID: ${id}`);
    console.log('Request body:', req.body);

    try {
        const [result] = await db.query(`
            UPDATE document_movements
            SET 
                document_id = ?,
                status = ?,
                from_user_id = IFNULL(?, NULL),
                to_user_id = IFNULL(?, NULL),
                from_department_id = IFNULL(?, NULL),
                to_department_id = IFNULL(?, NULL),
                remarks = ?
            WHERE id = ?`,
            [document_id, status, from_user_id, to_user_id, from_department_id, to_department_id, remarks, id]
        );        

        console.log('SQL query result:', result); // Log the result here

        if (result.affectedRows > 0) {
            console.log('Successfully updated the document movement');
            res.status(200).json({ message: 'Movement updated successfully' });
        } else {
            console.log('No rows affected (movement not found or already up to date)');
            res.status(404).json({ message: 'Movement not found or no changes made' });
        }
    } catch (error) {
        console.error('Error occurred during update:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete document movement
app.delete('/document_movements/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM document_movements WHERE id = ?';
    try {
        const [result] = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Movement not found' });
        }
        res.status(200).json({ message: 'Movement deleted' });
    } catch (error) {
        console.error('Error deleting movement:', error);
        res.status(500).json({ error: 'Failed to delete movement' });
    }
});

// Get all document types
app.get('/document-types', async (req, res) => {
    const query = 'SELECT * FROM document_types';
    try {
        const [result] = await db.query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching document types:', error);
        res.status(500).json({ error: 'Failed to fetch document types' });
    }
});

// Add new document type
app.post('/document-types', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }

    const query = `
        INSERT INTO document_types (name, description, created_at, updated_at)
        VALUES (?, ?, NOW(), NOW())
    `;
    try {
        const [result] = await db.query(query, [name, description]);
        res.status(201).json({ message: 'Document type added', id: result.insertId });
    } catch (error) {
        console.error('Error adding document type:', error);
        res.status(500).json({ error: 'Failed to add document type' });
    }
});

// Update document type
app.put('/document-types/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }

    const query = `
        UPDATE document_types
        SET 
            name = ?,
            description = ?,
            updated_at = NOW()
        WHERE id = ?
    `;
    try {
        const [result] = await db.query(query, [name, description, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Document type updated successfully' });
        } else {
            res.status(404).json({ error: 'Document type not found' });
        }
    } catch (error) {
        console.error('Error updating document type:', error);
        res.status(500).json({ error: 'Failed to update document type' });
    }
});

// Delete document type
app.delete('/document-types/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM document_types WHERE id = ?';
    try {
        const [result] = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Document type not found' });
        }
        res.status(200).json({ message: 'Document type deleted successfully' });
    } catch (error) {
        console.error('Error deleting document type:', error);
        res.status(500).json({ error: 'Failed to delete document type' });
    }
});

// Get all departments
app.get('/departments', async (req, res) => {
    const query = 'SELECT * FROM departments';
    try {
        const [result] = await db.query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

// Add a new department
app.post('/departments', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const query = `
        INSERT INTO departments (name, created_at, updated_at)
        VALUES (?, NOW(), NOW())
    `;
    try {
        const [result] = await db.query(query, [name]);
        res.status(201).json({ message: 'Department added', id: result.insertId });
    } catch (error) {
        console.error('Error adding department:', error);
        res.status(500).json({ error: 'Failed to add department' });
    }
});

// Update department
app.put('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const query = `
        UPDATE departments
        SET name = ?, updated_at = NOW()
        WHERE id = ?
    `;
    try {
        const [result] = await db.query(query, [name, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Department updated successfully' });
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({ error: 'Failed to update department' });
    }
});

// Delete department
app.delete('/departments/:id', async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM departments WHERE id = ?';
    try {
        const [result] = await db.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ error: 'Failed to delete department' });
    }
});

// Route to fetch all notifications
app.get('/notifications', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM notifications');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});

// Route to add a new notification
app.post('/notifications', async (req, res) => {
    const { user_id, document_id, message } = req.body;

    if (!user_id || !document_id || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = 'INSERT INTO notifications (user_id, document_id, message) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [user_id, document_id, message]);
        res.status(201).json({ message: 'Notification added successfully', notificationId: result.insertId });
    } catch (error) {
        console.error('Error adding notification:', error);
        res.status(500).json({ error: 'Error adding notification' });
    }
});

// Route to update a notification
app.put('/notifications/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, document_id, message } = req.body;

    if (!user_id || !document_id || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const query = 'UPDATE notifications SET user_id = ?, document_id = ?, message = ? WHERE id = ?';
        const [result] = await db.query(query, [user_id, document_id, message, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification updated successfully' });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Error updating notification' });
    }
});

// Route to delete a notification
app.delete('/notifications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM notifications WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Error deleting notification' });
    }
});

// Fetch all document history
app.get('/document_history', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, document_id, changed_by, change_type, previous_status, new_status, previous_handler, new_handler, timestamp FROM document_history');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching document history:', error);
        res.status(500).json({ error: 'Error fetching document history' });
    }
});

// Add a new history entry
app.post('/document_history', async (req, res) => {
    const { document_id, changed_by, change_type, previous_status, new_status, previous_handler, new_handler } = req.body;

    // Validate change_type against enum values
    const validChangeTypes = ['Created', 'Updated', 'Moved', 'Status Changed'];
    if (!validChangeTypes.includes(change_type)) {
        return res.status(400).json({ error: `Invalid change_type. Valid values are: ${validChangeTypes.join(', ')}` });
    }

    if (!document_id || !changed_by || !change_type) {
        return res.status(400).json({ error: 'document_id, changed_by, and change_type are required' });
    }

    try {
        const query = `
            INSERT INTO document_history (document_id, changed_by, change_type, previous_status, new_status, previous_handler, new_handler)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [document_id, changed_by, change_type, previous_status, new_status, previous_handler, new_handler]);
        res.status(201).json({ message: 'History entry added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding history entry:', error);
        res.status(500).json({ error: 'Error adding history entry' });
    }
});

// Update an existing history entry
app.put('/document_history/:id', async (req, res) => {
    const { id } = req.params;
    const { document_id, changed_by, change_type, previous_status, new_status, previous_handler, new_handler } = req.body;

    // Validate change_type against enum values
    const validChangeTypes = ['Created', 'Updated', 'Moved', 'Status Changed'];
    if (!validChangeTypes.includes(change_type)) {
        return res.status(400).json({ error: `Invalid change_type. Valid values are: ${validChangeTypes.join(', ')}` });
    }

    if (!document_id || !changed_by || !change_type) {
        return res.status(400).json({ error: 'document_id, changed_by, and change_type are required' });
    }

    try {
        const query = `
            UPDATE document_history
            SET document_id = ?, changed_by = ?, change_type = ?, previous_status = ?, new_status = ?, previous_handler = ?, new_handler = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [document_id, changed_by, change_type, previous_status, new_status, previous_handler, new_handler, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'History entry not found' });
        }

        res.status(200).json({ message: 'History entry updated successfully' });
    } catch (error) {
        console.error('Error updating history entry:', error);
        res.status(500).json({ error: 'Error updating history entry' });
    }
});

// Delete a history entry
app.delete('/document_history/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM document_history WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'History entry not found' });
        }

        res.status(200).json({ message: 'History entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting history entry:', error);
        res.status(500).json({ error: 'Error deleting history entry' });
    }
});

// GET all users
app.get('/users', async (req, res) => {
    try {
        const [result] = await db.query('SELECT id, username, first_name, last_name, email, role, department_id FROM users');
        res.json(result);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send({ message: 'Failed to fetch users' });
    }
});

// PUT (update a user)
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, first_name, last_name, email, role, department_id } = req.body;

    try {
        const query = `
            UPDATE users
            SET username = ?, first_name = ?, last_name = ?, email = ?, role = ?, department_id = ?
            WHERE id = ?
        `;

        const params = [username, first_name, last_name, email, role, department_id, id];
        await db.query(query, params);

        res.json({ id, username, first_name, last_name, email, role, department_id });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send({ message: 'Failed to update user' });
    }
});

// DELETE a user
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM users WHERE id = ?';
        await db.query(query, [id]);
        res.status(204).send(); // No content
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send({ message: 'Failed to delete user' });
    }
});

// Update company settings
app.post('/api/settings', upload.single('logo'), async (req, res) => {
    const companyName = req.body.company_name || '';
    const headerColor = req.body.header_color || '#ffffff';
    const footerText = req.body.footer_text || '';
    const footerColor = req.body.footer_color || '#ffffff';
    const activeNavIndexColor = req.body.active_nav_index_color || '#000000'; // New color setting
    const companyNameColor = req.body.company_name_color || '#000000'; // New: Company Name Color
    const footerTextColor = req.body.footer_text_color || '#000000'; // New: Footer Text Color
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null; // Fixed missing backtick

    try {
        const [result] = await db.query('SELECT * FROM company_settings WHERE id = 1');

        if (result.length > 0) {
            const oldLogoUrl = result[0].logo_url;

            const query = `
                UPDATE company_settings 
                SET 
                    company_name = ?, 
                    header_color = ?, 
                    footer_text = ?, 
                    footer_color = ?, 
                    active_nav_index_color = ?, 
                    company_name_color = ?, 
                    footer_text_color = ? 
                    ${logoUrl ? ', logo_url = ?' : ''}
                WHERE id = 1
            `;
            const params = [
                companyName,
                headerColor,
                footerText,
                footerColor,
                activeNavIndexColor,
                companyNameColor,
                footerTextColor,
            ];

            if (logoUrl) params.push(logoUrl);

            await db.query(query, params);

            if (logoUrl && oldLogoUrl) {
                deleteOldLogo(oldLogoUrl); // Delete old logo file if a new one is uploaded
            }

            res.send({ success: true });
        } else {
            const query = `
                INSERT INTO company_settings 
                (company_name, header_color, footer_text, footer_color, active_nav_index_color, company_name_color, footer_text_color, logo_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await db.query(query, [
                companyName,
                headerColor,
                footerText,
                footerColor,
                activeNavIndexColor,
                companyNameColor,
                footerTextColor,
                logoUrl,
            ]);
            res.send({ success: true });
        }
    } catch (err) {
        console.error('Error updating company settings:', err);
        return res.status(500).send({ error: 'Failed to update company settings' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
