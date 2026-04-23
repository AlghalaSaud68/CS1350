const DEFAULT_CAPACITY = 100;

window.onload = function () {
    let role = localStorage.getItem("role");

    if (document.body.classList.contains("login-body")) return;

    if (role === "staff") {

        // STAFF CANNOT SEE THESE SECTIONS
        document.getElementById("capacitySection").style.display = "none";
        document.getElementById("priceSection").style.display = "none";
        document.getElementById("cancelSection").style.display = "none";
        document.getElementById("reportsSection").style.display = "none";

        // STAFF CANNOT SEE THESE BUTTONS
        document.getElementById("capacityBtn").style.display = "none";
        document.getElementById("priceBtn").style.display = "none";
        document.getElementById("reallocationBtn").style.display = "none";
        document.getElementById("reportsBtn").style.display = "none";
        document.getElementById("resetBtn").style.display = "none";

        // STAFF SHOULD STILL SEE:
        // Booking, Passengers, Routes, Add Train

        // HIDE DIVIDER FOR STAFF
        document.getElementById("adminDivider").style.display = "none";
    }

    updateTrainDropdowns();
    updateRoutePriceDropdown();
    showSection("bookingSection");
};

/* LOGIN */

function login() {
    let username = document.getElementById("username").value.trim().toLowerCase();
    let error = document.getElementById("loginError");

    if (username !== "admin" && username !== "staff") {
        error.innerText = "Use 'admin' or 'staff'.";
        return;
    }

    localStorage.setItem("role", username);
    window.location.href = "dashboard.html";
}

/* SECTIONS */

function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    let sec = document.getElementById(id);
    if (sec) sec.style.display = "block";
}

/* PASSENGERS */

function addPassenger() {
    let name = document.getElementById("pName").value.trim();
    let phone = document.getElementById("pPhone").value.trim();
    let email = document.getElementById("pEmail").value.trim();

    if (!name || !phone || !email) {
        showMessage("Fill all fields!", "error");
        return;
    }

    if (!/^05\d{8}$/.test(phone)) {
        showMessage("Phone must start with 05 and be 10 digits.", "error");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("Invalid email format.", "error");
        return;
    }

    let passengers = JSON.parse(localStorage.getItem("passengers")) || {};
    if (passengers[name]) {
        showMessage("Passenger already exists!", "error");
        return;
    }

    passengers[name] = { phone, email };
    localStorage.setItem("passengers", JSON.stringify(passengers));

    showMessage("Passenger added successfully.");
}

/* ADD TRAIN / SCHEDULE */

function addSchedule() {
    let train = document.getElementById("train").value.trim();

    if (!train) {
        showMessage("Enter train name!", "error");
        return;
    }

    let trains = JSON.parse(localStorage.getItem("trains")) || [];
    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};

    if (!trains.includes(train)) {
        trains.push(train);
        capacities[train] = DEFAULT_CAPACITY;
    }

    localStorage.setItem("trains", JSON.stringify(trains));
    localStorage.setItem("capacities", JSON.stringify(capacities));

    updateTrainDropdowns();
    showMessage("Train added with default capacity " + DEFAULT_CAPACITY + ".");
}

/* DROPDOWNS */

function updateTrainDropdowns() {
    let trains = JSON.parse(localStorage.getItem("trains")) || [];
    let dropdowns = [
        document.getElementById("trainName"),
        document.getElementById("trainNameCap"),
        document.getElementById("trainNameRoute")
    ];

    dropdowns.forEach(drop => {
        if (!drop) return;
        drop.innerHTML = "";
        trains.forEach(t => {
            let opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            drop.appendChild(opt);
        });
    });

    if (trains.length > 0) {
        updateAvailableSeats(trains[0]);
        updateTrainRouteInfo(trains[0]);
        updateTotalPrice();
    }
}

function updateRoutePriceDropdown() {
    let routes = JSON.parse(localStorage.getItem("routes")) || [];
    let drop = document.getElementById("routePriceSelect");

    if (!drop) return;

    drop.innerHTML = "";
    routes.forEach(r => {
        let opt = document.createElement("option");
        opt.value = r;
        opt.textContent = r;
        drop.appendChild(opt);
    });
}

