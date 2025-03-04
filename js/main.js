import { EventManager } from './managers/eventManager.js';
import { ProductManager } from './managers/productManager.js';
import { CartManager } from './managers/cartManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([
            EventManager.initialize(),
            ProductManager.initialize()
        ]);
        
        new CartManager();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});