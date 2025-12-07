// Pin assignments
const int trigPin = 9;
const int echoPin = 10;

// Variables to store sensor data
long duration;
float distance;  // distance in cm
const float baseHeight = 167.0;  // Base height in cm (sensor's distance from the ground)

void setup() {
  // Set pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Start serial communication
  Serial.begin(9600);
  
  delay(2000);  // Give time for serial to initialize
}

void loop() {
  // Clear the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  
  // Trigger the sensor by setting the trigPin HIGH for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Read the echoPin and calculate the duration
  duration = pulseIn(echoPin, HIGH);
  
  // Calculate the distance (speed of sound = 34300 cm/s)
  distance = duration * 0.034 / 2;  // distance in cm
  
  // Calculate the height as the difference from base height
  float height = baseHeight - distance;
  
  // If no object is detected (distance >= baseHeight), set height to 0
  if (distance >= baseHeight || distance <= 0) {
    height = 0;
  }
  
  // Print only the numerical height value in cm
  Serial.println(height, 2);  // Print with 2 decimal places
  
  // Wait before the next measurement
  delay(500);
}
