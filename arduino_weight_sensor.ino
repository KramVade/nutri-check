#include <HX711.h>

// Define pins for HX711
const int HX711_dout = 6; // DOUT pin connected to GPIO6
const int HX711_sck = 5;  // SCK pin connected to GPIO5

HX711 scale; // Create an instance of the HX711 class

float scaleFactor = 0.00004878;  // Scale factor (adjust based on calibration)
long zeroOffset = 0;             // Zero offset (updated during tare)

void setup() {
  Serial.begin(9600); // Initialize Serial Monitor at 9600 baud
  
  // Initialize the HX711
  scale.begin(HX711_dout, HX711_sck);
  
  if (!scale.is_ready()) {
    while (true); // Stop execution if HX711 is not ready
  }
  
  // Tare the scale to set the base weight to 0
  scale.tare(); // Resets the scale to 0
  delay(1000);  // Allow time for the tare to settle
  
  // Get the current reading with no weight (zero point)
  zeroOffset = scale.get_units(10);  // Average 10 readings
  
  delay(2000);  // Give time for serial to initialize
}

void loop() {
  if (scale.is_ready()) {
    long rawData = scale.get_units(10);  // Average 10 readings
    float weightInKg = (rawData - zeroOffset) * scaleFactor;  // Convert to kg
    
    // Ensure non-negative weight
    if (weightInKg < 0) {
      weightInKg = 0;
    }
    
    Serial.println(weightInKg, 2);  // Print with 2 decimal places
  }
  
  delay(500); // Delay between readings
}
