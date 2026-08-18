const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
// Menggunakan port dinamis dari Railway/environment, atau fallback ke 3000 untuk lokal
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Inisialisasi Database SQLite
const db = new sqlite3.Database('./pendaftaran.db', (err) => {
    if (err) {
        console.error('Gagal membuka database:', err.message);
    } else {
        console.log('Terhubung ke database SQLite.');
        // Buat Tabel jika belum ada
        db.run(`CREATE TABLE IF NOT EXISTS pendaftar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Endpoint POST untuk menerima data dari HTML
app.post('/api/daftar', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi!' });
    }

    const query = `INSERT INTO pendaftar (email, password) VALUES (?, ?)`;
    
    db.run(query, [email, password], function (err) {
        if (err) {
            console.error('Gagal menyimpan:', err.message);
            return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
        }
        res.status(201).json({ 
            message: 'Data pendaftaran berhasil disimpan',
            id: this.lastID 
        });
    });
});

// Endpoint rahasia untuk mengecek seluruh data tersimpan via browser
app.get('/api/lihat-pendaftar-secret-123', (req, res) => {
    db.all(`SELECT * FROM pendaftar ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json({ total: rows.length, data: rows });
    });
});

// Jalankan Server dengan host '0.0.0.0' agar dapat diakses oleh kontainer Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server backend berjalan di port ${PORT}`);
});