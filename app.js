document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    setupSearch();
    document.fonts.ready.then(() => {
        setupCategoryWidthAdjustment();
    });
});

async function loadEvents() {
    try {
        const response = await fetch('events.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        renderEvents(data.events);
    } catch (error) {
        console.error('Error loading events:', error);
        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = '<p class="error-message">Failed to load events. Please try again later.</p>';
        }
    }
}

function renderEvents(events) {
    const container = document.getElementById('events-container');
    if (!container) return;

    container.innerHTML = events.map(event => `
        <article class="event-card ${event.gridSpan === 2 ? 'grid-span-2' : ''}">
            <div class="event-tag ${event.tag.toLowerCase()}">${event.tag}</div>
            <h3 class="event-title">${event.title}</h3>
            
            <div class="event-details">
                <p class="event-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    ${event.date}
                </p>
                <p class="event-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    ${event.format}
                </p>
                <p class="event-detail">
                    <span class="event-price">${event.entry}</span>
                </p>
            </div>
            
            ${event.description ? `
            <p class="event-description">
                ${event.description}
            </p>` : ''}
            
            <div class="event-footer">
                <div class="event-players">${event.registered} Registered</div>
                <button class="card-button" data-event-id="${event.id}">
                    ${event.tag === 'Premier' ? 'Register Now' : 'Join'}
                </button>
            </div>
        </article>
    `).join('');
    
    container.addEventListener('click', handleCardButtonClick);
}

function handleCardButtonClick(event) {
    const button = event.target.closest('.card-button');
    if (button) {
        const eventId = button.dataset.eventId;
        handleRegistration(eventId);
    }
}

function handleRegistration(eventId) {
    // Enhanced registration handling
    console.log(`Initiating registration for event ${eventId}`);
    // Add actual registration logic here
    alert(`Registration system would process event ${eventId}`);
}

function setupSearch() {
    const searchCategory = document.querySelector('.search-category');
    const searchInput = document.querySelector('.nav-search');
    const searchIcon = document.querySelector('.search-icon');

    if (!searchCategory || !searchInput || !searchIcon) return;

    const performSearch = () => {
        const category = searchCategory.value;
        const query = searchInput.value.trim();
        if (query) {
            console.log(`Searching ${category} for: "${query}"`);
            // Implement actual search functionality
        }
    };

    searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch());
    searchIcon.addEventListener('click', performSearch);
}

function setupCategoryWidthAdjustment() {
    const categorySelect = document.querySelector('.search-category');
    if (!categorySelect) return;

    const tempSpan = document.createElement('span');
    tempSpan.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        font: ${window.getComputedStyle(categorySelect).font};
        letter-spacing: ${window.getComputedStyle(categorySelect).letterSpacing};
        padding: 0 2.5rem 0 1.2rem; /* Match select's padding */
    `;
    document.body.appendChild(tempSpan);

    const calculateOptimalWidth = () => {
        const option = categorySelect.options[categorySelect.selectedIndex];
        if (!option) return;
    
        // Get computed padding from both sides
        const computedStyle = getComputedStyle(categorySelect);
        const padding = 
            parseFloat(computedStyle.paddingLeft) +
            parseFloat(computedStyle.paddingRight);
    
        // Measure text with actual padding
        tempSpan.textContent = option.text;
        const textWidth = tempSpan.offsetWidth;
        
        // Calculate total width
        const totalWidth = textWidth;
        
        // Apply constrained width
        categorySelect.style.width = `${Math.min(
            Math.max(totalWidth, 60), // Min width
            300 // Max width
        )}px`;
    };

    // Initial calculation
    calculateOptimalWidth();

    // Add event listeners
    categorySelect.addEventListener('change', calculateOptimalWidth);
    window.addEventListener('resize', calculateOptimalWidth);
    new ResizeObserver(calculateOptimalWidth).observe(categorySelect);

    // Cleanup
    return () => document.body.removeChild(tempSpan);
}