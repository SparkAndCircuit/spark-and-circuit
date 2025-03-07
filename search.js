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
            ${result.format ? `<p>Format: ${result.format}</p>` : ''}
            ${result.date ? `<p>Date: ${result.date}</p>` : ''}
            ${result.price ? `<p>Price: ${result.price}</p>` : ''}
            ${result.stock ? `<p>Stock: ${result.stock}</p>` : ''}
            ${result.description ? `<p>${result.description}</p>` : ''}
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