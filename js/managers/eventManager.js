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
    const storedEvents = DataHelpers.retrieveData('events') || {};
    const container = document.getElementById("events-container");
    
    container.innerHTML = events.map(event => {
        const registered = storedEvents[event.id]?.registered || 0;
        return `
        <div class="event-card ${event.gridSpan === 2 ? 'grid-span-2' : ''}">
            <span class="event-tag ${event.tag.toLowerCase()}">${event.tag}</span>
            <h3 class="event-title">${event.title}</h3>
            <p class="event-details">${event.date} | ${event.format}</p>
            <p class="event-entry">${event.entry}</p>
            <div class="event-footer">
                <button class="cta-button register-btn" 
                        data-event-id="${event.id}"
                        ${registered >= event.maxPlayers ? 'disabled' : ''}>
                    ${registered}/${event.maxPlayers} Registered
                </button>
                <p class="event-prizes">🏆 ${event.prizes}</p>
            </div>
        </div>`;
    }).join('');

    // Registration functionality
    document.querySelectorAll('.register-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.dataset.eventId;
            const eventData = events.find(ev => ev.id == eventId);
            const storedEvents = DataHelpers.retrieveData('events') || {};
            
            if (!storedEvents[eventId]) {
                storedEvents[eventId] = { registered: 1 };
            } else {
                storedEvents[eventId].registered++;
            }
            
            DataHelpers.persistData('events', storedEvents);
            e.target.textContent = `${storedEvents[eventId].registered}/${eventData.maxPlayers} Registered`;
            
            if (storedEvents[eventId].registered >= eventData.maxPlayers) {
                e.target.disabled = true;
            }
        });
    });
}