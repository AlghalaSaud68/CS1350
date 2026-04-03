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

function setCapacity() {
    let cap = document.getElementById("cap").value;
    document.getElementById("output").innerText =
        "Capacity set to: " + cap;
}
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
}

function confirmBooking(){
  let name = document.getElementById("userName").value;
  let train = document.getElementById("trainName").value;

  if(name === "" || train === ""){
    document.getElementById("output").innerText = "Missing booking data!";
    return;
  }

  document.getElementById("output").innerText =
  "Booking Confirmed for " + name + " on " + train;
}