/* ROUTES */

function addRoute() {
    let train = document.getElementById("trainNameRoute").value;
    let route = document.getElementById("routeInput").value.trim();
    let time = document.getElementById("timeInput").value.trim();

    if (!route || !time) {
        showMessage("Fill all fields!", "error");
        return;
    }

    let trainRoutes = JSON.parse(localStorage.getItem("trainRoutes")) || {};
    trainRoutes[train] = { route, time };
    localStorage.setItem("trainRoutes", JSON.stringify(trainRoutes));

    let routes = JSON.parse(localStorage.getItem("routes")) || [];
    if (!routes.includes(route)) routes.push(route);
    localStorage.setItem("routes", JSON.stringify(routes));
    updateRoutePriceDropdown();

    showMessage("Route assigned to train.");
}

/* PRICING */

function setPrice() {
    let route = document.getElementById("routePriceSelect").value;
    let price = Number(document.getElementById("priceInput").value);

    if (!route || !price) {
        showMessage("Fill all fields!", "error");
        return;
    }

    let prices = JSON.parse(localStorage.getItem("prices")) || {};
    prices[route] = price;
    localStorage.setItem("prices", JSON.stringify(prices));

    showMessage("Price set for route.");
    updateTotalPrice();
}

/* ROUTE INFO + SEATS */

function updateTrainRouteInfo(train) {
    let trainRoutes = JSON.parse(localStorage.getItem("trainRoutes")) || {};
    let info = trainRoutes[train];

    let box = document.getElementById("trainRouteInfo");
    if (!box) return;

    if (!info) {
        box.innerText = "No route assigned.";
        return;
    }

    box.innerText = `Route: ${info.route} | Time: ${info.time}`;
}

function updateAvailableSeats(train) {
    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    let maxSeats = capacities[train] || 0;
    let booked = bookings[train] || 0;

    let box = document.getElementById("availableSeats");
    if (!box) return;

    box.innerText = `Available Seats: ${maxSeats - booked}`;
}

/* CAPACITY */

function setCapacity() {
    let train = document.getElementById("trainNameCap").value;
    let cap = Number(document.getElementById("cap").value);

    if (!cap || cap <= 0) {
        showMessage("Invalid capacity!", "error");
        return;
    }

    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    let booked = bookings[train] || 0;
    if (cap < booked) {
        showMessage("Capacity cannot be less than booked seats.", "error");
        return;
    }

    capacities[train] = cap;
    localStorage.setItem("capacities", JSON.stringify(capacities));

    updateAvailableSeats(train);
    showMessage("Capacity updated.");
}

/* PRICE CALCULATION */

function updateTotalPrice() {
    let trainSelect = document.getElementById("trainName");
    let ticketInput = document.getElementById("ticketCount");
    let box = document.getElementById("totalPriceBox");

    if (!trainSelect || !ticketInput || !box) return;

    let train = trainSelect.value;
    let tickets = Number(ticketInput.value) || 0;

    let trainRoutes = JSON.parse(localStorage.getItem("trainRoutes")) || {};
    let prices = JSON.parse(localStorage.getItem("prices")) || {};

    let route = trainRoutes[train]?.route || "";
    let price = prices[route] || 0;

    box.innerText = `Total Price: ${tickets * price} SAR`;
}

/* BOOKING */

function confirmBooking() {
    let name = document.getElementById("userName").value.trim();
    let train = document.getElementById("trainName").value;
    let tickets = Number(document.getElementById("ticketCount").value);

    if (!name || !train || tickets <= 0) {
        showMessage("Fill all fields!", "error");
        return;
    }

    let passengers = JSON.parse(localStorage.getItem("passengers")) || {};
    if (!passengers[name]) {
        showMessage("Passenger not found! Add passenger first.", "error");
        return;
    }

    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    let maxSeats = capacities[train] || 0;
    let booked = bookings[train] || 0;

    if (booked + tickets > maxSeats) {
        showMessage("Not enough seats available.", "error");
        return;
    }

    bookings[train] = booked + tickets;

    let existing = reservations.find(r => r.name === name && r.train === train);
    if (existing) existing.tickets += tickets;
    else reservations.push({ name, train, tickets });

    localStorage.setItem("bookings", JSON.stringify(bookings));
    localStorage.setItem("reservations", JSON.stringify(reservations));

    updateAvailableSeats(train);
    updateTotalPrice();

    showMessage("Booking confirmed.");
}

