<div align="center">
  <h1>OWL - Demo 1.0</h1>
  <p>
    <strong>Repository for the first demonstration (v1.0) of the Indoor Positioning System (IPS).</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Version-Demo%201.0-purple" alt="Status: Demo Version">
    <img src="https://img.shields.io/badge/Tech-ESP32%20%7C%20BLE%20%7C%20Node.js%20%7C%20React.js-green" alt="Technologies">
    <img src="https://img.shields.io/badge/Database-PostgreSQL-blueviolet" alt="Database">
  </p>
</div>

---

<div>

## 1. About This Repository

This repository (`demo-1.0`) stores the first functional and consolidated version of the **Optimal Wireless Locator (OWL)** project, representing the culmination of the first year of development.

The goal of the OWL project is to create an affordable and efficient **indoor tracking system (IPS)**, born from the need to increase asset security in the Maker Space at ETEC Bento Quirino.

While the main organization <a href="https://github.com/Optimal-Wireless-Locator/Optimal-Wireless-Locator">Optimal-Wireless-Locator</a> describes the project at a high level, **this repository contains the functional source code for v1.0**, ready for demonstration and analysis.

## 2. Repository Structure

The source code for Demo 1.0 is organized as follows:

* **`apps/api`**: Contains the central **Node.js** (Express) server API, responsible for receiving sensor data, performing trilateration, and communicating with the database.
* **`apps/web`**: Contains the **React.js** web application that renders the SVG map and displays asset positions in real time.
* **`/firmware`**: Contains the **C++** (PlatformIO/ArduinoIDE) code embedded in the ESP32 modules, responsible for scanning **BLE (RSSI)** signals and sending the data to the backend.

## 3. System Architecture (v1.0)

The components of this repository interact as follows:

* **Data Collection (Hardware):** **ESP32** modules (running code from `/firmware`) are installed at fixed points and scan the environment for **Bluetooth Low Energy (BLE)** tags.
* **Signal Processing:** Each ESP32 measures the **RSSI (Received Signal Strength Indicator)** of the tags.
* **Backend (Server):** The API (code in `apps/api`) receives the RSSI data, converts it into distance (using a propagation model), and applies the **Trilateration** algorithm (with **Levenberg-Marquardt optimization**) to calculate the (x, y) coordinates of the asset.
* **Database:** The API stores location data in a **PostgreSQL** database.
* **Frontend (Client):** The web interface (code in `apps/web`) consumes the backend API and updates the asset’s position on the SVG map in real time.

</div>
