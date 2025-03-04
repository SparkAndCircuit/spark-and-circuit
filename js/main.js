import { EventManager } from './managers/eventManager.js';
import { ProductManager } from './managers/productManager.js';
import { CartManager } from './managers/cartManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize event and product managers first
        await Promise.all([
            EventManager.initialize(),
            ProductManager.initialize()
        ]);

        // Ensure product inventory is available before initializing CartManager
        const cartManager = new CartManager();
        console.log("CartManager initialized successfully");

    } catch (error) {
        console.error('Initialization error:', error);
    }
});