/* CANCEL BOOKING */

function cancelBooking() {
    let train = document.getElementById("cancelTrainInput").value.trim();
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    if (!train || !bookings[train]) {
        showMessage("No bookings found for this train.", "error");
        return;
    }

    bookings[train] -= 1;
    if (bookings[train] < 0) bookings[train] = 0;

    let index = reservations.findIndex(r => r.train === train);
    if (index !== -1) {
        if (reservations[index].tickets > 1) {
            reservations[index].tickets -= 1;
        } else {
            reservations.splice(index, 1);
        }
    }

    localStorage.setItem("bookings", JSON.stringify(bookings));
    localStorage.setItem("reservations", JSON.stringify(reservations));

    showMessage("One seat cancelled.");
}

/* REPORTS */

function generateSummaryReport() {
    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

    document.getElementById("reportBox").style.display = "block";

    document.getElementById("totalTrains").innerText =
        "Managed Trains: " + Object.keys(capacities).length;

    let total = 0;
    for (let t in bookings) total += bookings[t];

    document.getElementById("totalBookings").innerText =
        "Total Tickets Issued: " + total;
}

function generateWagensSummary() {
    let trains = JSON.parse(localStorage.getItem("trains")) || [];
    let capacities = JSON.parse(localStorage.getItem("capacities")) || {};
    let bookings = JSON.parse(localStorage.getItem("bookings")) || {};
    let reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    let prices = JSON.parse(localStorage.getItem("prices")) || {};
    let passengers = JSON.parse(localStorage.getItem("passengers")) || {};
    let trainRoutes = JSON.parse(localStorage.getItem("trainRoutes")) || {};

    let totalBookings = 0;
    for (let t in bookings) totalBookings += bookings[t];

    let totalRevenue = 0;
    reservations.forEach(r => {
        let route = trainRoutes[r.train]?.route || "";
        let price = prices[route] || 0;
        totalRevenue += r.tickets * price;
    });

    let totalCapacity = 0;
    let totalUsed = 0;

    trains.forEach(t => {
        totalCapacity += capacities[t] || 0;
        totalUsed += bookings[t] || 0;
    });

    let occupancy = totalCapacity > 0
        ? ((totalUsed / totalCapacity) * 100).toFixed(1)
        : 0;

    document.getElementById("wagensSummaryBox").style.display = "block";

    document.getElementById("wsTotalTrains").innerText = "Total Trains: " + trains.length;
    document.getElementById("wsTotalPassengers").innerText = "Registered Passengers: " + Object.keys(passengers).length;
    document.getElementById("wsTotalBookings").innerText = "Total Bookings: " + totalBookings;
    document.getElementById("wsTotalCapacity").innerText = "Total Capacity: " + totalCapacity;
    document.getElementById("wsOccupancy").innerText = "Occupancy Rate: " + occupancy + "%";
    document.getElementById("wsRevenue").innerText = "Total Revenue: " + totalRevenue + " SAR";
}

/* UTILITIES */

function showMessage(msg, type = "success") {
    let box = document.getElementById("output");
    if (!box) return;

    box.style.display = "block";
    box.innerText = msg;
    box.style.borderLeft = type === "error"
        ? "4px solid #c0392b"
        : "4px solid #1f3a5f";
}

/* RESET + LOGOUT */

function resetStorage() {
    let role = localStorage.getItem("role");
    if (role !== "admin") {
        showMessage("Only admin can reset!", "error");
        return;
    }

    localStorage.clear();
    showMessage("System reset.");
    setTimeout(() => location.reload(), 800);
}

function logout() {
    localStorage.removeItem("role");
    window.location.href = "train-system-login.html";
}
