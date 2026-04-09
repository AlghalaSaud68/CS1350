function login() {
    let user = document.getElementById("username").value;

    if (user === "admin") {
        localStorage.setItem("role", "admin");
        window.location.href = "DashBoard.html";
    } 
    else if (user === "staff") {
        localStorage.setItem("role", "staff");
        window.location.href = "DashBoard.html";
    } 
    else {
        alert("Enter 'admin' or 'staff'");
    }
}

// Show sections
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}

// Role restriction
//window.onload = function () {
    //let role = localStorage.getItem("role");

   // if (role === "staff") {
       // document.getElementById("capacityBtn").style.display = "none";
  //  }
//};

// Elaf Salah Al-Nasser
window.onload = function () {
    let role = localStorage.getItem("role");
    if (role === "staff") {
        document.getElementById("capacityBtn").style.display = "none";
        document.getElementById("reallocationBtn").style.display = "none";
        document.getElementById("reportsBtn").style.display = "none";    }
};
window.onload = function () {
    let role = localStorage.getItem("role");
    if (role === "admin") {
           }
};


// Features
function addSchedule() {
    let train = document.getElementById("train").value;
    document.getElementById("output").innerText = "Schedule added for: " + train;
}

function addRoute() {
    let route = document.getElementById("routeInput").value;
    let time = document.getElementById("timeInput").value;

    document.getElementById("output").innerText =
        "Route: " + route + " at " + time;
}

let capacities = JSON.parse(localStorage.getItem("capacities")) || {};

function setCapacity() {
    let train = document.getElementById("trainNameCap").value;
    let cap = document.getElementById("cap").value;

    // Validation
    if (train === "") {
        document.getElementById("output").innerText = "Enter train name!";
        return;
    }
    if (cap === "" || cap <= 0) {
        document.getElementById("output").innerText = "Invalid capacity!";
        return;
    }
    if (!Number.isInteger(Number(cap))) {
        document.getElementById("output").innerText = "Capacity must be integer!";
        return;
    }

    capacities[train] = Number(cap);
    localStorage.setItem("capacities", JSON.stringify(capacities));

    document.getElementById("output").innerText =
        "Capacity for " + train + " set to " + cap;
}


function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}

function confirmBooking() {
    let name = document.getElementById("userName").value.trim();
    let train = document.getElementById("trainName").value.trim();
    let tickets = parseInt(document.getElementById("ticketCount").value);

    // Validation
    let error = validateNotEmpty(name, "Name") ||
                validateNotEmpty(train, "Train") ||
                validatePositiveInteger(tickets, "Number of Tickets");
    if (error) { 
        document.getElementById("output").innerText = error; 
        return; 
    }

    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    if (!capacities[train]) {
        document.getElementById("output").innerText = "No capacity set for this train!";
        return;
    }
    
let maxSeats = parseInt(capacities[train]);
let bookedSeats = parseInt(bookings[train] || 0);
let remaining = maxSeats - bookedSeats;

if (tickets > remaining) {

    if (remaining === 0) {
        document.getElementById("output").innerText = "Train is FULL!";
    } 
    else {
        document.getElementById("output").innerText =
            `Cannot book ${tickets} tickets. Only ${remaining} seats available.`;
    }

    return;
}
    
//     if (bookedSeats >= maxSeats) {
//     document.getElementById("output").innerText = "Train is FULL!";
//     return;
// }

// if (bookedSeats + tickets > maxSeats) {
//     document.getElementById("output").innerText = 
//         `Only ${maxSeats - bookedSeats} seats available!`;
//     return;
// }

    bookings[train] = bookedSeats + tickets;
    localStorage.setItem("bookings", JSON.stringify(bookings));

    document.getElementById("output").innerText =
        `Booking Confirmed!\nName: ${name}\nTrain: ${train}\nTickets Booked: ${tickets}\nTotal Seats Occupied: ${bookings[train]}`;
}

function validateNotEmpty(value, fieldName) {
    if (value === "") {
        return fieldName + " cannot be empty!";
    }
    return null;
}

function validatePositiveInteger(value, fieldName) {
    if (isNaN(value) || value <= 0) {
        return "Invalid " + fieldName + "!";
    }
    return null;
}

function backupSystem() {
    let data = {
        capacities: JSON.parse(localStorage.getItem("capacities")),
        bookings: JSON.parse(localStorage.getItem("bookings")),
        time: new Date().toLocaleString()
    };

    let backups = JSON.parse(localStorage.getItem("backups")) || [];
    backups.push(data);
    localStorage.setItem("backups", JSON.stringify(backups));
    console.log("Backup saved at: " + data.time);
}

// auto 
setInterval(backupSystem, 10000);

/**
 * Developed by: Elaf Salah Al-Nasser
 */

function cancelBooking() {
    let train = document.getElementById("cancelTrain").value;
    let output = document.getElementById("cancelOutput");
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    if (!bookings[train] || bookings[train] <= 0) {
        output.innerText = "Error: No bookings found for this train.";
        output.style.color = "red";
        return;
    }

    bookings[train] -= 1;
    localStorage.setItem("bookings", JSON.stringify(bookings));
    
    output.innerText = "Success: One seat cancelled by Admin (Elaf).";
    output.style.color = "green";
}

function generateSummaryReport() {
    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};
    
    document.getElementById("reportBox").style.display = "block";
    document.getElementById("totalTrains").innerText = "Managed Trains: " + Object.keys(capacities).length;
    
    let total = 0;
    for (let train in bookings) { total += bookings[train]; }
    document.getElementById("totalBookings").innerText = "Total Tickets Issued: " + total;
}

// Elaf Salah Al-Nasser

function cancelBooking() {
    let train = document.getElementById("cancelTrain").value;
    let output = document.getElementById("cancelOutput");
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    if (!bookings[train] || bookings[train] <= 0) {
        output.innerText = "Error: No bookings found for this train.";
        output.style.color = "red";
        return;
    }

    bookings[train] -= 1;
    localStorage.setItem("bookings", JSON.stringify(bookings));

    output.innerText = "Success: One seat cancelled by Admin (Elaf).";
    output.style.color = "green";
}

function generateSummaryReport() {
    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    document.getElementById("reportBox").style.display = "block";
    document.getElementById("totalTrains").innerText = "Managed Trains: " + Object.keys(capacities).length;

    let total = 0;
    for (let train in bookings) { total += bookings[train]; }
    document.getElementById("totalBookings").innerText = "Total Tickets Issued: " + total;
}

// addSchedule (Validation)
function addSchedule(){
  let train = document.getElementById("train").value;

  if(train === ""){
    document.getElementById("output").innerText = "Enter train name!";
    return;
  }

  document.getElementById("output").innerText =
  "Schedule added for " + train;
}

// addRoute
function addRoute() {
  let route = document.getElementById("routeInput").value;
  let time = document.getElementById("timeInput").value;

  if(route === "" || time === ""){
    document.getElementById("output").innerText = "Please fill all fields!";
    return;
  }

  if(!time.includes(":")){
    document.getElementById("output").innerText = "Invalid time format!";
    return;
  }

  document.getElementById("output").innerText =
  "Route: " + route + " | Time: " + time;
}

// setCapacity
// function setCapacity(){
//   let cap = document.getElementById("cap").value;

//   if(cap <= 0){
//     document.getElementById("output").innerText = "Invalid capacity!";
//     return;
//   }

//   document.getElementById("output").innerText =
//   "Capacity set to " + cap;
// }
