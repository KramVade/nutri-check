/*
 * Arduino Weight Sensor for Nutri-Check
 * 
 * This sketch reads weight data from a load cell sensor (HX711)
 * and sends it to the web app via HTTP server
 * 
 * Hardware Required:
 * - Arduino (Uno, Mega, or ESP8266/ESP32 for WiFi)
 * - HX711 Load Cell Amplifier
 * - Load Cell (weight sensor)
 * - Ethernet Shield or WiFi module
 * 
 * Libraries Required:
 * - HX711 library by Bogdan Necula
 * - ESP8266WiFi or WiFi library (for WiFi boards)
 * - ESP8266WebServer or WebServer library
 */

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <HX711.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// HX711 pins
const int LOADCELL_DOUT_PIN = D2;  // Data pin
const int LOADCELL_SCK_PIN = D3;   // Clock pin

// Calibration factor (adjust based on your load cell)
const float CALIBRATION_FACTOR = -7050.0;

HX711 scale;
ESP8266WebServer server(8080);  // HTTP server on port 8080

float currentWeight = 0.0;

void setup() {
  Serial.begin(115200);
  Serial.println("Weight Sensor Starting...");
  
  // Initialize load cell
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(CALIBRATION_FACTOR);
  scale.tare();  // Reset scale to 0
  
  Serial.println("Load cell initialized");
  
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
  Serial.print("Access weight sensor at: http://");
  Serial.print(WiFi.localIP());
  Serial.println(":8080/weight");
  
  // Setup HTTP routes
  server.on("/weight", HTTP_GET, handleWeightRequest);
  server.on("/tare", HTTP_GET, handleTare);
  server.on("/calibrate", HTTP_GET, handleCalibrate);
  
  // Enable CORS
  server.enableCORS(true);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  
  // Read weight continuously
  if (scale.is_ready()) {
    currentWeight = scale.get_units(10);  // Average of 10 readings
    
    // Ensure weight is not negative
    if (currentWeight < 0) {
      currentWeight = 0;
    }
    
    // Print to serial for debugging
    Serial.print("Weight: ");
    Serial.print(currentWeight, 2);
    Serial.println(" kg");
  }
  
  delay(500);  // Update every 500ms
}

// Handle weight request
void handleWeightRequest() {
  // Add CORS headers
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Send JSON response
  String json = "{";
  json += "\"weight\":" + String(currentWeight, 2) + ",";
  json += "\"unit\":\"kg\",";
  json += "\"timestamp\":" + String(millis());
  json += "}";
  
  server.send(200, "application/json", json);
  
  Serial.println("Weight data sent: " + String(currentWeight, 2) + " kg");
}

// Handle tare (reset to zero)
void handleTare() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  scale.tare();
  currentWeight = 0;
  
  String json = "{\"status\":\"success\",\"message\":\"Scale tared\"}";
  server.send(200, "application/json", json);
  
  Serial.println("Scale tared");
}

// Handle calibration
void handleCalibrate() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  // Get known weight from query parameter
  if (server.hasArg("weight")) {
    float knownWeight = server.arg("weight").toFloat();
    
    scale.tare();
    delay(1000);
    
    float reading = scale.get_units(10);
    float newCalibration = reading / knownWeight;
    scale.set_scale(newCalibration);
    
    String json = "{\"status\":\"success\",\"calibration\":" + String(newCalibration) + "}";
    server.send(200, "application/json", json);
    
    Serial.println("Calibrated with known weight: " + String(knownWeight) + " kg");
  } else {
    String json = "{\"status\":\"error\",\"message\":\"Missing weight parameter\"}";
    server.send(400, "application/json", json);
  }
}
