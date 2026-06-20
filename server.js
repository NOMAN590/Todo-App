require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection Pool
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

// Add this temporary diagnostic log to check connection status
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Database connection error:', err.stack);
    }
    console.log('✅ Connected to PostgreSQL database successfully!');
    release();
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');

// --- ROUTES ---

// 1. READ: Get all tasks
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
        res.render('index', { todos: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. CREATE: Add a new task
app.post('/add', async (req, res) => {
    try {
        const { title } = req.body;
        if (title.trim() !== "") {
            await pool.query('INSERT INTO todos (title) VALUES ($1)', [title]);
        }
        res.redirect('/');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 3. UPDATE: Toggle complete status
app.post('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Toggles the current boolean status
        await pool.query('UPDATE todos SET completed = NOT completed WHERE id = $1', [id]);
        res.redirect('/');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 4. DELETE: Remove a task
app.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM todos WHERE id = $1', [id]);
        res.redirect('/');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running efficiently on http://localhost:${PORT}`);
});