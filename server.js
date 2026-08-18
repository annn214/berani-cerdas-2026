const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Inisialisasi Database SQLite
const db = new Database(path.join(__dirname, 'pendaftaran.db'));
db.exec(`
    CREATE TABLE IF NOT EXISTS pendaftar (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Endpoint POST untuk daftar
app.post('/api/daftar', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi!' });
    }

    try {
        const stmt = db.prepare('INSERT INTO pendaftar (email, password) VALUES (?, ?)');
        const info = stmt.run(email, password);
        res.status(201).json({
            message: 'Data pendaftaran berhasil disimpan',
            id: info.lastInsertRowid
        });
    } catch (err) {
        console.error('Gagal menyimpan:', err.message);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});

// Endpoint rahasia untuk lihat data
app.get('/api/lihat-pendaftar-secret-123', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM pendaftar ORDER BY created_at DESC').all();
        res.json({ total: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server backend berjalan di port ${PORT}`);
});