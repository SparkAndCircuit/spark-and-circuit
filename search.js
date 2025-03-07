// search.js - SEARCH PAGE ONLY
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query') || '';
    const category = params.get('category') || 'all';
    
    performSearch(query, category);
    setupCategoryWidthAdjustment(); // Add this line
});

async function performSearch(query, category) {
    try {
        const [eventsRes, productsRes] = await Promise.all([
            fetch('events.json'),
            fetch('products.json')
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
    const searchableFields = {
        events: ['title', 'format', 'description'],
        products: ['title', 'category', 'description']
    };

    return Object.entries(data).reduce((acc, [type, items]) => {
        const filtered = items.filter(item => {
            // Category filtering
            const categoryMatch = category === 'all' || 
                (type === 'events' && category === 'events') ||
                (type === 'products' && item.category === category);

            // Query matching
            const queryMatch = searchableFields[type].some(field => 
                item[field]?.toLowerCase().includes(query)
            );

            return categoryMatch && queryMatch;
        });

        return acc.concat(filtered.map(item => ({
            ...item,
            type: type === 'events' ? 'Event' : 'Product'
        })));
    }, []);
}

function displayResults(results) {
    const container = document.getElementById('results-container');
    const noResults = document.getElementById('no-results');
    
    container.innerHTML = '';
    noResults.style.display = 'none';

    if (!results.length) {
        noResults.style.display = 'block';
        return;
    }

    container.innerHTML = results.map(result => `
        <article class="search-result-card">
            <div class="search-result-type">${result.type}</div>
            <h3>${result.title}</h3>
            
            <div class="search-result-details">
                ${result.format ? `
                <p class="search-result-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    ${result.format}
                </p>` : ''}
                
                ${result.date ? `
                <p class="search-result-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    ${result.date}
                </p>` : ''}
                
                ${result.price ? `
                <p class="search-result-detail">
                    <span class="search-result-price">${result.price}</span>
                </p>` : ''}
                
                ${result.stock ? `
                <p class="search-result-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M5 13l4 4L19 7"/>
                    </svg>
                    ${result.stock}
                </p>` : ''}
            </div>
            
            ${result.description ? `
            <p class="search-result-description">
                ${result.description}
            </p>` : ''}
        </article>
    `).join('');
}

// Add this entire function to search.js
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
        padding: 0 2.5rem 0 1.2rem;
    `;
    document.body.appendChild(tempSpan);

    const calculateOptimalWidth = () => {
        const option = categorySelect.options[categorySelect.selectedIndex];
        if (!option) return;
        
        tempSpan.textContent = option.text;
        const textWidth = tempSpan.offsetWidth;
        
        categorySelect.style.width = `${Math.min(
            Math.max(textWidth, 60),
            300
        )}px`;
    };

    calculateOptimalWidth();
    categorySelect.addEventListener('change', calculateOptimalWidth);
    window.addEventListener('resize', calculateOptimalWidth);
    new ResizeObserver(calculateOptimalWidth).observe(categorySelect);
}