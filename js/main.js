// Main Selectors
let tableBody = document.getElementById("table-body");

// Main Variables
let taxis = [
    { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 },
];

//

function setTaxis() {
    for (const taxi of taxis) {
        tableBody.innerHTML += `
        <tr>
            <td class="p-4 border-b border-blue-gray-50">
                ${taxi.id}
            </td>
            <td class="p-4 border-b border-blue-gray-50">${
                taxi.available ? "avalaible" : "not availabe"
            }</td>
            <td class="p-4 border-b border-blue-gray-50">${taxi.position}</td>
        </tr>
    `;
    }
}

setTaxis();
