# ESP32 Firmware Setup Guide

If you are having trouble installing the ESP32 board package automatically, follow these manual steps.

## Option 1: Arduino IDE (Recommended)

1.  **Open Preferences**:
    *   In Arduino IDE, go to **File** > **Preferences**.
2.  **Add Board Manager URL**:
    *   Look for the field "Additional Boards Manager URLs".
    *   Click the icon next to it and add this exact URL on a new line:
        ```
        https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
        ```
    *   Click **OK**.
3.  **Install Board Package**:
    *   Go to **Tools** > **Board** > **Boards Manager...**
    *   Search for **"esp32"**.
    *   Install **"esp32 by Espressif Systems"**.
    *   *Note: If it fails, try a different internet connection or VPN, as these servers can be slow.*

## Option 2: Flashing Code
1.  Select Board: **Tools** > **Board** > **ESP32 Dev Module**.
2.  Select Port: **Tools** > **Port** > (Connect your USB and select the COM port).
3.  Open File: Open `firmware/esp32_gsr/esp32_gsr.ino`.
4.  Upload: Click the **Right Arrow (→)** button.

## Troubleshooting
*   **"Deadline Exceeded"**: This is a network error.
    *   Try using a mobile hotspot temporarily to download the package.
    *   Or use the **Manual Sensor Slider** in the web app (Simulate Mode) until you can download it.
