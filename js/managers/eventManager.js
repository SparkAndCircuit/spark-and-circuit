document.addEventListener("DOMContentLoaded", () => {
    fetch('data/events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Events Loaded:", data); // Debugging
            renderEvents(data.events);
        })
        .catch(error => console.error('Error loading events:', error));
});

function renderEvents(events) {
    const container = document.getElementById("events-container");
    if (!container) {
        console.error("Error: events-container element not found");
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="event-card ${event.gridSpan === 2 ? 'grid-span-2' : ''}">
            <span class="event-tag ${event.tag.toLowerCase()}">${event.tag}</span>
            <h3 class="event-title">${event.title}</h3>
            <p class="event-details">${event.date} | ${event.format}</p>
            <p class="event-entry">${event.entry}</p>
        </div>
    `).join('');
}
