// WorkoutBrothers - Authentication Module

// Initialize auth state
function initAuth() {
    updateAuthUI();
    
    // Setup auth link click handler
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn()) {
                logout();
            } else {
                navigateToSection('auth');
            }
        });
    }
    
    // Render auth forms
    renderAuthForms();
}

// Update auth UI based on login state
function updateAuthUI() {
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;
    
    if (isLoggedIn()) {
        const user = getUser();
        authLink.textContent = user ? `👤 ${user.username}` : 'Déconnexion';
    } else {
        authLink.textContent = 'Connexion';
    }
}

// Render auth forms
function renderAuthForms() {
    const authFormsContainer = document.getElementById('auth-forms');
    if (!authFormsContainer) return;
    
    if (isLoggedIn()) {
        const user = getUser();
        authFormsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <h3>Bienvenue, ${user ? user.username : 'Utilisateur'} !</h3>
                <p style="margin: 20px 0;">Vous êtes connecté.</p>
                <button class="btn-reset" onclick="logout()">Se Déconnecter</button>
            </div>
        `;
    } else {
        authFormsContainer.innerHTML = `
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="login">Connexion</button>
                <button class="auth-tab" data-tab="register">Inscription</button>
            </div>
            
            <!-- Login Form -->
            <div id="login-form" class="auth-form active">
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="login-email">Email</label>
                        <input type="email" id="login-email" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Mot de passe</label>
                        <input type="password" id="login-password" required>
                    </div>
                    <div class="error" id="login-error"></div>
                    <button type="submit" class="btn-generate">Se Connecter</button>
                </form>
            </div>
            
            <!-- Register Form -->
            <div id="register-form" class="auth-form">
                <form onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label for="register-username">Nom d'utilisateur</label>
                        <input type="text" id="register-username" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">Email</label>
                        <input type="email" id="register-email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Mot de passe</label>
                        <input type="password" id="register-password" required minlength="6">
                    </div>
                    <div class="error" id="register-error"></div>
                    <button type="submit" class="btn-generate">S'inscrire</button>
                </form>
            </div>
        `;
        
        // Setup tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                switchAuthTab(tabName);
            });
        });
    }
}

// Switch between login and register tabs
function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-form`).classList.add('active');
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    hideError('login-error');
    
    try {
        const response = await AuthAPI.login(email, password);
        
        // Save token and user info
        setToken(response.token);
        setUser(response.user);
        
        // Update UI
        updateAuthUI();
        renderAuthForms();
        
        showSuccess('Connexion réussie !');
        
        // Redirect to products
        setTimeout(() => {
            navigateToSection('products');
            loadProducts();
        }, 1000);
        
    } catch (error) {
        showError(error.message, 'login-error');
    }
}

// Handle register form submission
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    hideError('register-error');
    
    if (password.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères', 'register-error');
        return;
    }
    
    try {
        const response = await AuthAPI.register(username, email, password);
        
        // Save token and user info
        setToken(response.token);
        setUser(response.user);
        
        // Update UI
        updateAuthUI();
        renderAuthForms();
        
        showSuccess('Inscription réussie !');
        
        // Redirect to products
        setTimeout(() => {
            navigateToSection('products');
            loadProducts();
        }, 1000);
        
    } catch (error) {
        showError(error.message, 'register-error');
    }
}

// Logout
function logout() {
    removeToken();
    removeUser();
    updateAuthUI();
    renderAuthForms();
    showSuccess('Déconnexion réussie');
    navigateToSection('workout-generator');
}

// Add CSS for auth tabs
const authStyles = document.createElement('style');
authStyles.textContent = `
    .auth-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .auth-tab {
        flex: 1;
        padding: 12px;
        background: #f0f0f0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
    }
    
    .auth-tab.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    
    .auth-form {
        display: none;
    }
    
    .auth-form.active {
        display: block;
    }
`;
document.head.appendChild(authStyles);
