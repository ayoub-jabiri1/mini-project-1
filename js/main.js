// 1. Main Selectors

let tableBody = document.getElementById("table-body"),
    QueueTableBody = document.getElementById("queue-table-body"),
    userPosition = document.getElementById("user-position"),
    userDuration = document.getElementById("user-duration"),
    newReqBtn = document.getElementById("new-req"),
    reqPopupBtn = document.getElementById("req-popup-btn"),
    statsPopupBtn = document.getElementById("stats-popup-btn");

// 2. Main Variables

let taxis = [
        {
            id: 1,
            position: 5,
            available: true,
            timeRemaining: 0,
            totalRides: 0,
        },
        {
            id: 2,
            position: 12,
            available: true,
            timeRemaining: 0,
            totalRides: 0,
        },
        {
            id: 3,
            position: 20,
            available: true,
            timeRemaining: 0,
            totalRides: 0,
        },
    ],
    currentRequest = {},
    requestId = 1,
    waitingQueue = [],
    companyTotalDurations = 0;

// 3. Start Functions

function setTaxis() {
    // Empty the Table Before Adding Content
    tableBody.innerHTML = "";

    // Set Taxis on Page
    for (const taxi of taxis) {
        tableBody.innerHTML += `
        <tr class="${taxi.available ? "bg-[#E8F5E9]" : "bg-[#FFEBEE]"}">
            <td class="p-4 border-b border-blue-gray-50">
                ${taxi.id}
            </td>
            <td class="p-4 border-b border-blue-gray-50">
                ${taxi.available ? "Avalaible" : "Unavailabe"}
            </td>
            <td class="p-4 border-b border-blue-gray-50">${taxi.position}</td>
            <td class="p-4 border-b border-blue-gray-50">
                ${taxi.timeRemaining}
            </td>
            <td class="p-4 border-b border-blue-gray-50">
                ${taxi.totalRides}
            </td>
        </tr>
    `;
    }

    // Handle Statistics
    handleStats();
}

function newReq(id, newReqPosition, newReqDuration) {
    // Get New Req
    let req = {
        reqId: id,
        position: newReqPosition,
        duration: newReqDuration,
        time: 5,
    };

    // Store Duration for Final Statistics
    companyTotalDurations += newReqDuration;

    // Check if there is available taxis
    let check = 0;
    for (let taxi of taxis) {
        if (taxi.available == false) check++;
    }

    if (check < taxis.length) {
        // Tf there are taxis available
        currentRequest = req;
        findTaxi();
    } else {
        // If there are no taxis available
        waitingQueue.push(req);
        setWaitingQueue();

        // Show waiting pop up message
        let msg = `There are no taxis available, you should wait in the queue`;
        showMsg(msg, "#F44336");
    }

    // Reset Inputs
    userPosition.value = "";
    userDuration.value = "";
}

function findTaxi() {
    // Get the available taxis distance and ids
    let appropriateTaxis = [];

    for (const taxi of taxis) {
        if (taxi.available == false) continue;

        if (taxi.position > currentRequest.position) {
            appropriateTaxis.push({
                id: taxi.id,
                distance: taxi.position - currentRequest.position,
            });
        } else {
            appropriateTaxis.push({
                id: taxi.id,
                distance: currentRequest.position - taxi.position,
            });
        }
    }

    // Get the closer taxi
    let closerTaxi = appropriateTaxis.reduce(
        (p, c) => (p.distance > c.distance ? c : p),
        appropriateTaxis[0]
    );

    // Take the closer taxi and set is as unavailabe
    for (const taxi of taxis) {
        if (taxi.id == closerTaxi.id) {
            taxi.available = false;
            taxi.timeRemaining = currentRequest.duration;
            setTaxis();

            // Show success pop up message
            let msg = `The passenger with the request id ${currentRequest.reqId} took the taxi ${taxi.id}`;
            showMsg(msg, "#4CAF50");

            if (taxi.timeRemaining > 0) {
                // Reset the Taxi after the Travel Duration Ends
                setTimeout(() => {
                    taxi.position = currentRequest.position;
                    taxi.available = true;
                    taxi.timeRemaining = 0;
                    taxi.totalRides++;
                    setTaxis();
                    handleQueue();
                }, currentRequest.duration * 1000);
            }

            break;
        }
    }
}

