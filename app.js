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

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query') || '';
    const category = params.get('category') || 'all';
    
    performSearch(query, category);
});

async function performSearch(query, category) {
    try {
        // Load all data (you'll need to expand this with actual product data)
        const [eventsRes, productsRes] = await Promise.all([
            fetch('events.json'),
            fetch('products.json') // Create this file with your product data
        ]);
        
        const allData = {
            events: (await eventsRes.json()).events,
            products: (await productsRes.json()).products
        };

        const results = filterResults(allData, query.toLowerCase(), category.toLowerCase());
        displayResults(results);
    } catch (error) {
        console.error('Search error:', error);
        document.getElementById('no-results').style.display = 'block';
    }
}

function filterResults(data, query, category) {
    const searchableFields = ['title', 'format', 'description', 'category'];
    
    return Object.entries(data).reduce((acc, [type, items]) => {
        if (category !== 'all' && !type.toLowerCase().includes(category)) return acc;
        
        const filtered = items.filter(item => 
            searchableFields.some(field => 
                item[field]?.toLowerCase().includes(query)
            )
        );
        
        return acc.concat(filtered.map(item => ({ ...item, type })));
    }, []);
}

function displayResults(results) {
    const container = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');
    
    if (!results.length) {
        noResults.style.display = 'block';
        return;
    }

    container.innerHTML = results.map(result => `
        <article class="search-result-card">
            <div class="search-result-type">${result.type}</div>
            <h3>${result.title}</h3>
            ${result.format ? `<p>Format: ${result.format}</p>` : ''}
            ${result.price ? `<p>Price: ${result.price}</p>` : ''}
            ${result.date ? `<p>Date: ${result.date}</p>` : ''}
        </article>
    `).join('');
}