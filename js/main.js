// 1. Main Selectors
let tableBody = document.getElementById("table-body"),
    QueueTableBody = document.getElementById("queue-table-body"),
    userPosition = document.getElementById("user-position"),
    userDuration = document.getElementById("user-duration"),
    newReqBtn = document.getElementById("new-req");

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
    waitingQueue = [];

// 3. Start Functions

function setTaxis() {
    tableBody.innerHTML = "";

    // Set a unique id on the elements that need time remaining function
    let id = 1;

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
            <td ${
                taxi.timeRemaining != 0 ? `id="tr-${id}"` : ""
            } class="p-4 border-b border-blue-gray-50">
                ${
                    // taxi.timeRemaining == 0 ? taxi.timeRemaining : ""
                    taxi.timeRemaining
                }
            </td>
            <td class="p-4 border-b border-blue-gray-50">
                ${taxi.totalRides}
            </td>
        </tr>
    `;

        // handleRemainingTime(`tr-${id}`, id)

        id++;
    }
}

function newReq(id, newReqPosition, newReqDuration) {
    // Get New Req
    let req = {
        reqId: id++,
        position: newReqPosition,
        duration: newReqDuration,
        time: 5,
    };

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

    // Take the taxi and set is as unavailabe
    for (const taxi of taxis) {
        if (taxi.id == closerTaxi.id) {
            taxi.available = false;
            taxi.timeRemaining = currentRequest.duration;
            setTaxis();

            if (taxi.timeRemaining > 0) {
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
    QueueTableBody.innerHTML = "";

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
            // Set the first request in queue as the current rea
            newReq(
                waitingQueue[0].reqId,
                waitingQueue[0].position,
                waitingQueue[0].duration
            );

            // Delete the req
            waitingQueue.splice(0, 1);
            setWaitingQueue();
        }, 1000);
    }
}

function handleRemainingTime(elementId, id) {
    // let counter = setInterval(() => {
    //     document.getElementById(elementId).innerHTML = taxis[id - 1]
    //         .timeRemaining--;
    // }, 1000);

    // setTimeout(() => clearInterval(counter), currentRequest.duration * 1000);

    // console.log(counter);
    // return taxis[id - 1].timeRemaining;

    document.addEventListener("DOMContentLoaded", function () {
        console.log(document.getElementById(elementId));
    });
}

// 4: Start the Program

setTaxis();

newReqBtn.addEventListener("click", () => {
    let newReqPosition = +userPosition.value,
        newReqDuration = +userDuration.value;

    if (newReqDuration != "" && newReqPosition != "") {
        newReq(requestId, newReqPosition, newReqDuration);
    }
});
