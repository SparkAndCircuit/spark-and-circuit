// Fetch and render products
fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        renderProducts(data.products);
    })
    .catch(error => console.error("Error loading products:", error));

function renderProducts(products) {
    const container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-stock">Stock: <span id="stock-${product.id}">${product.currentStock}</span></p>
                <button class="add-to-cart" id="add-${product.id}" data-id="${product.id}" ${product.currentStock === 0 ? 'disabled' : ''}>
                    ${product.currentStock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
            </div>
        </div>
    `).join('');

    // Attach event listeners to buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const productId = parseInt(button.getAttribute("data-id"));
            updateStock(productId, -1);
        });
    });
}

// Function to update stock dynamically
function updateStock(productId, change) {
    fetch('data/products.json')
        .then(response => response.json())
        .then(data => {
            let product = data.products.find(p => p.id === productId);
            if (!product) return;

            product.currentStock += change;
            if (product.currentStock < 0) product.currentStock = 0;

            // Update the stock display in the UI
            document.getElementById(`stock-${product.id}`).textContent = product.currentStock;

            // Disable button if out of stock
            const button = document.getElementById(`add-${product.id}`);
            if (product.currentStock === 0) {
                button.textContent = "Out of Stock";
                button.disabled = true;
            }
        })
        .catch(error => console.error("Error updating stock:", error));
}
