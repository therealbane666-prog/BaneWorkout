# 💪 WorkoutBrothers - Plateforme Fitness E-Commerce

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout)

**👆 Cliquez le bouton ci-dessus pour déployer votre boutique en 1 clic!**

---

## 📋 À propos

**BaneWorkout** (WorkoutBrothers) est une plateforme fitness complète combinant :
- 🛒 **E-commerce** : Boutique en ligne avec système de paiement Stripe
- 🏋️ **Générateur d'entraînements** : Programmes personnalisés selon vos objectifs
- 👤 **Gestion utilisateurs** : Authentification JWT, profils, historique

## 📊 Situation Business

**📄 [Voir le document complet de situation business](./SITUATION_BUSINESS.md)**

Ce document contient :
- Vue d'ensemble du business model
- Analyse technique et fonctionnalités
- Projections financières
- Plan d'action détaillé
- KPIs à suivre

## 🚀 Démarrage rapide

### Option 1 : Déploiement One-Click (Recommandé)

1. Cliquez sur le bouton Deploy ci-dessus
2. Configurez vos variables d'environnement sur Heroku
3. Votre application sera en ligne en quelques minutes !

### Option 2 : Installation locale

```bash
# Cloner le repository
git clone https://github.com/therealbane666-prog/BaneWorkout.git
cd BaneWorkout

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos configurations

# Démarrer le serveur
npm start
```

## 🛠️ Stack technique

- **Backend** : Node.js, Express.js
- **Database** : MongoDB (Mongoose)
- **Authentification** : JWT (JSON Web Tokens)
- **Paiements** : Stripe
- **Déploiement** : Heroku, Railway

## 🎯 Fonctionnalités

### ✅ Implémenté

- Authentification complète (register/login)
- Gestion de produits (CRUD)
- Système de panier d'achat
- Gestion des commandes
- Intégration Stripe (paiements + webhooks)
- Système de notation et avis
- Générateur d'entraînements personnalisés
- API RESTful complète

### 🔄 En développement

- Interface frontend client (React/Vue)
- Dashboard admin
- Application mobile
- Programme de coaching

## 📚 Documentation API

### Authentification

```
POST /api/auth/register - Inscription
POST /api/auth/login - Connexion
```

### Produits

```
GET    /api/products - Liste des produits
GET    /api/products/:id - Détails d'un produit
POST   /api/products - Créer un produit (auth requis)
PUT    /api/products/:id - Modifier un produit (auth requis)
DELETE /api/products/:id - Supprimer un produit (auth requis)
POST   /api/products/:id/reviews - Ajouter un avis (auth requis)
```

### Panier

```
GET    /api/cart - Voir le panier (auth requis)
POST   /api/cart/items - Ajouter au panier (auth requis)
PUT    /api/cart/items/:id - Modifier quantité (auth requis)
DELETE /api/cart/items/:id - Retirer du panier (auth requis)
DELETE /api/cart - Vider le panier (auth requis)
```

### Commandes

```
GET  /api/orders - Liste des commandes (auth requis)
GET  /api/orders/:id - Détails d'une commande (auth requis)
POST /api/orders - Créer une commande (auth requis)
PUT  /api/orders/:id/status - Mettre à jour le statut (auth requis)
```

### Paiements

```
POST /api/payments/create-intent - Créer une intention de paiement
POST /api/payments/confirm - Confirmer un paiement
POST /api/payments/webhook - Webhook Stripe
```

## 🔧 Configuration

### Variables d'environnement requises

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=5000
NODE_ENV=production
```

## 📦 Structure du projet

```
BaneWorkout/
├── backend/
│   ├── index.js          # API principale
│   └── .env.example      # Template de configuration
├── workout-generator.html # Générateur d'entraînements
├── package.json          # Dépendances Node.js
├── app.json             # Configuration Heroku
├── railway.json         # Configuration Railway
├── Procfile            # Process Heroku
├── README.md           # Ce fichier
└── SITUATION_BUSINESS.md # Analyse business complète
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

ISC License

## 📞 Support

Pour toute question ou problème :
- 📧 Ouvrir une issue sur GitHub
- 📖 Consulter [SITUATION_BUSINESS.md](./SITUATION_BUSINESS.md)

---

**Prochaine étape** : Déployez votre application en cliquant sur le bouton Deploy ci-dessus ! 🚀
