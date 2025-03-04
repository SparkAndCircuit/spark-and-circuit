import { DataHelpers, DOMHelpers } from '../lib/helpers.js';

export class EventManager {
    static async initialize() {
        try {
            const events = await DataHelpers.fetchData('../data/events.json');
            this.renderEvents(events);
        } catch (error) {
            this.handleError('events-container', error);
        }
    }

    static renderEvents(events) {
        const container = DOMHelpers.qs('#events-container');
        container.innerHTML = events.map(event => `
            <article class="card event-card ${event.gridSpan === 2 ? 'grid-span-2' : ''}">
                <div class="event-tag ${event.tag.toLowerCase()}">${event.tag}</div>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-details">
                    <p>${event.date}</p>
                    <p>${event.format} | ${event.entry}</p>
                </div>
                <div class="event-footer">
                    <div class="event-players">${event.registered} Registered</div>
                    <button class="btn btn--gold" data-event-id="${event.id}">
                        ${event.tag === 'Premier' ? 'Register Now' : 'Join'}
                    </button>
                </div>
            </article>
        `).join('');
    }

    static handleError(containerId, error) {
        console.error('Event loading error:', error);
        DOMHelpers.qs(`#${containerId}`).innerHTML = `
            <p class="error-message">Failed to load events. Please try again later.</p>
        `;
    }
}