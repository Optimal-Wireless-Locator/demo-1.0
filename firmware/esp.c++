#include <WiFi.h>
#include <HTTPClient.h>
#include <BLEDevice.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <Arduino.h>
#include "credentials.h"
#include "time.h"

// BLE variables
BLEScan* pBLEScan;
int scanTime = 5;          // Scanning time in seconds
String espId = "ESP32_3";  // Change to the ID of each ESP
String placeId = "5f041c3d-0316-4204-b1a5-299199bee394";   // Change to the ID of each Place

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Initialize NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Synchronizing time...");
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.println("Waiting for NTP time...");
    delay(1000);
  }
  Serial.println("Time synchronized.");

  // Initialize BLE
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();  // Create BLE scan object
}

void loop() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Error getting time.");
    return;
  }

  int seconds = timeinfo.tm_sec;

  // Check if current second is a multiple of 3
  if (seconds % 3 == 0) {
    Serial.print("⏱️ Scanning at second: ");
    Serial.println(seconds);

    BLEScanResults foundDevices = *pBLEScan->start(scanTime, false);
    int deviceCount = foundDevices.getCount();
    Serial.print("Devices found: ");
    Serial.println(deviceCount);

    char timestamp[20];  // YYYY-MM-DDTHH:MM:SS
    strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%S", &timeinfo);

    for (int i = 0; i < deviceCount; i++) {
      BLEAdvertisedDevice device = foundDevices.getDevice(i);
      String macAddress = device.getAddress().toString().c_str();
      int rssi = device.getRSSI();

      // Format JSON with timestamp
      String jsonPayload = "{\"m\":\"" + macAddress + "\",\"r\":\"" + String(rssi) + "\",\"espID\":\"" + espId + "\",\"placeID\":\"" + placeId + "\",\"t\":\"" + String(timestamp) + "\"}";

      // Send data to HTTP server
      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(httpServer);
        http.addHeader("Content-Type", "application/json");

        int httpResponseCode = http.POST(jsonPayload);

        if (httpResponseCode > 0) {
          Serial.print("Server response: ");
          Serial.println(httpResponseCode);
          String response = http.getString();
          Serial.println("Response: " + response);
        } else {
          Serial.print("Connection error: ");
          Serial.println(httpResponseCode);
        }
        http.end();
      }
    }

    pBLEScan->clearResults();  // Clear results after scanning
    delay(1000);               // Wait 1s to avoid scanning twice in the same second
  }

  delay(100);  // Small delay to avoid overloading the loop
}
