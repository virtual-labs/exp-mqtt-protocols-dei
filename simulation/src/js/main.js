
// let image_tracker = "dis";


// function changePower() {
//   let image = document.getElementById("ifimg");
//   if (image_tracker == "dis") {
//     image.src = "./src/images/dht_on.gif";
//     document.getElementById("pushbuttonPower").innerHTML = "Stop Simulation";
//     document.getElementById("pushbuttonPower").style.backgroundColor = "red";
//     image_tracker = "off";
//   } else if (image_tracker == "off") {
//     image.src = "./src/images/dht_off.gif";
//     document.getElementById("pushbuttonPower").innerHTML = "Start Simulation";
//     document.getElementById("pushbuttonPower").style.backgroundColor ="#009C4E";
//     image_tracker = "dis";
//   } 
// } 

// function changeImage() {
//   let image = document.getElementById("ifimg");
  
//   if (image_tracker == "off") {
//     image.src = "./src/images/led/led_on.png";
//     image_tracker = "red";
//   } else if (image_tracker == "red" || image_tracker == "green") {
//     image.src = "./src/images/led/led_off.png";
//     image_tracker = "off";
//   }
// }

// let updating = false;

// document.getElementById('pushbuttonPower').addEventListener('click', function() {
//     // Replace these values with your ThingSpeak channel details
//     const channelID = '2454420';
//     const apiKey = 'VG65ZM5BGRZL0FGU';

//     // Function to update values on ThingSpeak
//     function updateThingSpeakField(field, value) {
//         const apiUrl = `https://api.thingspeak.com/update?api_key=${apiKey}&field${field}=${value}`;

//         fetch(apiUrl, { method: 'POST' })
//             .then(response => response.json())
//             .then(data => {
//                 if (data) {
//                     console.log(`Successfully updated field ${field} with value ${value}`);
//                 } else {
//                     console.error(`Failed to update field ${field}`);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error updating ThingSpeak:', error);
//             });
//     }

//     // Function to update ThingSpeak values at regular intervals
//     function startUpdating() {
//         // Set the interval (in milliseconds) for updates
//         const updateInterval = 100; // Update every 1 minute

//         // Initial update
//         updateThingSpeakField(1, 24); // Example: Update field 1 with a random value
//         updateThingSpeakField(2, 40); // Example: Update field 1 with a random value
//         // Set interval for continuous updates
//         return setInterval(() => {
//             updateThingSpeakField(1, 24); // Example: Update field 1 with a random value
//             updateThingSpeakField(2, 40);
//         }, updateInterval);
//     }

//     // Toggle between starting and stopping updates
//     if (!updating) {
//         // Start updating
//         updating = true;
        
//         intervalId = startUpdating();
//     } else {
//         // Stop updating
//         updating = false;
        
//         clearInterval(intervalId);
//     }
// });

// //function changeLedColor() {
//  // let image = document.getElementById("ifimg");
//   //if (image_tracker == "red") {
//     //image.src = "./src/images/led/led_green.png";
//     //image_tracker = "green";
//   //} else if (image_tracker == "green") {
//     //image.src = "./src/images/led/led_on.png";
//    // image_tracker = "red";
//   //}
// //}

// // if (image_tracker == "dis") {
// //   document.getElementById("pushbuttonPower").addEventListener("click", () => {
// //     if (int !== null) {
// //       clearInterval(int);
// //     }
// //     int = setInterval(displayTimer, 10);
// //   });
// // }

// // document.getElementById("pushbuttonPower").addEventListener("click", () => {
// //   clearInterval(int);
// //   [milliseconds, seconds, minutes, hours] = [0, 0, 0, 0];
// //   document.getElementById("simTimer").innerHTML = "00 : 00 : 00 : 000 ";
// // });

// function openNav() {
//   document.getElementById("mySidepanel").style.width = "809px";
// }

// /* Set the width of the sidebar to 0 (hide it) */
// function closeNav() {
//   document.getElementById("mySidepanel").style.width = "0";
// }



// $(document).ready(function(){
//   $("#pushbuttonPower").click(function(){
//     $("#pushbuttonPower").css("background-color", "red")
//     $("#pushbuttonPower").css("color", "white")
//     $("#ifimg2").show();
//     $("#ifimg").hide();
//   });
// });

// $("#pushbuttonPower").click(function(){
//   $("#pushbuttonPower").css("background-color", "green")
//   $("#pushbuttonPower").css("color", "white")
//   $("#ifimg").show();
//   $("#ifimg2").hide();
// });

$(document).ready(function() {
  // Initial state
  let isOn = false;

  $("#pushbuttonPower").click(function() {
    if (isOn) {
      // Change to 'off' state
      $("#pushbuttonPower").css({
        "background-color": "#009C4E",
        "color": "white"
      });
      $("#ifimg").show();
      $("#ifimg2").hide();
    } else {
      // Change to 'on' state
      $("#pushbuttonPower").css({
        "background-color": "red",
        "color": "white"
      });
      $("#ifimg2").show();
      $("#ifimg").hide();
    }
    // Toggle the state
    isOn = !isOn;
  });
});
