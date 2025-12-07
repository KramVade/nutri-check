/*
 * Arduino Serial Bridge for Nutri-Check
 * 
 * This Node.js application reads data from Arduino via Serial
 * and exposes it via HTTP endpoints for the web app
 * 
 * Installation:
 * npm install express serialport cors
 * 
 * Usage:
 * 1. Connect Arduino via USB
 * 2. Update COM_PORT below (e.g., 'COM3' on Windows, '/dev/ttyUSB0' on Linux)
 * 3. Run: node arduino-serial-bridge.js
 * 4. Access at http://localhost:8081/height
 */

const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');

const app = express();
app.use(cors());

// Configuration
const COM_PORT = 'COM3';  // Change this to your Arduino's port
const BAUD_RATE = 9600;
const HTTP_PORT = 8081;

// Current sensor data
let currentHeight = 0;
let lastUpdate = null;

// Initialize serial port
const port = new SerialPort({
  path: COM_PORT,
  baudRate: BAUD_RATE
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Handle serial data
parser.on('data', (data) => {
  const value = parseFloat(data.trim());
  
  if (!isNaN(value) && value > 0) {
    currentHeight = value;
    lastUpdate = new Date();
    console.log(`Height received: ${currentHeight.toFixed(2)} cm`);
  }
});

// Handle serial errors
port.on('error', (err) => {
  console.error('Serial port error:', err.message);
});

// HTTP endpoint to get height
app.get('/height', (req, res) => {
  res.json({
    height: currentHeight,
    unit: 'cm',
    timestamp: lastUpdate ? lastUpdate.getTime() : null,
    status: lastUpdate ? 'active' : 'waiting'
  });
});

// HTTP endpoint to trigger measurement
app.get('/measure', (req, res) => {
  port.write('a', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to trigger measurement' });
    }
    res.json({ status: 'measurement started', duration: '5 seconds' });
  });
});

// Start HTTP server
app.listen(HTTP_PORT, () => {
  console.log(`Arduino Serial Bridge running on port ${HTTP_PORT}`);
  console.log(`Height endpoint: http://localhost:${HTTP_PORT}/height`);
  console.log(`Trigger measurement: http://localhost:${HTTP_PORT}/measure`);
  console.log(`Connected to Arduino on ${COM_PORT}`);
});
