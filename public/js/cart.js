// WorkoutBrothers - Cart Module

// Load and display cart
async function loadCart() {
    if (!isLoggedIn()) {
        const cartItems = document.getElementById('cart-items');
        if (cartItems) {
            cartItems.innerHTML = '<p style="text-align: center; color: #999;">Veuillez vous connecter pour voir votre panier</p>';
        }
        return;
    }
    
    showLoading('cart-items');
    
    try {
        const data = await CartAPI.get();
        displayCart(data.cart, data.total);
        updateCartCount(data.cart.items.length);
    } catch (error) {
        const cartItems = document.getElementById('cart-items');
        if (cartItems) {
            cartItems.innerHTML = `<p style="text-align: center; color: #c62828;">Erreur: ${error.message}</p>`;
        }
    }
}

// Display cart items
function displayCart(cart, total) {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartItems) return;
    
    if (!cart || !cart.items || cart.items.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">Votre panier est vide</p>';
        if (cartTotal) cartTotal.style.display = 'none';
        return;
    }
    
    cartItems.innerHTML = `
        <div class="cart-items-list">
            ${cart.items.map(item => {
                const product = item.productId;
                if (!product) return '';
                
                return `
                    <div class="cart-item" style="background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; margin-bottom: 5px;">${product.name}</div>
                            <div style="color: #666; font-size: 0.9em;">${formatCurrency(product.price)} × ${item.quantity}</div>
                            <div style="color: #667eea; font-weight: 600; margin-top: 5px;">${formatCurrency(product.price * item.quantity)}</div>
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <input type="number" value="${item.quantity}" min="1" max="${product.stock}" 
                                onchange="updateCartItemQuantity('${item._id}', this.value)"
                                style="width: 60px; padding: 5px; border: 2px solid #e0e0e0; border-radius: 5px;">
                            <button class="btn-reset" onclick="removeFromCart('${item._id}')" style="padding: 8px 12px;">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    if (totalAmount) {
        totalAmount.textContent = formatCurrency(total);
    }
    if (cartTotal) {
        cartTotal.style.display = 'block';
    }
}

// Update cart item quantity
async function updateCartItemQuantity(itemId, quantity) {
    if (!isLoggedIn()) return;
    
    quantity = parseInt(quantity);
    if (quantity < 1) return;
    
    try {
        await CartAPI.updateItem(itemId, quantity);
        await loadCart();
        showSuccess('Quantité mise à jour');
    } catch (error) {
        showError(error.message);
    }
}

// Remove item from cart
async function removeFromCart(itemId) {
    if (!isLoggedIn()) return;
    
    if (!confirm('Voulez-vous vraiment supprimer cet article du panier ?')) {
        return;
    }
    
    try {
        await CartAPI.removeItem(itemId);
        await loadCart();
        showSuccess('Article supprimé du panier');
    } catch (error) {
        showError(error.message);
    }
}

// Update cart count badge
async function updateCartCount(count = null) {
    const cartCountEl = document.getElementById('cart-count');
    if (!cartCountEl) return;
    
    if (count === null && isLoggedIn()) {
        try {
            const data = await CartAPI.get();
            count = data.cart.items.length;
        } catch (error) {
            console.error('Failed to update cart count:', error);
            count = 0;
        }
    }
    
    cartCountEl.textContent = count || 0;
}

// Checkout
async function checkout() {
    if (!isLoggedIn()) {
        showError('Veuillez vous connecter pour commander');
        navigateToSection('auth');
        return;
    }
    
    // TODO: Replace with actual shipping address form
    // This is a placeholder for demonstration purposes
    const shippingAddress = {
        street: '123 Rue Example',
        city: 'Paris',
        state: 'Île-de-France',
        zipCode: '75001',
        country: 'France'
    };
    
    try {
        const order = await OrdersAPI.create(shippingAddress, 'stripe');
        showSuccess('Commande créée avec succès !');
        await loadCart(); // Refresh cart (should be empty now)
        
        // In a real app, would redirect to payment page
        alert(`Commande #${order.order._id} créée ! Total: ${formatCurrency(order.order.totalAmount)}`);
    } catch (error) {
        showError(error.message);
    }
}

// Initialize cart module
function initCart() {
    // Update cart count on init
    if (isLoggedIn()) {
        updateCartCount();
    }
    
    // Load cart when section becomes active
    const cartSection = document.getElementById('cart');
    if (cartSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isActive = cartSection.classList.contains('active');
                    if (isActive && isLoggedIn()) {
                        loadCart();
                    }
                }
            });
        });
        
        observer.observe(cartSection, { attributes: true });
        
        // Load initially if active
        if (cartSection.classList.contains('active') && isLoggedIn()) {
            loadCart();
        }
    }
}
