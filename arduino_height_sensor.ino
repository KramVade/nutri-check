/*
 * Arduino Height Sensor for Nutri-Check
 * 
 * This sketch reads height data from an ultrasonic sensor (HC-SR04)
 * and sends it to the web app via HTTP server
 * 
 * Hardware Required:
 * - Arduino (Uno, Mega, or ESP8266/ESP32 for WiFi)
 * - HC-SR04 Ultrasonic Sensor
 * - Ethernet Shield or WiFi module
 * 
 * Libraries Required:
 * - ESP8266WiFi or WiFi library (for WiFi boards)
 * - ESP8266WebServer or WebServer library
 * 
 * Setup:
 * - Mount the sensor at a fixed height (e.g., 250cm from ground)
 * - Sensor measures distance to person's head
 * - Height = SENSOR_HEIGHT - measured_distance
 */

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Ultrasonic sensor pins
const int TRIG_PIN = D5;
const int ECHO_PIN = D6;

// Sensor mounting height from ground (in cm)
const float SENSOR_HEIGHT = 250.0;  // Adjust based on your setup

ESP8266WebServer server(8081);  // HTTP server on port 8081

float currentHeight = 0.0;
float currentDistance = 0.0;

void setup() {
  Serial.begin(115200);
  Serial.println("Height Sensor Starting...");
  
  // Initialize ultrasonic sensor pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  Serial.println("Ultrasonic sensor initialized");
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Access height sensor at: http://");
  Serial.print(WiFi.localIP());
  Serial.println(":8081/height");
  
  // Setup HTTP routes
  server.on("/height", HTTP_GET, handleHeightRequest);
  server.on("/distance", HTTP_GET, handleDistanceRequest);
  server.on("/calibrate", HTTP_GET, handleCalibrate);
  
  // Enable CORS
  server.enableCORS(true);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  
  // Read distance continuously
  currentDistance = measureDistance();
  
  // Calculate height (sensor height - distance to head)
  currentHeight = SENSOR_HEIGHT - currentDistance;
  
  // Ensure height is within reasonable range (50cm to 250cm)
  if (currentHeight < 50 || currentHeight > 250) {
    currentHeight = 0;  // Invalid reading
  }
  
  // Print to serial for debugging
  Serial.print("Distance: ");
  Serial.print(currentDistance, 1);
  Serial.print(" cm | Height: ");
  Serial.print(currentHeight, 1);
  Serial.println(" cm");
  
  delay(500);  // Update every 500ms
}

// Measure distance using ultrasonic sensor
float measureDistance() {
  // Clear the trigger pin
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // Send 10 microsecond pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Read the echo pin
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // Timeout after 30ms
  
  // Calculate distance in cm (speed of sound = 343 m/s)
  float distance = duration * 0.0343 / 2;
  
  // Return 0 if no valid reading
  if (distance == 0 || distance > 400) {
    return 0;
  }
  
  return distance;
}

// Handle height request
void handleHeightRequest() {
  // Add CORS headers
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Send JSON response
  String json = "{";
  json += "\"height\":" + String(currentHeight, 1) + ",";
  json += "\"distance\":" + String(currentDistance, 1) + ",";
  json += "\"unit\":\"cm\",";
  json += "\"timestamp\":" + String(millis());
  json += "}";
  
  server.send(200, "application/json", json);
  
  Serial.println("Height data sent: " + String(currentHeight, 1) + " cm");
}

// Handle distance request (raw sensor reading)
void handleDistanceRequest() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  String json = "{";
  json += "\"distance\":" + String(currentDistance, 1) + ",";
  json += "\"unit\":\"cm\"";
  json += "}";
  
  server.send(200, "application/json", json);
}

// Handle calibration (set sensor height)
void handleCalibrate() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  // Get sensor height from query parameter
  if (server.hasArg("height")) {
    float newHeight = server.arg("height").toFloat();
    
    // Update sensor height constant (note: this won't persist after restart)
    // For permanent storage, use EEPROM
    
    String json = "{\"status\":\"success\",\"sensor_height\":" + String(newHeight) + "}";
    server.send(200, "application/json", json);
    
    Serial.println("Sensor height calibrated to: " + String(newHeight) + " cm");
  } else {
    String json = "{\"status\":\"error\",\"message\":\"Missing height parameter\"}";
    server.send(400, "application/json", json);
  }
}
