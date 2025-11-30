const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const db = new sqlite3.Database('./gametok.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    createTables();
  }
});

function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    avatar TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    type TEXT,
    creator TEXT,
    likes INTEGER DEFAULT 0
  )`, (err) => {
    if (!err) {
      // Seed data if empty
      db.get("SELECT count(*) as count FROM games", (err, row) => {
        if (row.count === 0) {
          console.log("Seeding games...");
          const stmt = db.prepare("INSERT INTO games (title, description, type, creator, likes) VALUES (?, ?, ?, ?, ?)");
          stmt.run("Flappy Bird Clone", "Tap to fly", "arcade", "flappy_dev", 120);
          stmt.run("2048", "Join the numbers", "puzzle", "math_wiz", 890);
          stmt.run("Snake", "Eat the apples", "arcade", "retro_gamer", 340);
          stmt.run("Tetris", "Stack the blocks", "puzzle", "block_master", 560);
          stmt.finalize();
        }
      });
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    game_id INTEGER,
    score INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(game_id) REFERENCES games(id)
  )`);
  
  // Add more tables for likes, comments later
}

// Routes
app.get('/', (req, res) => {
  res.send('GameTok API is running');
});

app.get('/games', (req, res) => {
  db.all("SELECT * FROM games", [], (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

app.post('/games/:id/like', (req, res) => {
  const gameId = req.params.id;
  // In a real app, we would check if user already liked it
  db.run("UPDATE games SET likes = likes + 1 WHERE id = ?", [gameId], function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "likes": this.changes // This doesn't return the new count, but we can just increment on client
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
