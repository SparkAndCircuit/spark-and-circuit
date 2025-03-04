document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
});

async function loadEvents() {
    try {
        const response = await fetch('events.json');
        const data = await response.json();
        renderEvents(data.events);
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-container').innerHTML = '<p class="error-message">Failed to load events. Please try again later.</p>';
    }
}

function renderEvents(events) {
    const container = document.getElementById('events-container');
    container.innerHTML = '';

    events.forEach(event => {
        const eventCard = document.createElement('article');
        eventCard.className = `event-card ${event.gridSpan === 2 ? 'grid-span-2' : ''}`;

        eventCard.innerHTML = `
            <div class="event-tag ${event.tag.toLowerCase()}">${event.tag}</div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-details">
                <p>${event.date}</p>
                <p>${event.format} | ${event.entry}</p>
            </div>
            <div class="event-footer">
                <div class="event-players">
                    ${event.registered} Registered
                </div>
                <button class="card-button" data-event-id="${event.id}">
                    ${event.tag === 'Premier' ? 'Register Now' : 'Join'}
                </button>
            </div>
        `;

        container.appendChild(eventCard);
    });

    // Add event listeners to buttons
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('card-button')) {
            const eventId = e.target.dataset.eventId;
            handleRegistration(eventId);
        }
    });
}

function handleRegistration(eventId) {
    // Add your registration logic here
    console.log(`Registering for event ${eventId}`);
    alert(`Registration for event ${eventId} would be processed here!`);
}