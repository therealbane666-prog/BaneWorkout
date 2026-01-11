// WorkoutBrothers - Products Module

// Load and display products
async function loadProducts(params = {}) {
    const productsContainer = document.getElementById('products-list');
    if (!productsContainer) return;
    
    showLoading('products-list');
    
    try {
        const data = await ProductsAPI.getAll(params);
        displayProducts(data.products);
    } catch (error) {
        productsContainer.innerHTML = `<p style="text-align: center; color: #c62828;">Erreur lors du chargement des produits: ${error.message}</p>`;
    }
}

// Display products in grid
function displayProducts(products) {
    const productsContainer = document.getElementById('products-list');
    if (!productsContainer) return;
    
    if (!products || products.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; color: #999;">Aucun produit disponible</p>';
        return;
    }
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-placeholder" style="width: 100%; height: 200px; background: #f0f0f0; border-radius: 5px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; color: #999;">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">` : '📦'}
            </div>
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <div class="product-stock" style="color: ${product.stock > 10 ? '#4caf50' : '#ff6b35'}; font-size: 0.9em; margin-bottom: 10px;">
                ${product.stock > 0 ? `Stock: ${product.stock}` : 'Rupture de stock'}
            </div>
            <div class="product-rating" style="color: #ffc107; margin-bottom: 10px;">
                ${'⭐'.repeat(Math.round(product.rating || 0))} (${product.rating || 0})
            </div>
            <button class="btn-generate" style="width: 100%;" onclick="addToCart('${product._id}', 1)" ${product.stock === 0 ? 'disabled' : ''}>
                Ajouter au Panier
            </button>
        </div>
    `).join('');
}

// Add product to cart
async function addToCart(productId, quantity = 1) {
    if (!isLoggedIn()) {
        showError('Veuillez vous connecter pour ajouter des produits au panier');
        navigateToSection('auth');
        return;
    }
    
    try {
        await CartAPI.addItem(productId, quantity);
        showSuccess('Produit ajouté au panier !');
        updateCartCount();
    } catch (error) {
        showError(error.message);
    }
}

// Initialize products module
function initProducts() {
    // Load products when section becomes active
    const productsSection = document.getElementById('products');
    if (productsSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isActive = productsSection.classList.contains('active');
                    if (isActive) {
                        loadProducts();
                    }
                }
            });
        });
        
        observer.observe(productsSection, { attributes: true });
        
        // Load initially if active
        if (productsSection.classList.contains('active')) {
            loadProducts();
        }
    }
}
