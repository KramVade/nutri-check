# Sensor Integration Guide

## Quick Start

Your BMI Calculator already has sensor support built-in! Follow these steps to integrate your Arduino sensors.

## What You Have

- ✅ `weight.txt` - Arduino code for weight sensor (ultrasonic)
- ✅ `height.txt` - Arduino code for height sensor (ultrasonic)
- ✅ BMI Calculator with sensor mode toggle
- ✅ Serial bridge applications ready

## Step-by-Step Integration

### 1. Find Your Arduino COM Ports

**Windows:**
1. Open Device Manager (Win + X → Device Manager)
2. Expand "Ports (COM & LPT)"
3. Look for "Arduino Uno" or "USB Serial Device"
4. Note the COM port numbers (e.g., COM3, COM4)

**Mac/Linux:**
```bash
ls /dev/tty.*
# Look for /dev/ttyUSB0 or /dev/ttyACM0
```

### 2. Upload Arduino Code

**Weight Sensor:**
1. Open Arduino IDE
2. Copy code from `weight.txt`
3. Connect weight sensor Arduino via USB
4. Select correct Board and Port
5. Click Upload
6. Open Serial Monitor (9600 baud) to test
7. Type 'a' to start measurement

**Height Sensor:**
1. Copy code from `height.txt`
2. Connect height sensor Arduino via USB
3. Upload to the second Arduino
4. Test in Serial Monitor

### 3. Configure Bridge Applications

**Edit `arduino-weight-bridge.js`:**
```javascript
const COM_PORT = 'COM3';  // Change to your weight Arduino port
```

**Edit `arduino-height-bridge.js`:**
```javascript
const COM_PORT = 'COM4';  // Change to your height Arduino port
```

### 4. Install Dependencies (if not already installed)

```bash
npm install express serialport @serialport/parser-readline cors
```

### 5. Start the Bridge Applications

**Terminal 1 - Weight Sensor:**
```bash
node arduino-weight-bridge.js
```

You should see:
```
=================================
Weight Sensor Bridge Started
=================================
HTTP Server: http://localhost:8080
Weight endpoint: http://localhost:8080/weight
Arduino Port: COM3
=================================
✓ Serial port opened successfully
```

**Terminal 2 - Height Sensor:**
```bash
node arduino-height-bridge.js
```

You should see:
```
=================================
Height Sensor Bridge Started
=================================
HTTP Server: http://localhost:8081
Height endpoint: http://localhost:8081/height
Arduino Port: COM4
=================================
✓ Serial port opened successfully
```

### 6. Test the Endpoints

Open your browser and test:

**Weight Sensor:**
- http://localhost:8080/weight
- http://localhost:8080/status
- http://localhost:8080/measure (triggers measurement)

**Height Sensor:**
- http://localhost:8081/height
- http://localhost:8081/status
- http://localhost:8081/measure (triggers measurement)

You should see JSON responses like:
```json
{
  "weight": 65.5,
  "unit": "kg",
  "timestamp": 1701234567890,
  "status": "connected",
  "lastUpdate": "2024-12-07T10:30:00.000Z"
}
```

### 7. Use in BMI Calculator

1. Start your Vue app: `npm run dev`
2. Navigate to BMI Calculator
3. Select a patient
4. Click "Switch to Sensors" button
5. The sensor URLs are pre-configured:
   - Weight: `http://localhost:8080/weight`
   - Height: `http://localhost:8081/height`
6. Click "Read Sensors Now" to fetch data
7. The system will auto-poll every 2 seconds
8. Calculate BMI as normal

## Troubleshooting

### "Port not found" Error
- Check COM port in Device Manager
- Make sure Arduino is connected
- Update COM_PORT in bridge files

### "Permission denied" Error
- **Windows:** Run terminal as Administrator
- **Linux:** Add user to dialout group: `sudo usermod -a -G dialout $USER`
- **Mac:** Check port permissions

### No Data Received
- Check baud rate is 9600 in both Arduino code and bridge
- Open Arduino Serial Monitor to verify sensor is working
- Type 'a' to trigger measurement
- Check for error messages in bridge console

### CORS Errors
- Make sure both bridge applications are running
- Check that CORS is enabled (already configured)
- Verify URLs in BMI Calculator match bridge ports

### Sensor Shows "Disconnected"
- Check that bridge application is running
- Verify Arduino is connected and code is uploaded
- Check Serial Monitor for Arduino errors
- Restart bridge application

### Wrong Readings
- **Weight sensor:** Adjust `baseHeight` in weight.txt (currently 167.0 cm)
- **Height sensor:** Adjust `baseHeight` in height.txt (currently 165.0 cm)
- Measure actual distance from sensor to ground
- Update and re-upload Arduino code

## Architecture

```
┌─────────────┐         USB          ┌──────────────────┐
│   Weight    │ ──────────────────> │  Weight Bridge   │
│   Arduino   │    Serial (9600)     │  (Port 8080)     │
└─────────────┘                      └──────────────────┘
                                              │
                                              │ HTTP
                                              ▼
┌─────────────┐         USB          ┌──────────────────┐         ┌─────────────┐
│   Height    │ ──────────────────> │  Height Bridge   │ <────> │   Vue App   │
│   Arduino   │    Serial (9600)     │  (Port 8081)     │  HTTP   │ BMI Calc    │
└─────────────┘                      └──────────────────┘         └─────────────┘
```

## Tips

1. **Keep bridges running:** Don't close the terminal windows while using sensors
2. **Test individually:** Test each sensor separately before using both
3. **Monitor console:** Watch bridge console for real-time sensor readings
4. **Calibration:** Adjust baseHeight values for accurate measurements
5. **Backup plan:** You can always switch back to manual mode

## Next Steps

Once sensors are working:
1. Test with real measurements
2. Calibrate baseHeight values if needed
3. Save BMI data to Firebase
4. View patient history with sensor data

## Need Help?

Check these files for more info:
- `ARDUINO_SETUP_GUIDE.md` - Arduino hardware setup
- `ARDUINO_SERIAL_BRIDGE_GUIDE.md` - Bridge concepts
- `PATIENT_SYSTEM_SETUP.md` - Patient system overview
