const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const DATA_FILE = 'data.json';

// Middleware
app.use(bodyParser.json());

// Initialize data file
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
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const newMessage = { id: Date.now(), text };
  data.messages.push(newMessage);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(201).json(newMessage);
});

// Export the serverless function
module.exports = (req, res) => {
  app(req, res);
};
