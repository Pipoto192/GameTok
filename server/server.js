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
    likes INTEGER DEFAULT 0,
    game_url TEXT
  )`, (err) => {
    if (!err) {
      // Try to add game_url column if it doesn't exist (for migration from old schema)
      db.run("ALTER TABLE games ADD COLUMN game_url TEXT", (err) => {
        // Ignore error if column already exists
        
        // Seed data if empty
        db.get("SELECT count(*) as count FROM games", (err, row) => {
          if (err) {
            console.error("Error checking game count:", err);
            return;
          }
          if (row.count === 0) {
            console.log("Seeding games...");
            const stmt = db.prepare("INSERT INTO games (title, description, type, creator, likes, game_url) VALUES (?, ?, ?, ?, ?, ?)");
            stmt.run("Flappy Bird Clone", "Tap to fly", "arcade", "flappy_dev", 120, "/games/flappy.html");
            stmt.run("2048", "Join the numbers", "puzzle", "math_wiz", 890, "/games/2048.html");
            stmt.run("Snake", "Eat the apples", "arcade", "retro_gamer", 340, "/games/snake.html");
            stmt.run("Tetris", "Stack the blocks", "puzzle", "block_master", 560, "/games/test.html");
            stmt.finalize();
          } else {
            // Force update for development to ensure URLs are correct
            console.log("Updating game URLs...");
            db.run("UPDATE games SET game_url = '/games/flappy.html' WHERE title LIKE 'Flappy%'", (err) => { if(err) console.error(err.message); });
            db.run("UPDATE games SET game_url = '/games/2048.html' WHERE title = '2048'", (err) => { if(err) console.error(err.message); });
            db.run("UPDATE games SET game_url = '/games/snake.html' WHERE title = 'Snake'", (err) => { if(err) console.error(err.message); });
          }
        });
      });
    } else {
      console.error("Error creating games table:", err);
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

app.post('/scores', (req, res) => {
  const { user_id, game_id, score } = req.body;
  db.run("INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)", [user_id || 1, game_id, score], function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "id": this.lastID
    });
  });
});

app.get('/games/:id/scores', (req, res) => {
  const gameId = req.params.id;
  db.all("SELECT scores.score, users.username FROM scores JOIN users ON scores.user_id = users.id WHERE game_id = ? ORDER BY score DESC LIMIT 10", [gameId], (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    });
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  // In production, hash password!
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "user": { id: this.lastID, username }
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    if (row) {
      res.json({
        "message": "success",
        "user": { id: row.id, username: row.username },
        "token": "fake-jwt-token"
      });
    } else {
      res.status(401).json({"message": "Invalid credentials"});
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
