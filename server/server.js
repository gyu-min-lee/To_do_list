const express = require('express');
const cors = require('cors');
const db = require('./db'); //MySQL 연결

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://todo-gyum.vercel.app"
      : `http://localhost:${PORT}`;
  console.log(`✅ Server running on ${url}`);
});

// 새로운 투두 추가
app.post('/todos', (req, res) => {
    const { title } = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    db.query(
        `INSERT INTO todos (title, completed, created_at, updated_at) VALUES (?, ?, ?, ?)`,
        [title, 0, createdAt, updatedAt],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }   
            res.json({ 
                id: result.insertId, 
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
    db.query(`SELECT * FROM todos`, [], (err, rows) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 투두 수정
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const updatedAt = new Date().toISOString();

    db.query(
        `UPDATE todos SET title = ?, completed = ?, updated_at = ? WHERE id = ?`, [title, completed, updatedAt, id],
        (err, result) => {
            if(err) {
                return res.status(500).json({ error: err.message });
            }
            if(result.affectedRows === 0) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.json({ id, title, completed, updated_at: updatedAt });
        }
    );
});

// 투두 삭제
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    db.query(`DELETE FROM todos WHERE id = ?`, [id], (err, result) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully', id });
    });
});
// === 스냅샷 저장 ===
app.post('/snapshots', (req, res) => {
    const { title, todos } = req.body;
    const createdAt = new Date().toISOString();

    db.query(
        `INSERT INTO snapshots (title, todos, created_at) VALUES (?, ?, ?)`,
        [title, JSON.stringify(todos), createdAt],
        (err, result) => {
            if(err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, title, todos, created_at: createdAt });
        }
    );
});

// 모든 스냅샷 불러오기
app.get('/snapshots', (req, res) => {
    db.query(`SELECT * FROM snapshots ORDER BY id DESC`, [], (err, rows) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 스냅샷 삭제
app.delete('/snapshots/:id', (req, res) => {
    const { id } = req.params;
    db.query(`DELETE FROM snapshots WHERE id = ?`, [id], (err, result) => {
        if(err) return res.status(500).json({ error: err.message });
        if(this.changes === 0) return res.status(404).json({ error: 'Snapshot not found' });
        res.json({ message: 'Snapshot deleted successfully', id });
    });
});
