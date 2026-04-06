#!/usr/bin/env node

/**
 * Simple Express server for web configurator + API
 *
 * Usage:
 *   node server.js
 *
 * Then open: http://localhost:3000
 */

const express = require('express');
const path = require('path');
const triggerWorkflow = require('./api/trigger-workflow');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('web-configrator'));

// API endpoint
app.post('/api/trigger-workflow', async (req, res) => {
  try {
    await triggerWorkflow(req, res);
  } catch (error) {
    res.status(500).json({
      error: 'API Error',
      message: error.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-configrator', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║  White-Label App Configurator         ║
╚═══════════════════════════════════════╝

✅ Server running on: http://localhost:${PORT}

📝 Open in browser: http://localhost:${PORT}

🛑 To stop: Press Ctrl+C
  `);
});
