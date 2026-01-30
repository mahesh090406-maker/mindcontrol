/*
 * MindConnect ESP32 GSR Sensor Firmware
 * 
 * Hardware:
 * - ESP32 Development Board
 * - GSR Sensor (e.g., Grove or similar) connected to Analog Pin
 * 
 * Connection:
 * - VCC -> 3.3V or 5V (Check your sensor specs)
 * - GND -> GND
 * - SIG -> GPIO 34 (Analog ADC1_CH6)
 * 
 * Logic:
 * Reads analog value, maps it to a simulated microsiemens (0-40) range,
 * and prints it to Serial for the Web App to read.
 */

const int GSR_PIN = 34; // Analog pin for GSR Sensor
int sensorValue = 0;

void setup() {
  Serial.begin(9600); // Must match the Baud Rate in the Web App
  delay(1000);
  Serial.println("MindConnect Sensor Ready");
}

void loop() {
  long sum = 0;
  
  // Take 10 samples for stability
  for(int i=0; i<10; i++) {
    sensorValue = analogRead(GSR_PIN); // 0-4095 (12-bit Resolution)
    sum += sensorValue;
    delay(5);
  }
  
  float average = sum / 10.0;
  
  // Convert 12-bit ADC (0-4095) to estimated uS/Conductance range (0-40)
  // Note: This is an approximation. Real calibration requires knowing the resistor network.
  // We assume higher reading = lower resistance = higher stress (typically).
  // But many GSR sensors are calculating Resistance. 
  // Let's invert relative to max if needed, but often raw signal correlates with conductivity in simple sensors.
  // For the app demo, we map 0-4095 to 0-50.
  
  float gsrData = map(average, 0, 4095, 0, 50); 
  
  // Send to Serial (Plotter/Web App)
  // Format: Just the number
  Serial.println(gsrData);
  
  delay(100); // 10Hz update rate
}
