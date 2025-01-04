const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join('/tmp', 'data.json'); // Use /tmp directory on Vercel

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ messages: [] }, null, 2));
}

// Get all messages
app.get('/messages', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data.messages);
});

// Add a new message
app.post('/messages', (req, res) => {
  const { text } = req.body; // Only text is required now
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const newMessage = { id: Date.now(), text };
  data.messages.push(newMessage);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(201).json(newMessage);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = (req, res) => {
  app(req, res);
};
