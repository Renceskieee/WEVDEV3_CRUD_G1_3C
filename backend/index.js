const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db',
});

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
    const { name } = req.body;
    const query = 'INSERT INTO items (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).send({ message: 'Item created', id: result.insertId });
    });
});

app.put('/items/:id', (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const query = 'UPDATE items SET name = ? WHERE id = ?';
    db.query(query, [name, id], (err, result) => {
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



app.listen(5000, () => {
    console.log('Server is running at port 5000');
});