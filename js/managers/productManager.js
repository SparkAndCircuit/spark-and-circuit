import { DataHelpers, DOMHelpers } from '../lib/helpers.js';
import { CartManager } from './cartManager.js';

export class ProductManager {
    static products = [];

    static async initialize() {
        try {
            this.products = await DataHelpers.fetchData('../data/products.json');
            this.initializeInventory();
            this.renderProducts();
            this.initAdminPanel();
        } catch (error) {
            this.handleError('products-container', error);
        }
    }

    static initializeInventory() {
        this.products.forEach(product => {
            if (!CartManager.inventory[product.id]) {
                CartManager.inventory[product.id] = {
                    currentStock: product.currentStock,
                    initialStock: product.initialStock
                };
            }
        });
        DataHelpers.persistData('inventory', CartManager.inventory);
    }

    static renderProducts() {
        const container = DOMHelpers.qs('#products-container');
        container.innerHTML = this.products.map(product => `
            <div class="card product-card">
                <div class="stock-indicator ${this.getStockClass(product.id)}">
                    ${CartManager.inventory[product.id].currentStock} remaining
                </div>
                <img src="../${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-meta">
                        <span class="product-category">${product.category}</span>
                        <span class="product-stock">${product.initialStock} in stock</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="btn btn--gold add-to-cart" 
                            data-product-id="${product.id}"
                            ${CartManager.inventory[product.id].currentStock < 1 ? 'disabled' : ''}>
                            ${CartManager.inventory[product.id].currentStock < 1 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    static getStockClass(productId) {
        return CartManager.inventory[productId].currentStock > 0 ? 'in-stock' : 'out-of-stock';
    }

    static initAdminPanel() {
        const panel = DOMHelpers.createElement('div', 'admin-panel', `
            <h4>Inventory Management</h4>
            <div id="restock-controls"></div>
        `);
        
        this.products.forEach(product => {
            panel.querySelector('#restock-controls').appendChild(
                DOMHelpers.createElement('div', 'restock-control', `
                    <span>${product.name}</span>
                    <input type="number" min="0" class="restock-qty" data-id="${product.id}">
                    <button class="btn btn--gold restock-btn" data-id="${product.id}">Restock</button>
                `)
            );
        });

        document.body.appendChild(panel);
        this.initRestockHandlers();
    }

    static initRestockHandlers() {
        DOMHelpers.qsa('.restock-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.id;
                const input = DOMHelpers.qs(`.restock-qty[data-id="${productId}"]`);
                const amount = parseInt(input.value);
                
                if (amount > 0) {
                    CartManager.inventory[productId].currentStock = Math.min(
                        CartManager.inventory[productId].initialStock,
                        CartManager.inventory[productId].currentStock + amount
                    );
                    DataHelpers.persistData('inventory', CartManager.inventory);
                    this.renderProducts();
                    input.value = '';
                }
            });
        });
    }

    static handleError(containerId, error) {
        console.error('Product error:', error);
        DOMHelpers.qs(`#${containerId}`).innerHTML = `
            <p class="error-message">Failed to load products. Please try again later.</p>
        `;
    }
}