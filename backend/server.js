const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes...
app.get('/tasks', async (req, res) => {
    const result = await db.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
});

app.post('/tasks', async (req, res) => {
    const { task } = req.body;
    const result = await db.query(
        'INSERT INTO tasks (task) VALUES ($1) RETURNING *',
        [task]
    );
    res.json(result.rows[0]);
});

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ success: true });
});

// ✅ Server start with table init
(async function start() {
    try {
        await db.init(); // ✅ Table create call
        console.log("✅ Tasks table ready");
        app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
    } catch (err) {
        console.error("❌ Error initializing DB:", err);
        process.exit(1);
    }
})();