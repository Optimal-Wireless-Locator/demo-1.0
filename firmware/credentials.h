#ifndef CREDENTIALS_H_
#define CREDENTIALS_H_

// Wi-Fi SSID and password
const char* ssid = "wifi";
const char* password = "password";

// NTP configuration
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = -3 * 3600;  // Brasília time zone
const int daylightOffset_sec = 0;

// HTTP server connection
const char* httpServer = "http://ip/readings"; // Replace with your server IP

#endif
