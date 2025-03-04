import { DataHelpers, DOMHelpers } from '../lib/helpers.js';
import { ProductManager } from './productManager.js';

export class CartManager {
    constructor() {
        this.cart = DataHelpers.retrieveData('cart') || [];
        this.inventory = DataHelpers.retrieveData('inventory') || {};
        this.initEventListeners();
    }

    initEventListeners() {
        DOMHelpers.qs('#cart-icon').addEventListener('click', () => this.toggleCart());
        DOMHelpers.qs('.cart-close').addEventListener('click', () => this.hideCart());
        DOMHelpers.qsa('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e.target.dataset.productId));
        });
    }

    addToCart(productId) {
        const product = ProductManager.getProduct(productId);
        if (!product || this.inventory[productId]?.currentStock < 1) return;

        const cartItem = this.cart.find(item => item.id === productId) || 
            { ...product, quantity: 0 };
        
        cartItem.quantity++;
        this.inventory[productId].currentStock--;
        
        if (!this.cart.includes(cartItem)) this.cart.push(cartItem);
        
        this.persistData();
        ProductManager.renderProducts();
        this.renderCart();
    }

    persistData() {
        DataHelpers.persistData('cart', this.cart);
        DataHelpers.persistData('inventory', this.inventory);
        DOMHelpers.qs('#cart-count').textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    renderCart() {
        const container = DOMHelpers.qs('#cart-items');
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        container.innerHTML = this.cart.length ? this.cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>
                <div class="item-controls">
                    <input type="number" value="${item.quantity}" min="1" 
                        data-id="${item.id}" class="item-qty">
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="btn btn--red remove-item" data-id="${item.id}">&times;</button>
                </div>
            </div>
        `).join('') : `<p class="empty-cart">Your cart is empty</p>`;
        
        DOMHelpers.qs('#cart-total').textContent = total.toFixed(2);
    }

    toggleCart() {
        const modal = DOMHelpers.qs('#cart-modal');
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
        this.renderCart();
    }

    hideCart() {
        DOMHelpers.qs('#cart-modal').style.display = 'none';
    }
}