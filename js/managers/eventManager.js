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
                <span class="event-tag ${event.type}">${event.type.toUpperCase()}</span>
                <h3>${event.title}</h3>
                <div class="event-details">
                    <p class="event-date">${new Date(event.date).toLocaleDateString()}</p>
                    <p class="event-format">Format: ${event.format}</p>
                    <p class="event-prize">Prize: ${event.prizePool}</p>
                </div>
                <div class="event-meta">
                    <span class="entry-fee">${event.entryFee} Entry</span>
                    <button class="cta-button register-btn" 
                            data-id="${event.id}"
                            ${event.remainingSpots === 0 ? 'disabled' : ''}>
                        ${event.remainingSpots > 0 ? 
                            `${event.remainingSpots} Spots Remaining` : 
                            'Event Full'}
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