document.addEventListener("DOMContentLoaded", () => {
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Products Loaded:", data); // Debugging
            renderProducts(data.products);
        })
        .catch(error => console.error('Error loading products:', error));
});

function renderProducts(products) {
    const container = document.getElementById("products-container");
    if (!container) {
        console.error("Error: products-container element not found");
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}
