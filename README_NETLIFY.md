# 💪 WorkoutBrothers - Plateforme E-Commerce & Fitness

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE/deploys)

**Plateforme e-commerce professionnelle avec générateur d'entraînement personnalisé, déployée sur Netlify avec architecture serverless.**

🌐 **Domaine**: https://workoutbrothers.shop

---

## 🎯 À Propos

**WorkoutBrothers** est une plateforme complète combinant:
- 🏋️ **Générateur d'Entraînement Personnalisé** - Programmes adaptés à vos objectifs
- 🛒 **E-Commerce** - Équipement tactique, nutrition et sport
- 💳 **Paiements Stripe** - Transactions sécurisées
- 📧 **Notifications Email** - Confirmations de commande automatiques

### 🎨 Identité
- **Couleurs**: Noir mat, Vert militaire, Orange tactique
- **Style**: Militaire, tactique, robuste, professionnel
- **Slogan**: "Préparation Physique & Mentale"

---

## ✨ Fonctionnalités

### 🏋️ Générateur d'Entraînement
- ✅ Programmes personnalisés selon objectif (force, muscle, endurance, perte de poids, équilibré)
- ✅ 3 niveaux d'expérience (débutant, intermédiaire, avancé)
- ✅ Planification hebdomadaire flexible
- ✅ Base de données de 200+ exercices
- ✅ Export et téléchargement des programmes

### 🛒 E-Commerce Complet
- ✅ Catalogue de 30 produits en 3 catégories
- ✅ Système de panier intelligent
- ✅ Gestion des commandes
- ✅ Authentification JWT sécurisée
- ✅ Avis et notes produits
- ✅ Paiements Stripe (EUR)

### 📊 Dashboard Admin
- ✅ Statistiques temps réel
- ✅ Revenus journaliers/hebdomadaires/mensuels
- ✅ Top 5 produits
- ✅ Alertes stock faible
- ✅ Commandes récentes

### 🔒 Sécurité
- ✅ JWT avec validation stricte (pas de fallback)
- ✅ Mots de passe hashés (bcrypt)
- ✅ Headers de sécurité configurés
- ✅ CORS géré
- ✅ HTTPS obligatoire en production

---

## 🏗️ Architecture

### Frontend (SPA)
```
public/
├── index.html          # Page principale
├── css/
│   ├── style.css      # Styles principaux
│   └── responsive.css # Media queries
└── js/
    ├── app.js         # Application principale
    ├── api.js         # Client API
    ├── auth.js        # Authentification
    ├── products.js    # Gestion produits
    ├── cart.js        # Panier
    ├── utils.js       # Utilitaires
    └── workout-database.js  # Exercices
```

### Backend (Netlify Functions)
```
netlify/functions/
├── auth/
│   ├── register.js    # Inscription
│   └── login.js       # Connexion
├── products.js        # CRUD produits
├── cart.js           # Gestion panier
├── orders.js         # Gestion commandes
├── payments.js       # Stripe integration
├── admin.js          # Dashboard admin
└── utils.js          # Modèles MongoDB & helpers
```

---

## 🚀 Déploiement Rapide (Netlify)

### Prérequis
- Compte GitHub
- Compte Netlify
- Compte MongoDB Atlas (gratuit)
- Domaine WorkoutBrothers.shop configuré

### Étapes

1. **Fork/Clone le repository**
   ```bash
   git clone https://github.com/therealbane666-prog/BaneWorkout.git
   cd BaneWorkout
   ```

2. **Configurer MongoDB Atlas**
   - Créer un cluster gratuit M0
   - Créer un utilisateur database
   - Autoriser IP `0.0.0.0/0`
   - Copier la connection string

3. **Déployer sur Netlify**
   - Connecter le repo GitHub à Netlify
   - Build settings:
     - Build command: (vide)
     - Publish directory: `public`
     - Functions directory: `netlify/functions`

4. **Configurer les variables d'environnement**
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/workoutbrothers
   JWT_SECRET=[générer avec: openssl rand -base64 32]
   NODE_ENV=production
   ```

   Optionnel (Stripe):
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

5. **Configurer le domaine**
   - Ajouter domaine personnalisé: `workoutbrothers.shop`
   - Configurer DNS (nameservers Netlify ou records A/CNAME)
   - Activer HTTPS + Force HTTPS

📖 **Guide Complet**: Voir [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md)

---

## 🛠️ Installation Locale

### Prérequis
- Node.js 18+
- MongoDB (local ou Atlas)
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/therealbane666-prog/BaneWorkout.git
cd BaneWorkout

# Installer les dépendances
npm install

# Installer Netlify CLI
npm install -g netlify-cli

# Créer fichier .env à la racine
cp .env.example .env
# Éditer .env avec vos configurations

# Charger les produits (optionnel)
npm run seed

# Démarrer en mode développement
netlify dev
```

L'application sera accessible sur `http://localhost:8888`

