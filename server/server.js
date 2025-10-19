const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const db = require('../db/db');    // 방금 만든 db 연결

// 새로운 투두 추가
app.post('/todos', (req, res) => {
    const { title } = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    db.run(
        `INSERT INTO todos (title, completed, created_at, updated_at) VALUES (?, ?, ?, ?)`,
        [title, 0, createdAt, updatedAt],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }   
            res.json({ 
                id: this.lastID, 
                title, 
                completed: 0, 
                created_at: createdAt, 
                updated_at: updatedAt
             });
        }
    );
});

// 모든 투두 불러오기
app.get('/todos', (req, res) => {
    db.all(`SELECT * FROM todos`, [], (err, rows) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 투두 수정
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const updatedAt = new Date().toISOString();

    db.run(
        `UPDATE todos SET title = ?, completed = ?, updated_at = ? WHERE id = ?`, [title, completed, updatedAt, id],
        function(err) {
            if(err) {
                return res.status(500).json({ error: err.message });
            }
            if(this.changes === 0) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.json({ id, title, completed, updated_at: updatedAt });
        }
    );
});

// 투두 삭제
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM todos WHERE id = ?`, [id], function(err) {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully', id });
    });
});
// === 스냅샷 저장 ===
app.post('/snapshots', (req, res) => {
    const { title, todos } = req.body;
    const createdAt = new Date().toISOString();

    db.run(
        `INSERT INTO snapshots (title, todos, created_at) VALUES (?, ?, ?)`,
        [title, JSON.stringify(todos), createdAt],
        function(err) {
            if(err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, todos, created_at: createdAt });
        }
    );
});

// 모든 스냅샷 불러오기
app.get('/snapshots', (req, res) => {
    db.all(`SELECT * FROM snapshots ORDER BY id DESC`, [], (err, rows) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 스냅샷 삭제
app.delete('/snapshots/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM snapshots WHERE id = ?`, [id], function(err) {
        if(err) return res.status(500).json({ error: err.message });
        if(this.changes === 0) return res.status(404).json({ error: 'Snapshot not found' });
        res.json({ message: 'Snapshot deleted successfully', id });
    });
});
