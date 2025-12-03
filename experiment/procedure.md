## Procedure

1. Open the experiment in the virtual lab for sending live sensor data using MQTT protocol with ESP8266/ESP32.  
   The ESP32 board and the DHT sensor are already connected in the workspace.

2. Observe the circuit connections.  
   Verify the wiring between the DHT sensor and the ESP32 data pin, including VCC and GND.  
   Ensure that Wi-Fi settings for the ESP32 are preconfigured for establishing MQTT communication.

3. Open and review the Arduino code.  
   Read the predefined code to understand:  
   - Wi-Fi connection setup  
   - MQTT broker configuration (server address, port, topic)  
   - DHT sensor initialization  
   - Publishing temperature and humidity data to a specific MQTT topic  
   - Automatic reconnection logic with the MQTT broker

4. Start the simulation.  
   Click the "Start Simulation" button.  
   The ESP32 will read data from the DHT sensor and publish the values (temperature and humidity) to the MQTT topic using the MQTT protocol.

5. Monitor the data on the MQTT dashboard.  
   Observe the live sensor values updating under the configured MQTT topic on the dashboard below the simulation.  
   Data will keep updating based on the interval specified in the code.

6. Record observations.  
   Note the published sensor readings on the MQTT dashboard and verify the correctness and frequency of updates.

7. Stop the simulation.  
   Click the "Stop Simulation" button after completing the experiment.