---

## 📚 API Documentation

### Base URL
- **Production**: `https://workoutbrothers.shop/.netlify/functions`
- **Development**: `http://localhost:8888/.netlify/functions`

### Authentification

#### Inscription
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Connexion
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Produits

#### Lister tous les produits
```http
GET /products?category=Nutrition&page=1&limit=10
```

#### Obtenir un produit
```http
GET /products/:id
```

### Panier

#### Voir le panier
```http
GET /cart
Authorization: Bearer <token>
```

#### Ajouter au panier
```http
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "648f5a3c...",
  "quantity": 2
}
```

### Commandes

#### Créer une commande
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Rue Example",
    "city": "Paris",
    "zipCode": "75001",
    "country": "France"
  },
  "paymentMethod": "stripe"
}
```

#### Mes commandes
```http
GET /orders
Authorization: Bearer <token>
```

### Admin

#### Statistiques
```http
GET /admin/stats
Authorization: Bearer <token>
```

---

## 📦 Catalogue Produits

### 🎖️ Équipement Tactique (8 produits)
- Gilet Tactique Multi-Poches
- Casque Tactique Protection
- Pantalon Cargo Tactique
- Bottes Tactiques Militaires
- Et plus...

### 💊 Nutrition & Suppléments (8 produits)
- Protéine Whey Isolate Pro
- BCAA Complex 8:1:1
- Créatine Monohydrate
- Et plus...

### 🏋️ Équipement Sport & Combat (10 produits)
- Kettlebell Competition
- Sac de Frappe 120cm
- Gants de Boxe Pro
- Et plus...

---

## 🔧 Configuration

### Variables d'Environnement Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGODB_URI` | Connection string MongoDB | `mongodb+srv://...` |
| `JWT_SECRET` | Secret JWT (32+ caractères) | Généré aléatoirement |
| `NODE_ENV` | Environnement | `production` |

### Variables Optionnelles

#### Stripe (Paiements)
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### SendGrid (Emails)
```env
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@workoutbrothers.shop
SENDGRID_API_KEY=SG.xxxxx
ADMIN_EMAIL=admin@workoutbrothers.shop
```

---

## 🧪 Tests

### Tester l'API

```bash
# Health check
curl https://workoutbrothers.shop/.netlify/functions/products

# Créer un compte
curl -X POST https://workoutbrothers.shop/.netlify/functions/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test123456"}'
```

### Tester le Frontend

1. Ouvrir https://workoutbrothers.shop
2. Tester le générateur d'entraînement
3. Créer un compte
4. Parcourir les produits
5. Tester le panier

---

## 🔄 Migration depuis Heroku

Le projet a été entièrement converti de Express/Heroku vers Netlify Functions:

| Avant (Heroku) | Après (Netlify) |
|----------------|-----------------|
| Express monolithique | 8 Functions serverless |
| Dyno always-on | Pay-per-execution |
| `backend/index.js` | `netlify/functions/*` |
| Port binding | Serverless endpoints |
| Git deploy | GitHub auto-deploy |

Les anciens fichiers backend sont conservés dans `backend/` pour référence.

---

## 📊 Performance

### Optimisations
- ✅ Caching CSS/JS (1 an)
- ✅ MongoDB connection pooling
- ✅ Lazy loading images
- ✅ Code splitting par module
- ✅ Minification recommandée pour production

### Limites Netlify (Plan Gratuit)
- Functions: 125K invocations/mois
- Bandwidth: 100GB/mois
- Build minutes: 300 min/mois
- Function timeout: 10 secondes

---

## 🤝 Support & Contribution

### Bugs & Suggestions
Ouvrir une [issue](https://github.com/therealbane666-prog/BaneWorkout/issues)

### Pull Requests
Les contributions sont les bienvenues !

### Documentation
- [Guide de Déploiement Netlify](./NETLIFY_DEPLOYMENT_GUIDE.md)
- [Variables d'Environnement](./.env.example)

---

## 📄 License

ISC License

---

## 🎓 Technologies

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- SPA avec navigation par sections
- Fetch API pour requêtes

### Backend
- Netlify Functions (Node.js 18)
- MongoDB avec Mongoose
- JWT (jsonwebtoken)
- Bcrypt pour hash passwords
- Stripe pour paiements

### Services
- **Hosting**: Netlify
- **Database**: MongoDB Atlas
- **Paiements**: Stripe
- **Email**: SendGrid/Mailgun (optionnel)
- **DNS**: Netlify DNS

---

## 📞 Contact

- 🌐 **Site**: https://workoutbrothers.shop
- 📧 **Email**: admin@workoutbrothers.shop
- 🐛 **Issues**: [GitHub Issues](https://github.com/therealbane666-prog/BaneWorkout/issues)

---

**💪 WorkoutBrothers - Préparation Physique & Mentale** 🚀

Déployé avec ❤️ sur Netlify
