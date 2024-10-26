const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Import file system module

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve logo images

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db',
});

// File upload config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });

// Get company settings
app.get('/api/settings', (req, res) => {
  db.query('SELECT * FROM company_settings WHERE id = 1', (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

// Helper function to delete old logo
const deleteOldLogo = (logoUrl) => {
  if (!logoUrl) return; // If no logo URL, exit early

  const logoPath = path.join(__dirname, logoUrl); // Construct the full path to the logo file
  fs.unlink(logoPath, (err) => {
    if (err) {
      console.error(`Error deleting old logo at ${logoPath}: ${err}`);
    } else {
      console.log(`Previous logo at ${logoPath} deleted successfully.`);
    }
  });
};

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected Successfully...');
})

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `INSERT INTO users (username, email, password) VALUES (?,?,?)`;
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({message: 'User Registered'});
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], async (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.length === 0) return res.status(400).send({ message: 'User not found' });
  
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) return res.status(400).send({ message: 'Invalid Credentials' });
  
      const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
      res.status(200).send({ token, user: { username: user.username, email: user.email } });
    });
});

app.get('/data', (req, res) => {
    const query = `SELECT * FROM items`;
    db.query(query, (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(result);
    });
});

app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.query(query, (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(result);
    });
});

app.post('/items', (req, res) => {
  const { name, lastname } = req.body;
  const query = 'INSERT INTO items (name, lastname) VALUES (?, ?)';
  db.query(query, [name, lastname], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Item created', id: result.insertId });
  });
});

app.put('/items/:id', (req, res) => {
  const { name, lastname } = req.body;
  const { id } = req.params;
  const query = 'UPDATE items SET name = ?, lastname = ? WHERE id = ?';
  db.query(query, [name, lastname, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Item updated' });
  });
});

app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: 'Item deleted' });
    });
});

// Update company settings
app.post('/api/settings', upload.single('logo'), (req, res) => {
  const companyName = req.body.company_name || '';
  const headerColor = req.body.header_color || '#ffffff';
  const footerText = req.body.footer_text || '';
  const footerColor = req.body.footer_color || '#ffffff';
  const logoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Check if company settings already exist
  db.query('SELECT * FROM company_settings WHERE id = 1', (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // Existing settings found
     
      const oldLogoUrl = result[0].logo_url; // Save old logo URL for deletion

      // Update existing settings
      const query = 'UPDATE company_settings SET company_name = ?, header_color = ?, footer_text = ?, footer_color = ?' +
                    (logoUrl ? ', logo_url = ?' : '') + ' WHERE id = 1';
      const params = [companyName, headerColor, footerText, footerColor];
      if (logoUrl) params.push(logoUrl);

      db.query(query, params, (err) => {
        if (err) throw err;

        // If there's a new logo, delete the old one
        if (logoUrl && oldLogoUrl) {
          deleteOldLogo(oldLogoUrl);
        }

        res.send({ success: true });
      });
    } else {
      // Insert new settings
      const query = 'INSERT INTO company_settings (company_name, header_color, footer_text, footer_color, logo_url) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [companyName, headerColor, footerText, footerColor, logoUrl], (err) => {
        if (err) throw err;
        res.send({ success: true });
      });
    }
  });
});

app.listen(5000, () => {
    console.log('Server is running at port 5000');
});