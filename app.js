document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    loadProducts();
    initializeAdminPanel();
});

// Event System
async function loadEvents() {
    try {
        const response = await fetch('events.json');
        const data = await response.json();
        renderEvents(data.events);
    } catch (error) {
        handleLoadError('events-container', 'events');
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
                <div class="event-players">${event.registered} Registered</div>
                <button class="card-button" data-event-id="${event.id}">
                    ${event.tag === 'Premier' ? 'Register Now' : 'Join'}
                </button>
            </div>
        `;
        container.appendChild(eventCard);
    });

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('card-button')) {
            handleRegistration(e.target.dataset.eventId);
        }
    });
}

// Store System
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
let products = [];

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        products = data.products;
        initializeInventory(products);
        renderProducts(products);
    } catch (error) {
        handleLoadError('products-container', 'products');
    }
}

function initializeInventory(products) {
    products.forEach(product => {
        if (!inventory[product.id]) {
            inventory[product.id] = {
                currentStock: product.initialStock,
                initialStock: product.initialStock
            };
        }
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function renderProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="stock-indicator ${getStockClass(product.id)}">
                ${inventory[product.id].currentStock} remaining
            </div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-meta">
                    <span class="product-category">${product.category}</span>
                    <span class="product-stock">${product.initialStock} in stock</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="card-button add-to-cart" 
                        data-product-id="${product.id}"
                        ${inventory[product.id].currentStock < 1 ? 'disabled' : ''}>
                        ${inventory[product.id].currentStock < 1 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => addToCart(parseInt(button.dataset.productId)));
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || inventory[productId].currentStock < 1) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity >= inventory[productId].currentStock) return;
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    inventory[productId].currentStock--;
    updateInventoryStorage();
    updateCartStorage();
    renderProducts(products);
}

function updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateInventoryStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Cart System
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span class="item-name">${item.name}</span>
            <div class="item-controls">
                <input type="number" value="${item.quantity}" min="1" 
                    data-product-id="${item.id}" class="item-qty">
                <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-product-id="${item.id}">&times;</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
    addCartEventListeners();
}

function addCartEventListeners() {
    document.querySelectorAll('.item-qty').forEach(input => {
        input.addEventListener('change', handleQuantityChange);
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
}

function handleQuantityChange(e) {
    const productId = parseInt(e.target.dataset.productId);
    const newQty = parseInt(e.target.value);
    const cartItem = cart.find(item => item.id === productId);
    
    if (newQty > cartItem.quantity) {
        const needed = newQty - cartItem.quantity;
        if (inventory[productId].currentStock >= needed) {
            cartItem.quantity = newQty;
            inventory[productId].currentStock -= needed;
        }
    } else {
        const returned = cartItem.quantity - newQty;
        cartItem.quantity = newQty;
        inventory[productId].currentStock += returned;
    }

    updateCartStorage();
    updateInventoryStorage();
    renderProducts(products);
    updateCartDisplay();
}

function handleRemoveItem(e) {
    const productId = parseInt(e.target.dataset.productId);
    const index = cart.findIndex(item => item.id === productId);
    const [removedItem] = cart.splice(index, 1);
    inventory[productId].currentStock += removedItem.quantity;
    
    updateCartStorage();
    updateInventoryStorage();
    renderProducts(products);
    updateCartDisplay();
}

// Admin Panel
function initializeAdminPanel() {
    const adminHTML = `
        <div class="admin-panel">
            <h4>Inventory Management</h4>
            <div id="restock-controls"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', adminHTML);

    products.forEach(product => {
        const control = document.createElement('div');
        control.className = 'restock-control';
        control.innerHTML = `
            <span>${product.name}</span>
            <input type="number" value="0" min="0" 
                data-product-id="${product.id}" class="restock-qty">
            <button class="restock-btn" data-product-id="${product.id}">Restock</button>
        `;
        document.getElementById('restock-controls').appendChild(control);
    });

    document.querySelectorAll('.restock-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.productId);
            const input = button.previousElementSibling;
            const amount = parseInt(input.value);
            if (amount > 0) restockProduct(productId, amount);
            input.value = '';
        });
    });
}

function restockProduct(productId, amount) {
    inventory[productId].currentStock = Math.min(
        inventory[productId].initialStock,
        inventory[productId].currentStock + amount
    );
    updateInventoryStorage();
    renderProducts(products);
}

// Helpers
function handleLoadError(containerId, type) {
    console.error(`Error loading ${type}:`, error);
    document.getElementById(containerId).innerHTML = 
        `<p class="error-message">Failed to load ${type}. Please try again later.</p>`;
}

function getStockClass(productId) {
    return inventory[productId].currentStock > 0 ? 'in-stock' : 'out-of-stock';
}

function handleRegistration(eventId) {
    console.log(`Registering for event ${eventId}`);
    alert(`Registration for event ${eventId} would be processed here!`);
}

// Event Listeners
document.getElementById('cart-icon').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'block';
    updateCartDisplay();
});

document.querySelector('.cart-close').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});