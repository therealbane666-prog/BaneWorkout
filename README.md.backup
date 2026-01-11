# 💪 WorkoutBrothers - E-Commerce Platform

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout)

**👆 Cliquez le bouton ci-dessus pour déployer votre boutique en 1 clic!**

---

## 🎯 À Propos

**WorkoutBrothers** est une plateforme e-commerce professionnelle spécialisée dans :
- 🎖️ **Équipement Tactique & Paramilitaire** - Gilets, casques, bottes, sacs tactiques
- 💊 **Nutrition & Suppléments** - Protéines, BCAA, créatine, vitamines
- 🏋️ **Équipement Sport & Combat** - Kettlebells, gants de boxe, sangles TRX

### 🎨 Identité Visuelle
- **Couleurs**: Noir mat (#1a1a1a), Vert militaire (#4a5f4a), Orange tactique (#ff6b35)
- **Style**: Militaire, tactique, robuste, professionnel
- **Slogan**: "Préparation Physique & Mentale"

---

## ✨ Fonctionnalités

### 🛒 E-Commerce Complet
- ✅ Catalogue de 30 produits en 3 catégories
- ✅ Système de panier intelligent
- ✅ Gestion des commandes et paiements Stripe
- ✅ Authentification JWT sécurisée
- ✅ Avis et notes produits

### 📧 Automatisation
- ✅ **Emails automatiques** de confirmation de commande
- ✅ **Rapports hebdomadaires** (chaque lundi 9h)
- ✅ **Surveillance stock** quotidienne (8h) avec alertes
- ✅ Support multi-provider: SendGrid, Mailgun, SMTP

### 📊 Dashboard Admin
- ✅ Statistiques temps réel
- ✅ Revenus journaliers/hebdomadaires/mensuels
- ✅ Top 5 produits
- ✅ Alertes stock faible
- ✅ Commandes récentes

### 🔒 Sécurité
- ✅ Rate limiting (API: 100/15min, Auth: 5/15min, Admin: 10/15min)
- ✅ Mots de passe hashés (bcrypt)
- ✅ Tokens JWT sécurisés
- ✅ Validation des entrées
- ✅ Gestion d'erreurs robuste

---

## 🚀 Déploiement Rapide (Heroku)

### Étape 1: Cliquer sur "Deploy to Heroku"
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout)

### Étape 2: Créer un cluster MongoDB Atlas (GRATUIT)
1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un compte gratuit
3. Créer un cluster gratuit (512MB)
4. Aller dans "Database Access" → Créer un utilisateur
5. Aller dans "Network Access" → Ajouter `0.0.0.0/0` (accès depuis partout)
6. Copier la connection string: `mongodb+srv://username:password@cluster.mongodb.net/workoutbrothers`

### Étape 3: Configurer les variables d'environnement Heroku
Variables **obligatoires** :
- `MONGODB_URI`: Votre connection string MongoDB Atlas
- `JWT_SECRET`: Généré automatiquement par Heroku

