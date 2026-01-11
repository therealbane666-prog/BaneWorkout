// WorkoutBrothers - Utility Functions

// Show error message
function showError(message, elementId = 'errorMessage') {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('active');
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => errorEl.classList.remove('active'), 5000);
    }
}

// Show success message
function showSuccess(message, elementId = 'successMessage') {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.textContent = message;
        successEl.classList.add('active');
        setTimeout(() => successEl.classList.remove('active'), 3000);
    }
}

// Hide error message
function hideError(elementId = 'errorMessage') {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.classList.remove('active');
    }
}

// Hide success message
function hideSuccess(elementId = 'successMessage') {
    const successEl = document.getElementById(elementId);
    if (successEl) {
        successEl.classList.remove('active');
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Show loading spinner
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Chargement...</div>';
    }
}

// Navigate to section
function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Get token from localStorage
function getToken() {
    return localStorage.getItem('workoutbrothers_token');
}

// Set token in localStorage
function setToken(token) {
    localStorage.setItem('workoutbrothers_token', token);
}

// Remove token from localStorage
function removeToken() {
    localStorage.removeItem('workoutbrothers_token');
}

// Get user from localStorage
function getUser() {
    const userStr = localStorage.getItem('workoutbrothers_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Set user in localStorage
function setUser(user) {
    localStorage.setItem('workoutbrothers_user', JSON.stringify(user));
}

// Remove user from localStorage
function removeUser() {
    localStorage.removeItem('workoutbrothers_user');
}

// Check if user is logged in
function isLoggedIn() {
    return !!getToken();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