function setWaitingQueue() {
    // Empty the Table Before Adding Content
    QueueTableBody.innerHTML = "";

    // Set Queue Table Content
    for (const req of waitingQueue) {
        QueueTableBody.innerHTML += `
        <tr>
            <td class="p-4 border-b border-blue-gray-50">
                ${req.reqId}
            </td>
            <td class="p-4 border-b border-blue-gray-50">
                ${req.position}
            </td>
            <td class="p-4 border-b border-blue-gray-50">${req.duration}</td>
        </tr>
    `;
    }
}

function handleQueue() {
    if (waitingQueue.length) {
        // Waiting 1s before handling the queue
        setTimeout(() => {
            // Set the first request in queue as the current req
            newReq(
                waitingQueue[0].reqId,
                waitingQueue[0].position,
                waitingQueue[0].duration
            );

            // Delete the req from the queue
            waitingQueue.splice(0, 1);
            setWaitingQueue();
        }, 1000);
    }
}

function handleStats() {
    let companyStats = document.getElementById("company-stats"),
        taxisStats = document.getElementById("taxis-stats"),
        totalRides = 0;

    // Get Total Rides
    for (const taxi of taxis) {
        totalRides += taxi.totalRides;
    }

    // Reset Tables
    companyStats.innerHTML = "";
    taxisStats.innerHTML = "";

    // Set Stats
    companyStats.innerHTML += `
        <tr >
            <td
                class="p-4 border-b border-blue-gray-50"
            >
                ${totalRides}
            </td>
            <td
                class="p-4 border-b border-blue-gray-50"
            >
                ${companyTotalDurations}
            </td>
        </tr>
    `;

    // Set Each Taxi Stats
    for (const taxi of taxis) {
        taxisStats.innerHTML += `
            <tr>
                <td
                    class="p-4 border-b border-blue-gray-50"
                >
                    ${taxi.id}
                </td>
                <td
                    class="p-4 border-b border-blue-gray-50"
                >
                    ${taxi.totalRides}
                </td>
                <td
                    class="p-4 border-b border-blue-gray-50"
                >
                    ${taxi.position}
                </td>
            </tr>
        `;
    }
}

function showMsg(msg, color) {
    let popUp = document.createElement("span");

    popUp.className = `pop-up fixed top-[50px] left-[50%] translate-x-[-50%] bg-[${color}] text-white rounded-md p-4`;
    popUp.innerHTML = msg;

    document.body.appendChild(popUp);

    setTimeout(() => {
        popUp.remove();
    }, 4000);
}

// 4: Start the Program

setTaxis();

// Handle Clicking on New Request Button
newReqBtn.addEventListener("click", () => {
    let newReqPosition = +userPosition.value,
        newReqDuration = +userDuration.value;

    if (newReqDuration != "" && newReqPosition != "") {
        newReq(requestId++, newReqPosition, newReqDuration);
        document.getElementById("req-popup").classList.add("hidden");
    }
});

// Trigger New Requets Pop up
reqPopupBtn.addEventListener("click", () => {
    let popUp = document.getElementById("req-popup");

    popUp.classList.remove("hidden");
    userPosition.focus();

    // Close the pop up
    document.getElementById("req-close-btn").addEventListener("click", () => {
        popUp.classList.add("hidden");
    });
});

// Trigger Stats Pop up
statsPopupBtn.addEventListener("click", () => {
    let popUp = document.getElementById("stats-popup");
    popUp.classList.remove("hidden");

    // Close the pop up
    document.getElementById("stats-close-btn").addEventListener("click", () => {
        popUp.classList.add("hidden");
    });
});
