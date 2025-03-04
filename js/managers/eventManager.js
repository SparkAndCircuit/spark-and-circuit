import { DataHelpers, DOMHelpers } from '../lib/helpers.js';

export class EventManager {
    static async initialize() {
        try {
            const events = await DataHelpers.fetchData('data/events.json');
            this.renderEvents(events);
            this.setupRegistration();
        } catch (error) {
            console.error('Event Manager Error:', error);
        }
    }

    static renderEvents(events) {
        const container = DOMHelpers.qs('#events-container');
        container.innerHTML = events.map(event => `
            <div class="event-card ${event.featured ? 'featured' : ''}">
                <span class="event-tag ${event.type}">${event.type}</span>
                <h3>${event.title}</h3>
                <p class="event-date">📅 ${event.date}</p>
                <p class="event-format">${event.format}</p>
                <div class="event-meta">
                    <span class="entry-fee">${event.entryFee}</span>
                    <button class="cta-button register-btn" 
                            data-id="${event.id}"
                            ${event.remainingSpots === 0 ? 'disabled' : ''}>
                        ${event.remainingSpots} Spots Left
                    </button>
                </div>
            </div>
        `).join('');
    }

    static setupRegistration() {
        DOMHelpers.qs('#events-container').addEventListener('click', async (e) => {
            if (e.target.classList.contains('register-btn')) {
                const eventId = e.target.dataset.id;
                // Add registration logic
            }
        });
    }
}