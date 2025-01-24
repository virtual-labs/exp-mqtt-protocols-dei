

// document.getElementById("pushbuttonPower").onclick = function() {

//     document.getElementById("mqttPopup").style.display = "block";
// };

// document.querySelector(".connect").onclick = function() {
//     // Get form field values
//     const name = document.getElementById("name").value;
//     const host = document.getElementById("host").value;
//     const port = document.getElementById("port").value;
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     // Check if required fields are filled
//     if (name && host && port) {
//         // Optional: check if username and password are also filled if required
//         document.getElementById("mqttPopup").style.display = "none";
//         alert("Connection Successful...");
//     } else {
//         alert("Please fill in all required fields (Name, Host, and Port) to connect.");
//     }
// };

// document.querySelector(".close").onclick = function() {
//     document.getElementById("mqttPopup").style.display = "none";
// };

// window.onclick = function(event) {
//     if (event.target === document.getElementById("mqttPopup")) {
//         document.getElementById("mqttPopup").style.display = "none";
//     }
// };




// Track simulation state
let isSimulationRunning = false;

document.getElementById("pushbuttonPower").onclick = function () {
    const button = document.getElementById("pushbuttonPower");

    if (isSimulationRunning) {
        // If simulation is running, stop it
        button.textContent = "Start Simulation";
        isSimulationRunning = false;
        

        // Reset values to 0
        document.getElementById("temperaturenew").textContent = "Temperature: 0";
        document.getElementById("humiditynew").textContent = "Humidity: 0";
        
    } else {
        // If simulation is not running, start it
        button.textContent = "Stop Simulation";
        isSimulationRunning = true;

        // Show MQTT popup only when starting simulation
        document.getElementById("mqttPopup").style.display = "block";

        // Set values to new readings
        document.getElementById("temperaturenew").textContent = "Temperature: 24";
        document.getElementById("humiditynew").textContent = "Humidity: 40";
    }
};

document.querySelector(".connect").onclick = function () {
    // Get form field values
    const name = document.getElementById("name").value;
    const host = document.getElementById("host").value;
    const port = document.getElementById("port").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if required fields are filled
    if (name && host && port) {
        document.getElementById("mqttPopup").style.display = "none";
        alert("Connection Successful...");
    } else {
        alert("Please fill in all required fields (Name, Host, and Port) to connect.");
    }
};

document.querySelector(".close").onclick = function () {
    document.getElementById("mqttPopup").style.display = "none";
};

window.onclick = function (event) {
    if (event.target === document.getElementById("mqttPopup")) {
        document.getElementById("mqttPopup").style.display = "none";
    }
};
