# Arduino Serial Bridge Setup Guide

## Overview
Your Arduino code uses Serial communication (USB), not WiFi. To connect it to the web app, you need a "bridge" application that reads from the Arduino's serial port and exposes the data via HTTP.

## Two Approaches

### Approach 1: Serial Bridge (For Your Current Code)

#### What You Need:
- Arduino Uno/Mega with USB connection
- Node.js installed on your computer
- Your existing Arduino code

#### Setup Steps:

1. **Install Node.js dependencies:**
   ```bash
   npm install express serialport @serialport/parser-readline cors
   ```

2. **Find your Arduino's COM port:**
   - **Windows:** Open Device Manager → Ports (COM & LPT) → Look for "Arduino" (e.g., COM3)
   - **Mac/Linux:** Run `ls /dev/tty.*` in terminal (e.g., /dev/ttyUSB0)

3. **Update the bridge configuration:**
   - Open `arduino-serial-bridge.js`
   - Change `COM_PORT = 'COM3'` to your Arduino's port

4. **Upload Arduino code:**
   - Upload `arduino_height_sensor.ino` to your Arduino
   - Open Serial Monitor to verify it's working (press 'a' to test)

5. **Run the bridge:**
   ```bash
   node arduino-serial-bridge.js
   ```

6. **Test the endpoint:**
   - Open browser: `http://localhost:8081/height`
   - You should see JSON: `{"height": 0, "unit": "cm", ...}`
   - Trigger measurement: `http://localhost:8081/measure`

7. **Use in BMI Calculator:**
   - In the web app, set Height Sensor IP to: `localhost`
   - The app will fetch from `http://localhost:8081/height`

### Approach 2: WiFi-Based (Recommended for Production)

#### What You Need:
- ESP8266 or ESP32 board (NodeMCU, Wemos D1 Mini, etc.)
- HC-SR04 ultrasonic sensor
- WiFi network

#### Advantages:
- No USB cable needed
- No bridge application needed
- Direct wireless connection
- Can be placed anywhere with WiFi

#### Setup:
1. Use the WiFi-based code I created earlier (in `arduino_height_sensor.ino` - WiFi version)
2. Update WiFi credentials in the code
3. Upload to ESP8266/ESP32
4. Get the IP address from Serial Monitor
5. Use that IP directly in the BMI Calculator

## Comparison

| Feature | Serial Bridge | WiFi Direct |
|---------|--------------|-------------|
| Hardware | Arduino Uno/Mega | ESP8266/ESP32 |
| Connection | USB cable | Wireless |
| Setup | Need bridge app | Direct |
| Portability | Limited | High |
| Cost | Lower | Slightly higher |

## Troubleshooting

### Serial Bridge Issues:
- **"Port not found"**: Check COM port in Device Manager
- **"Permission denied"**: Run as administrator (Windows) or use `sudo` (Linux)
- **No data received**: Check baud rate matches (9600)
- **CORS errors**: Make sure bridge is running and CORS is enabled

### WiFi Issues:
- **Can't connect**: Check WiFi credentials
- **IP not showing**: Open Serial Monitor at 115200 baud
- **Timeout errors**: Ensure Arduino and computer are on same network

## Which Should You Use?

**Use Serial Bridge if:**
- You already have Arduino Uno/Mega
- Arduino will be near the computer
- You're testing/prototyping

**Use WiFi Direct if:**
- You want wireless operation
- You're deploying in production
- You have ESP8266/ESP32 available

## Next Steps

1. Choose your approach
2. Follow the setup steps above
3. Test the endpoint in browser
4. Use in the BMI Calculator web app
