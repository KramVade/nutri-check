# Arduino Sensor Setup Guide for Nutri-Check

This guide will help you set up the Arduino weight and height sensors for the BMI calculator.

## Hardware Requirements

### Weight Sensor Setup
- **Arduino Board**: ESP8266 (NodeMCU) or ESP32 (recommended for WiFi)
- **Load Cell**: 50kg or 100kg capacity
- **HX711 Amplifier**: Load cell signal amplifier
- **Power Supply**: 5V USB or external power

### Height Sensor Setup
- **Arduino Board**: ESP8266 (NodeMCU) or ESP32
- **HC-SR04**: Ultrasonic distance sensor
- **Mounting**: Fixed position at known height (e.g., 250cm from ground)
- **Power Supply**: 5V USB or external power

## Software Requirements

### Arduino IDE Setup
1. Install Arduino IDE from https://www.arduino.cc/en/software
2. Install ESP8266 board support:
   - Go to File → Preferences
   - Add to "Additional Board Manager URLs": 
     `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   - Go to Tools → Board → Boards Manager
   - Search for "ESP8266" and install

### Required Libraries
Install these libraries via Arduino IDE (Sketch → Include Library → Manage Libraries):
1. **HX711** by Bogdan Necula (for weight sensor)
2. **ESP8266WiFi** (included with ESP8266 board support)
3. **ESP8266WebServer** (included with ESP8266 board support)

## Wiring Diagrams

### Weight Sensor (HX711 + Load Cell)
```
Load Cell → HX711 → ESP8266
E+ (Red)   → E+
E- (Black) → E-
A+ (White) → A+
A- (Green) → A-

HX711 → ESP8266
VCC → 3.3V or 5V
GND → GND
DT  → D2 (GPIO4)
SCK → D3 (GPIO0)
```

### Height Sensor (HC-SR04)
```
HC-SR04 → ESP8266
VCC  → 5V
GND  → GND
TRIG → D5 (GPIO14)
ECHO → D6 (GPIO12)
```

## Configuration Steps

### 1. Configure WiFi
Edit both Arduino sketches and update:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### 2. Calibrate Weight Sensor
1. Upload `arduino_weight_sensor.ino` to first Arduino
2. Open Serial Monitor (115200 baud)
3. Note the IP address displayed
4. Place a known weight (e.g., 1kg) on the scale
5. Visit: `http://ARDUINO_IP:8080/calibrate?weight=1.0`
6. Remove weight and visit: `http://ARDUINO_IP:8080/tare`

### 3. Calibrate Height Sensor
1. Upload `arduino_height_sensor.ino` to second Arduino
2. Open Serial Monitor (115200 baud)
3. Note the IP address displayed
4. Measure the exact height of the sensor from the ground
5. Update `SENSOR_HEIGHT` constant in the sketch
6. Re-upload the sketch

### 4. Configure Web App
1. Open the BMI Calculator in your web app
2. Click "Switch to Sensors"
3. Enter the sensor URLs:
   - Weight: `http://WEIGHT_ARDUINO_IP:8080/weight`
   - Height: `http://HEIGHT_ARDUINO_IP:8081/height`
4. Click "Read Sensors Now" to test connection

## Testing

### Test Weight Sensor
```bash
curl http://ARDUINO_IP:8080/weight
```
Expected response:
```json
{
  "weight": 65.5,
  "unit": "kg",
  "timestamp": 12345
}
```

### Test Height Sensor
```bash
curl http://ARDUINO_IP:8081/height
```
Expected response:
```json
{
  "height": 170.5,
  "distance": 79.5,
  "unit": "cm",
  "timestamp": 12345
}
```

## Troubleshooting

### Weight Sensor Issues
- **Negative readings**: Adjust `CALIBRATION_FACTOR` or swap A+/A- wires
- **Unstable readings**: Ensure load cell is properly mounted and level
- **No readings**: Check HX711 wiring and power supply

### Height Sensor Issues
- **No readings**: Check HC-SR04 wiring, especially TRIG and ECHO pins
- **Inaccurate height**: Verify `SENSOR_HEIGHT` constant matches actual mounting height
- **Erratic readings**: Ensure sensor has clear line of sight, no obstacles

### Network Issues
- **Can't connect**: Verify WiFi credentials and network connectivity
- **CORS errors**: Ensure `server.enableCORS(true)` is in the code
- **Timeout**: Check firewall settings, Arduino and computer must be on same network

## API Endpoints

### Weight Sensor (Port 8080)
- `GET /weight` - Get current weight reading
- `GET /tare` - Reset scale to zero
- `GET /calibrate?weight=X` - Calibrate with known weight

### Height Sensor (Port 8081)
- `GET /height` - Get calculated height
- `GET /distance` - Get raw distance reading
- `GET /calibrate?height=X` - Set sensor mounting height

## Production Tips

1. **Power Supply**: Use stable 5V power supply, not just USB
2. **Enclosure**: Protect electronics from moisture and dust
3. **Cable Management**: Use shielded cables for load cell to reduce noise
4. **Mounting**: Securely mount sensors to prevent movement
5. **Static IP**: Configure Arduino with static IP for consistent connection
6. **Error Handling**: Monitor serial output for debugging

## Next Steps

Once sensors are working:
1. Test with multiple patients
2. Verify accuracy against manual measurements
3. Document any calibration adjustments needed
4. Train staff on proper sensor usage
5. Create backup/maintenance schedule

## Support

For issues or questions:
- Check Serial Monitor output for debugging
- Verify all connections and power supply
- Test sensors individually before integration
- Consult Arduino community forums for hardware-specific issues