Variables **optionnelles** (l'app fonctionne sans) :
- `STRIPE_SECRET_KEY`: Clé Stripe pour paiements
- `EMAIL_SERVICE`: `sendgrid`, `mailgun` ou `smtp`
- `ADMIN_EMAIL`: Email pour recevoir les rapports

### Étape 4: Déployer !
Les 30 produits seront chargés automatiquement au premier déploiement 🎉

---

## 🛠️ Installation Locale

### Prérequis
- Node.js 16+ 
- MongoDB (local ou Atlas)
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/therealbane666-prog/BaneWorkout.git
cd BaneWorkout

# Installer les dépendances
npm install

# Créer fichier .env
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos configurations

# Charger les produits
npm run seed

# Démarrer le serveur
npm start
```

Le serveur démarre sur `http://localhost:5000`

---

## 📚 API Documentation

### Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Produits

#### Lister tous les produits
```http
GET /api/products?category=Nutrition&page=1&limit=10
```

#### Obtenir un produit
```http
GET /api/products/:id
```

#### Créer un produit (authentifié)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Nouveau Produit",
  "description": "Description détaillée",
  "price": 49.99,
  "category": "Sport & Combat",
  "stock": 100
}
```

### Panier

#### Voir le panier
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Ajouter au panier
```http
POST /api/cart/items
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
POST /api/orders
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
GET /api/orders
Authorization: Bearer <token>
```

### Admin Dashboard

#### Statistiques
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

#### Déclencher rapport hebdomadaire
```http
POST /api/admin/trigger-report
Authorization: Bearer <token>
```

#### Vérifier les stocks
```http
POST /api/admin/trigger-stock-check
Authorization: Bearer <token>
```

### Utilitaire

#### Health Check
```http
GET /api/health
```

#### Catégories
```http
GET /api/categories
```

---

## 📦 Catalogue Produits

### 🎖️ Équipement Tactique & Paramilitaire (8 produits)
- Gilet Tactique Multi-Poches (89.99€)
- Casque Tactique Protection (149.99€)
- Pantalon Cargo Tactique (69.99€)
- Holster Cuisse Universel (44.99€)
- Bottes Tactiques Militaires (119.99€)
- Gants Tactiques Pro (34.99€)
- Sac à Dos Militaire 45L (99.99€)
- Ceinture Tactique Rigide (39.99€)

### 💊 Nutrition & Suppléments (8 produits)
- Protéine Whey Isolate Pro 2kg (59.99€)
- BCAA Complex 8:1:1 (34.99€)
- Créatine Monohydrate (24.99€)
- Multivitamines Militaire Complex (29.99€)
- Pre-Workout Extreme (39.99€)
- Oméga-3 Fish Oil 2000mg (27.99€)
- Barres Protéinées Combat Pack 12 (24.99€)
- Glutamine Pure 500g (29.99€)

### 🏋️ Équipement Sport & Combat (10 produits)
- Kettlebell Competition 16kg (54.99€)
- Corde à Sauter Combat Speed (19.99€)
- Sac de Frappe 120cm (129.99€)
- Gants de Boxe Pro 14oz (69.99€)
- Gilet Lesté Ajustable 20kg (89.99€)
- Bandes de Résistance Set Pro (34.99€)
- Tapis de Sol Tactique XL (39.99€)
- Chronomètre Interval Training (44.99€)
- Sangles TRX Suspension Pro (99.99€)
- Battle Rope 15m (79.99€)

---

## 🔧 Configuration

### Variables d'Environnement

#### Obligatoires
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/workoutbrothers
JWT_SECRET=your_secret_key_here
```

#### Optionnelles - Stripe
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Optionnelles - Email (SendGrid)
```env
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@workoutbrothers.com
SENDGRID_API_KEY=SG.xxx
ADMIN_EMAIL=admin@workoutbrothers.com
```

#### Optionnelles - Email (Mailgun)
```env
EMAIL_SERVICE=mailgun
EMAIL_FROM=noreply@workoutbrothers.com
MAILGUN_API_KEY=key-xxx
MAILGUN_DOMAIN=mg.workoutbrothers.com
ADMIN_EMAIL=admin@workoutbrothers.com
```

#### Optionnelles - Email (SMTP)
```env
EMAIL_SERVICE=smtp
EMAIL_FROM=noreply@workoutbrothers.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_password
ADMIN_EMAIL=admin@workoutbrothers.com
```

---

## 🕐 Tâches Planifiées

### Rapport Hebdomadaire
- **Quand**: Chaque lundi à 9h00 (Europe/Paris)
- **Contenu**: 
  - Nombre de commandes
  - Revenus de la semaine
  - Nouveaux clients
  - Top 5 produits
  - Alertes stock

### Surveillance Stock
- **Quand**: Chaque jour à 8h00 (Europe/Paris)
- **Action**: Envoie email si stock < 10 unités
- **Exclut**: Produits avec stock illimité (≥999)

---

## 🤝 Support & Contribution

### Bugs & Suggestions
Ouvrir une [issue](https://github.com/therealbane666-prog/BaneWorkout/issues)

### Pull Requests
Les contributions sont les bienvenues !

---

## 📄 License

ISC License

---

## 🎓 Technologies Utilisées

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentification**: JWT, bcryptjs
- **Paiements**: Stripe
- **Emails**: Nodemailer (SendGrid/Mailgun/SMTP)
- **Sécurité**: express-rate-limit
- **Automatisation**: node-cron

---

**💪 WorkoutBrothers - Préparation Physique & Mentale** 🚀
