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
window.onload = function () {
    let role = localStorage.getItem("role");

    if (role === "staff") {
        document.getElementById("capacityBtn").style.display = "none";
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

// function confirmBooking(){
//   let name = document.getElementById("userName").value;
//   let train = document.getElementById("trainName").value;

//   if(name === "" || train === ""){
//     document.getElementById("output").innerText = "Missing booking data!";
//     return;
//   }

//   document.getElementById("output").innerText =
//   "Booking Confirmed for " + name + " on " + train;
// }

function confirmBooking(){
  let name = document.getElementById("userName").value;
  let train = document.getElementById("trainName").value;

  if(name === "" || train === ""){
    document.getElementById("output").innerText = "Missing booking data!";
    return;
  }

  let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
  let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

  //check capacity
  if (!capacities[train]) {
    document.getElementById("output").innerText =
      "No capacity set for this train!";
    return;
  }

  let count = bookings[train] || 0;
  if (count >= capacities[train]) {
    document.getElementById("output").innerText =
      "Train is FULL!";
    return;
  }

  //book
  bookings[train] = count + 1;
  localStorage.setItem("bookings", JSON.stringify(bookings));

  document.getElementById("output").innerText =
  "Booking Confirmed for " + name + " on " + train;
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
