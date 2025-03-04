import { DataHelpers, DOMHelpers } from '../lib/helpers.js';

export class CartManager {
    constructor() {
        this.cart = DataHelpers.retrieveData('cart') || [];
        this.init();
    }

    init() {
        this.renderCart();
        this.setupListeners();
        this.updateCartCount();
    }

    static addToCart(product) {
        const cart = DataHelpers.retrieveData('cart') || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({...product, quantity: 1});
        }
        
        DataHelpers.persistData('cart', cart);
        this.updateCartCount();
        this.renderCart();
    }

    renderCart() {
        const container = DOMHelpers.qs('#cart-items');
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <h4>${item.name}</h4>
                <div class="cart-item-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `).join('');
        
        DOMHelpers.qs('#cart-total').textContent = total.toFixed(2);
    }

    updateCartCount() {
        DOMHelpers.qs('#cart-count').textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
    }


    toggleCart() {
        const modal = DOMHelpers.qs('#cart-modal');
        modal.classList.toggle('visible');
    }

    processCheckout() {
        // Handle checkout
    }
}