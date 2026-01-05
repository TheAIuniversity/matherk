const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Database setup
const db = new Database(process.env.DATABASE_URL || './matherk.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_name TEXT NOT NULL,
    unit TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    total_score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_identifications INTEGER DEFAULT 0,
    correct_engagements INTEGER DEFAULT 0,
    avg_response_time REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    question_type TEXT NOT NULL,
    vehicle_id TEXT NOT NULL,
    user_answer TEXT,
    correct_answer TEXT,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    response_time_ms INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_name TEXT NOT NULL,
    unit TEXT,
    score INTEGER NOT NULL,
    accuracy REAL,
    avg_time REAL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// API Routes

// Start new session
app.post('/api/session/start', (req, res) => {
  const { participant_name, unit } = req.body;

  if (!participant_name) {
    return res.status(400).json({ error: 'Naam is verplicht' });
  }

  const stmt = db.prepare('INSERT INTO sessions (participant_name, unit) VALUES (?, ?)');
  const result = stmt.run(participant_name, unit || 'Onbekend');

  res.json({
    session_id: result.lastInsertRowid,
    message: 'Sessie gestart'
  });
});

// Submit answer
app.post('/api/session/:sessionId/answer', (req, res) => {
  const { sessionId } = req.params;
  const { question_type, vehicle_id, user_answer, correct_answer, is_correct, points_earned, response_time_ms } = req.body;

  const stmt = db.prepare(`
    INSERT INTO answers (session_id, question_type, vehicle_id, user_answer, correct_answer, is_correct, points_earned, response_time_ms)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(sessionId, question_type, vehicle_id, user_answer, correct_answer, is_correct, points_earned, response_time_ms);

  // Update session totals
  const updateStmt = db.prepare(`
    UPDATE sessions
    SET total_score = total_score + ?,
        total_questions = total_questions + 1,
        correct_identifications = correct_identifications + CASE WHEN ? = 'identification' AND ? = 1 THEN 1 ELSE 0 END,
        correct_engagements = correct_engagements + CASE WHEN ? = 'engagement' AND ? = 1 THEN 1 ELSE 0 END
    WHERE id = ?
  `);

  updateStmt.run(points_earned, question_type, is_correct ? 1 : 0, question_type, is_correct ? 1 : 0, sessionId);

  res.json({ success: true });
});

// Complete session
app.post('/api/session/:sessionId/complete', (req, res) => {
  const { sessionId } = req.params;

  // Calculate average response time
  const avgTimeResult = db.prepare('SELECT AVG(response_time_ms) as avg_time FROM answers WHERE session_id = ?').get(sessionId);

  const updateStmt = db.prepare(`
    UPDATE sessions
    SET completed_at = CURRENT_TIMESTAMP,
        avg_response_time = ?
    WHERE id = ?
  `);
  updateStmt.run(avgTimeResult.avg_time || 0, sessionId);

  // Get final session data
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);

  // Add to leaderboard
  const accuracy = session.total_questions > 0
    ? ((session.correct_identifications + session.correct_engagements) / (session.total_questions) * 100).toFixed(1)
    : 0;

  const leaderboardStmt = db.prepare(`
    INSERT INTO leaderboard (participant_name, unit, score, accuracy, avg_time)
    VALUES (?, ?, ?, ?, ?)
  `);
  leaderboardStmt.run(session.participant_name, session.unit, session.total_score, accuracy, session.avg_response_time);

  res.json({
    session,
    accuracy,
    message: 'Sessie voltooid'
  });
});

// Get session results
app.get('/api/session/:sessionId/results', (req, res) => {
  const { sessionId } = req.params;

  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);
  const answers = db.prepare('SELECT * FROM answers WHERE session_id = ? ORDER BY created_at').all(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Sessie niet gevonden' });
  }

  const accuracy = session.total_questions > 0
    ? ((session.correct_identifications + session.correct_engagements) / session.total_questions * 100).toFixed(1)
    : 0;

  res.json({ session, answers, accuracy });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const unit = req.query.unit;

  let query = 'SELECT * FROM leaderboard';
  let params = [];

  if (unit) {
    query += ' WHERE unit = ?';
    params.push(unit);
  }

  query += ' ORDER BY score DESC, accuracy DESC, avg_time ASC LIMIT ?';
  params.push(limit);

  const leaderboard = db.prepare(query).all(...params);
  res.json(leaderboard);
});

// Get all units for filtering
app.get('/api/units', (req, res) => {
  const units = db.prepare('SELECT DISTINCT unit FROM leaderboard WHERE unit IS NOT NULL').all();
  res.json(units.map(u => u.unit));
});

// Export results as CSV
app.get('/api/export/csv', (req, res) => {
  const results = db.prepare(`
    SELECT
      l.participant_name as Naam,
      l.unit as Eenheid,
      l.score as Score,
      l.accuracy as 'Nauwkeurigheid %',
      l.avg_time as 'Gem. Tijd (ms)',
      l.completed_at as Datum
    FROM leaderboard l
    ORDER BY l.score DESC
  `).all();

  const headers = Object.keys(results[0] || {}).join(',');
  const rows = results.map(r => Object.values(r).join(',')).join('\n');
  const csv = headers + '\n' + rows;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=matherk-resultaten.csv');
  res.send(csv);
});

// Serve main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`MATHERK server draait op port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in je browser`);
});
