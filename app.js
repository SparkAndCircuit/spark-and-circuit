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
                <p>${event.date}</p>
                <p>${event.format} | ${event.entry}</p>
            </div>
            <div class="event-footer">
                <div class="event-players">${event.registered} Registered</div>
                <button class="card-button" data-event-id="${event.id}">
                    ${event.tag === 'Premier' ? 'Register Now' : 'Join'}
                </button>
            </div>
        </article>
    `).join('');

    // Delegated event listener for better performance
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

    // Cache the measurement element
    let tempSpan = document.createElement('span');
    tempSpan.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        font-family: ${window.getComputedStyle(categorySelect).fontFamily};
        font-size: ${window.getComputedStyle(categorySelect).fontSize};
    `;
    document.body.appendChild(tempSpan);

    const calculateOptimalWidth = () => {
        const options = Array.from(categorySelect.options);
        if (options.length === 0) return; // Handle empty case

        const padding = parseFloat(getComputedStyle(categorySelect).paddingRight) * 2;
        const widths = options.map(option => {
            tempSpan.textContent = option.text;
            return tempSpan.offsetWidth;
        });

        const maxWidth = Math.max(...widths);
        categorySelect.style.width = `${Math.min(
            Math.max(maxWidth + padding, 60), // Match CSS min-width
            300 // Match CSS max-width
        )}px`;
    };

    // Initial calculation
    calculateOptimalWidth();

    // Add debounce to resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(calculateOptimalWidth, 250);
    });

    categorySelect.addEventListener('change', calculateOptimalWidth);

    // Cleanup measurement element when needed
    // document.body.removeChild(tempSpan); // Add this later if needed
}