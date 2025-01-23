

document.getElementById("pushbuttonPower").onclick = function() {
    document.getElementById("mqttPopup").style.display = "block";
};

document.querySelector(".connect").onclick = function() {
    // Get form field values
    const name = document.getElementById("name").value;
    const host = document.getElementById("host").value;
    const port = document.getElementById("port").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if required fields are filled
    if (name && host && port) {
        // Optional: check if username and password are also filled if required
        document.getElementById("mqttPopup").style.display = "none";
        alert("Connection Successful...");
    } else {
        alert("Please fill in all required fields (Name, Host, and Port) to connect.");
    }
};

document.querySelector(".close").onclick = function() {
    document.getElementById("mqttPopup").style.display = "none";
};

window.onclick = function(event) {
    if (event.target === document.getElementById("mqttPopup")) {
        document.getElementById("mqttPopup").style.display = "none";
    }
};

