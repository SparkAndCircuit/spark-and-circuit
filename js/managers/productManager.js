export class ProductManager {
    static async initialize() {
        try {
            const products = await DataHelpers.fetchData('data/products.json');
            this.renderProducts(products);
            this.setupCartListeners();
        } catch (error) {
            console.error('Product Manager Error:', error);
        }
    }

    static renderProducts(products) {
        const container = DOMHelpers.qs('#products-container');
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-stock">${product.stock > 0 ? 
                    `${product.stock} in stock` : 
                    'Out of stock'}</p>
                <button class="cta-button add-to-cart" 
                        data-id="${product.id}"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock > 0 ? 'Add to Cart 🛒' : 'Sold Out'}
                </button>
            </div>
        `).join('');
    }

    static setupCartListeners() {
        DOMHelpers.qs('#products-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = e.target.dataset.id;
                const products = JSON.parse(localStorage.getItem('products'));
                const product = products.find(p => p.id == productId);
                CartManager.addToCart(product);
            }
        });
    }
}