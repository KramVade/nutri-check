/*
 * Arduino Height Sensor Bridge for Nutri-Check
 * 
 * This reads height data from Arduino via Serial and exposes it via HTTP
 * 
 * Usage:
 * 1. Connect Height Arduino via USB
 * 2. Update COM_PORT below (check Device Manager on Windows)
 * 3. Run: node arduino-height-bridge.js
 * 4. Access at http://localhost:8081/height
 */

const express = require('express');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');

const app = express();
app.use(cors());

// Configuration - CHANGE THIS TO YOUR ARDUINO'S PORT
const COM_PORT = 'COM5';  // Windows: COM3, COM4, etc. | Mac/Linux: /dev/ttyUSB0, /dev/ttyACM0
const BAUD_RATE = 9600;
const HTTP_PORT = 8081;

// Current sensor data
let currentHeight = 0;
let lastUpdate = null;
let isConnected = false;

// Initialize serial port
const port = new SerialPort({
  path: COM_PORT,
  baudRate: BAUD_RATE
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Handle serial connection
port.on('open', () => {
  console.log('✓ Serial port opened successfully');
  isConnected = true;
});

// Handle serial data
parser.on('data', (data) => {
  const trimmed = data.trim();
  
  // Skip instruction messages
  if (trimmed.includes('Press') || trimmed.includes('start')) {
    return;
  }
  
  const value = parseFloat(trimmed);
  
  if (!isNaN(value) && value >= 0) {
    currentHeight = value;
    lastUpdate = new Date();
    console.log(`Height: ${currentHeight.toFixed(2)} cm`);
  }
});

// Handle serial errors
port.on('error', (err) => {
  console.error('Serial port error:', err.message);
  isConnected = false;
});

// HTTP endpoint to get height
app.get('/height', (req, res) => {
  res.json({
    height: currentHeight,
    unit: 'cm',
    timestamp: lastUpdate ? lastUpdate.getTime() : null,
    status: isConnected ? 'connected' : 'disconnected',
    lastUpdate: lastUpdate ? lastUpdate.toISOString() : null
  });
});

// HTTP endpoint to trigger measurement
app.get('/measure', (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: 'Arduino not connected' });
  }
  
  port.write('a', (req, res) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to trigger measurement' });
    }
    res.json({ 
      status: 'measurement started', 
      duration: '5 seconds',
      message: 'Arduino will measure for 5 seconds'
    });
  });
});

// Health check endpoint
app.get('/status', (req, res) => {
  res.json({
    service: 'Height Sensor Bridge',
    port: COM_PORT,
    connected: isConnected,
    currentHeight: currentHeight,
    lastUpdate: lastUpdate ? lastUpdate.toISOString() : null
  });
});

// Start HTTP server (listen on all network interfaces)
app.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('Height Sensor Bridge Started');
  console.log('=================================');
  console.log(`HTTP Server: http://localhost:${HTTP_PORT}`);
  console.log(`Height endpoint: http://localhost:${HTTP_PORT}/height`);
  console.log(`Trigger measurement: http://localhost:${HTTP_PORT}/measure`);
  console.log(`Status check: http://localhost:${HTTP_PORT}/status`);
  console.log(`Arduino Port: ${COM_PORT}`);
  console.log('Network: Accessible from other devices on your network');
  console.log('=================================');
});
