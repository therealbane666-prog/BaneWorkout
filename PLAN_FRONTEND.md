# 📝 WorkoutBrothers - Plan d'Action Frontend

Feuille de route pour développer l'interface client e-commerce.

---

## 🎯 Objectif

Créer une application web moderne et responsive pour la boutique WorkoutBrothers qui reflète l'identité militaire/tactique tout en restant accessible et professionnelle.

---

## 🎨 Identité Visuelle

### Thème WorkoutBrothers
- **Couleurs principales:**
  - Noir mat (#1a1a1a) - Base
  - Vert militaire (#4a5f4a) - Accents
  - Orange tactique (#ff6b35) - CTA et highlights
  - Gris anthracite (#2d2d2d) - Cartes et sections

- **Typographie:**
  - Titres: Police militaire/stencil (ex: Oswald, Bebas Neue)
  - Corps: Police lisible (ex: Roboto, Inter)

- **Style:**
  - Design épuré, militaire moderne
  - Grille structurée, angles droits
  - Photos haute qualité sur fond sombre
  - Icons tactiques/minimalistes

### Inspirations
- Shopify store existant: baneworkout.fr
- Style: 5.11 Tactical, Rogue Fitness, Crossfit
- Logo: Personnage masqué (inspiration du visuel existant)

---

## 🏗️ Architecture Frontend Recommandée

### Option 1: React + Vite (Recommandé)
```bash
npm create vite@latest workoutbrothers-client -- --template react
cd workoutbrothers-client
npm install
npm install react-router-dom axios stripe @stripe/react-stripe-js
npm install tailwindcss postcss autoprefixer -D
```

### Option 2: Vue.js + Vite
```bash
npm create vite@latest workoutbrothers-client -- --template vue
cd workoutbrothers-client
npm install
npm install vue-router axios @stripe/stripe-js
npm install tailwindcss postcss autoprefixer -D
```

### Option 3: Next.js (SSR pour SEO)
```bash
npx create-next-app@latest workoutbrothers-client
cd workoutbrothers-client
npm install axios @stripe/stripe-js
```

---

## 📱 Pages à Développer

### 1. Page d'Accueil
**URL:** `/`

**Sections:**
- Hero avec slogan: "Préparation Physique & Mentale"
- Mise en avant des 3 catégories (Tactique, Nutrition, Sport)
- Produits phares / Nouveautés
- Accès rapide au générateur d'entraînement
- Valeurs de la marque (Robustesse, Performance, Autonomie)
- Newsletter signup
- Témoignages

**Éléments clés:**
- Video ou animation du personnage masqué
- Call-to-action évidents
- Design immersif militaire

### 2. Catalogue Produits
**URL:** `/boutique` ou `/shop`

**Fonctionnalités:**
- Grille de produits responsive (3-4 colonnes desktop, 1-2 mobile)
- Filtres par catégorie:
  - Équipement Tactique
  - Nutrition & Suppléments
  - Équipement Sport
- Tri: Prix, Popularité, Nouveautés
- Barre de recherche
- Pagination ou infinite scroll
- Badges: "Nouveau", "Stock limité", "Best-seller"

**API Endpoints utilisés:**
```
GET /api/products?category=...&search=...&sortBy=...&page=...
GET /api/categories
```

### 3. Page Produit Détaillée
**URL:** `/produit/:id`

**Sections:**
- Galerie photos (principale + miniatures)
- Nom et prix du produit
- Description détaillée
- Caractéristiques techniques
- Avis clients et notes
- Quantité et ajout au panier
- Produits similaires
- Badges de qualité/certification

**API Endpoints:**
```
GET /api/products/:id
POST /api/products/:id/reviews (authentifié)
```

### 4. Panier
**URL:** `/panier` ou `/cart`

**Fonctionnalités:**
- Liste des articles avec images
- Modification quantité
- Suppression d'articles
- Calcul total en temps réel
- Bouton "Vider le panier"
- Estimation frais de port
- Code promo/réduction
- Bouton "Commander"

**API Endpoints:**
```
GET /api/cart (authentifié)
POST /api/cart/items (authentifié)
PUT /api/cart/items/:id (authentifié)
DELETE /api/cart/items/:id (authentifié)
DELETE /api/cart (authentifié)
```

### 5. Processus de Commande
**URL:** `/checkout`

**Étapes:**
1. Informations de livraison
2. Méthode de paiement
3. Récapitulatif
4. Confirmation

**Intégration Stripe:**
- Formulaire carte bancaire sécurisé
- 3D Secure
- Confirmation immédiate

**API Endpoints:**
```
POST /api/orders (authentifié)
POST /api/payments/create-intent (authentifié)
POST /api/payments/confirm (authentifié)
```

### 6. Compte Utilisateur
**URL:** `/compte` ou `/account`

**Sections:**
- Profil et informations
- Historique des commandes
- Suivi des expéditions
- Adresses enregistrées
- Préférences

**API Endpoints:**
```
GET /api/orders (authentifié)
GET /api/orders/:id (authentifié)
```

### 7. Authentification
**URL:** `/connexion` `/inscription`

**Fonctionnalités:**
- Formulaire login/register
- Validation en temps réel
- Gestion des erreurs
- Redirection après connexion

**API Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
```

### 8. Générateur d'Entraînement
**URL:** `/generateur` ou `/training`

**Intégration:**
- Reprendre le fichier `workout-generator.html` existant
- L'intégrer dans le design de la boutique
- Même branding et navigation
- Sauvegarder les programmes (si connecté)

**Amélioration:**
- Option d'imprimer/télécharger le programme
- Partage sur réseaux sociaux
- Programmes sauvegardés dans le compte

### 9. À Propos / Histoire
**URL:** `/a-propos`

**Contenu:**
- Histoire de WorkoutBrothers
- Philosophie: préparation physique et mentale
- Engagement qualité
- Partenaires
- Contact

### 10. Pages Légales
**URLs:** `/cgv` `/mentions-legales` `/politique-confidentialite`

**Contenu:**
- Conditions générales de vente
- Mentions légales
- Politique de confidentialité (RGPD)
- Politique de retour

---

## 🔧 Composants Réutilisables

### Composants UI Essentiels

1. **Navbar**
   - Logo WorkoutBrothers
   - Menu: Boutique, Générateur, À Propos
   - Barre de recherche
   - Icons: Panier (avec badge), Compte

2. **Footer**
   - Links rapides
   - Catégories
   - Newsletter
   - Réseaux sociaux
   - Paiements acceptés

3. **ProductCard**
   - Image
   - Nom
   - Prix
   - Note/Avis
   - Bouton "Ajouter au panier"
   - Badge (nouveau, promo, etc.)

4. **CartItem**
   - Image miniature
   - Nom produit
   - Prix unitaire
   - Sélecteur quantité
   - Bouton supprimer
   - Total

5. **ReviewCard**
   - Avatar utilisateur
   - Nom
   - Note (étoiles)
   - Date
   - Commentaire

6. **CategoryCard**
   - Image catégorie
   - Nom
   - Description courte
   - Lien vers catalogue filtré

---

## 🎨 Design System

### Couleurs

```css
:root {
  /* Primaires */
  --black: #1a1a1a;
  --military-green: #4a5f4a;
  --tactical-orange: #ff6b35;
  --gray-dark: #2d2d2d;
  
  /* Secondaires */
  --gray-medium: #4a4a4a;
  --gray-light: #e5e5e5;
  --white: #ffffff;
  
  /* Status */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Typographie

```css
/* Headings */
h1 { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; }
h2 { font-family: 'Bebas Neue', sans-serif; font-size: 2.25rem; }
h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.75rem; }

/* Body */
body { font-family: 'Roboto', sans-serif; font-size: 1rem; }
```

### Boutons

```css
/* Primary CTA */
.btn-primary {
  background: var(--tactical-orange);
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Secondary */
.btn-secondary {
  background: var(--military-green);
  color: white;
}

/* Outline */
.btn-outline {
  border: 2px solid var(--tactical-orange);
  color: var(--tactical-orange);
  background: transparent;
}
```

---

## 📦 Intégration API

### Configuration Axios

```javascript
// api/config.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Services API

```javascript
// api/products.js
import api from './config';

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getCategories = () => api.get('/categories');

// api/cart.js
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/items', data);
export const updateCartItem = (id, data) => api.put(`/cart/items/${id}`, data);
export const removeFromCart = (id) => api.delete(`/cart/items/${id}`);

// api/auth.js
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// api/orders.js
export const getOrders = () => api.get('/orders');
export const createOrder = (data) => api.post('/orders', data);
export const getOrder = (id) => api.get(`/orders/${id}`);
```

---

## 🚀 Déploiement Frontend

### Options recommandées

1. **Vercel** (Recommandé pour React/Next.js)
   - Déploiement automatique depuis GitHub
   - CDN global
   - HTTPS gratuit
   - Plan gratuit généreux

2. **Netlify**
   - Simple et rapide
   - Plan gratuit
   - CI/CD intégré

3. **Heroku** (même serveur que le backend)
   - Tout centralisé
   - Plus simple pour gérer

### Configuration CORS

Dans `backend/index.js`, configurer CORS:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

---

## 📊 Métriques à Suivre

### Analytics
- Google Analytics ou Plausible
- Suivi des conversions
- Pages les plus visitées
- Abandons de panier

### Performances
- Lighthouse score > 90
- Temps de chargement < 3s
- Core Web Vitals

---

## ✅ Checklist Développement

### Phase 1: MVP (2-3 semaines)
- [ ] Setup projet frontend (React/Vue/Next)
- [ ] Design system et composants de base
- [ ] Page d'accueil
- [ ] Catalogue produits avec filtres
- [ ] Page produit détaillée
- [ ] Authentification (login/register)
- [ ] Panier fonctionnel
- [ ] Intégration API complète

### Phase 2: E-commerce Complet (2-3 semaines)
- [ ] Processus checkout
- [ ] Intégration Stripe
- [ ] Compte utilisateur
- [ ] Historique commandes
- [ ] Intégration générateur d'entraînement
- [ ] Pages légales
- [ ] Responsive mobile

### Phase 3: Optimisation (1-2 semaines)
- [ ] SEO (meta tags, sitemap)
- [ ] Optimisation performances
- [ ] Tests utilisateurs
- [ ] Analytics
- [ ] PWA (Progressive Web App)

### Phase 4: Lancement (1 semaine)
- [ ] Tests finaux
- [ ] Déploiement production
- [ ] Configuration domaine
- [ ] Monitoring erreurs

---

## 💰 Budget Estimé

### Développement
- Freelance développeur: 2000-5000€
- Ou DIY avec templates: 100-300€

### Design
- Logo professionnel: 200-500€
- Photos produits: 500-1000€ (ou Unsplash/Pexels gratuit)

### Services
- Hébergement frontend: Gratuit (Vercel/Netlify)
- Domaine: 10-15€/an

**Total estimé: 500-1500€** (si fait soi-même avec template)
**Total avec freelance: 3000-7000€**

---

## 🎯 Quick Wins pour Démarrer

### Pendant que le frontend se développe:

1. **Utiliser le workout-generator.html existant**
   - Déjà fonctionnel
   - Rebrand complet ✅
   - Peut être utilisé standalone

2. **Créer une landing page simple**
   - HTML/CSS basique
   - Présente l'offre
   - Lien vers API pour commandes directes

3. **Utiliser un template e-commerce**
   - Themeforest, Creative Tim
   - Adapter aux couleurs WorkoutBrothers
   - Connecter à l'API

4. **No-code temporaire**
   - Shopify/WooCommerce en attendant
   - Migrer ensuite vers solution custom

---

## 📞 Ressources Utiles

### Templates E-commerce React
- https://themeforest.net/category/site-templates/ecommerce/react
- https://www.creative-tim.com/templates/react
- https://mui.com/store/collections/templates/

### UI Kits
- Tailwind UI: https://tailwindui.com/
- Material-UI: https://mui.com/
- Chakra UI: https://chakra-ui.com/

### Icons
- Heroicons: https://heroicons.com/
- Font Awesome: https://fontawesome.com/
- Tactical Icons: https://www.flaticon.com/packs/military

### Images Gratuites
- Unsplash: https://unsplash.com/s/photos/tactical
- Pexels: https://www.pexels.com/search/military/
- Pixabay: https://pixabay.com/

---

**WorkoutBrothers - Préparation Physique & Mentale**

*Document créé: Janvier 2026*
