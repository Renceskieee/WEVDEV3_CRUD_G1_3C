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

// Route to handle XLS file upload and insert into MySQL
app.post('/upload-xls', upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
      // Read the uploaded XLS file
      const workbook = xlsx.readFile(req.file.path);
      const sheet_name = workbook.SheetNames[0];
      const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

      // Log the uploaded data
      console.log('Uploaded sheet data:', sheet);

      // Insert data into the documents table
      for (const row of sheet) {
          const documentCode = row.document_code;
          const title = row.title;
          const description = row.description;
          const typeId = row.type_id;
          const createdBy = row.created_by;
          const currentHandler = row.current_handler;
          const currentStatus = row.current_status;
          const priority = row.priority;

          const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
          const updatedAt = createdAt;

          const sql = `INSERT INTO documents 
                      (document_code, title, description, type_id, created_by, current_handler, current_status, priority, created_at, updated_at) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          await db.query(sql, [documentCode, title, description, typeId, createdBy, currentHandler, currentStatus, priority, createdAt, updatedAt]);
      }

      // Send response after successful insertion
      res.json({ message: 'File uploaded and data inserted successfully' });

  } catch (error) {
      console.error('Error processing XLS file:', error);
      res.status(500).json({ error: 'Error processing XLS file' });
  } finally {
      // Delete the uploaded file after processing
      fs.unlink(req.file.path, (err) => {
          if (err) {
              console.error('Error deleting uploaded file:', err);
          } else {
              console.log('Uploaded file deleted');
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
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    try {
        await db.query(query, [username, email, hashedPassword]);
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

// Update company settings
app.post('/api/settings', upload.single('logo'), async (req, res) => {
    const companyName = req.body.company_name || '';
    const headerColor = req.body.header_color || '#ffffff';
    const footerText = req.body.footer_text || '';
    const footerColor = req.body.footer_color || '#ffffff';
    const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const [result] = await db.query('SELECT * FROM company_settings WHERE id = 1');

        if (result.length > 0) {
            const oldLogoUrl = result[0].logo_url;

            const query = 'UPDATE company_settings SET company_name = ?, header_color = ?, footer_text = ?, footer_color = ?' +
                (logoUrl ? ', logo_url = ?' : '') + ' WHERE id = 1';
            const params = [companyName, headerColor, footerText, footerColor];
            if (logoUrl) params.push(logoUrl);

            await db.query(query, params);

            if (logoUrl && oldLogoUrl) {
                deleteOldLogo(oldLogoUrl);
            }

            res.send({ success: true });
        } else {
            const query = 'INSERT INTO company_settings (company_name, header_color, footer_text, footer_color, logo_url) VALUES (?, ?, ?, ?, ?)';
            await db.query(query, [companyName, headerColor, footerText, footerColor, logoUrl]);
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
