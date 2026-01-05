# 💪 WorkoutBrothers - Plateforme E-Commerce 100% Autonome

🌐 **Site:** https://baneworkout.com  
🎨 **Thème:** Militaire, Tactique, Robuste  
🤖 **IA:** Agent intégré pour gestion automatique

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout)

---

## 🚀 Déploiement Rapide (10 minutes)

**Option 1: Railway (Recommandé)**
1. Cliquez sur le bouton "Deploy on Railway" ci-dessus
2. Configurez les variables d'environnement (voir ci-dessous)
3. Déployez!

**Option 2: Guide Complet**
Suivez le guide détaillé: [DEPLOIEMENT_RAPIDE.md](./DEPLOIEMENT_RAPIDE.md)

---

## ✨ Fonctionnalités

### 🛒 E-Commerce Complet
- ✅ Gestion des produits (CRUD complet)
- ✅ Panier d'achat intelligent
- ✅ Système de commandes
- ✅ Paiements Stripe sécurisés
- ✅ Gestion du stock en temps réel
- ✅ Système d'avis et de notes

### 🤖 Agent IA Autonome
- ✅ Support client automatique 24/7
- ✅ Recommandations produits personnalisées
- ✅ Gestion intelligente du stock
- ✅ Pricing dynamique
- ✅ Analyse de tendances
- ✅ Notifications personnalisées

### 🔒 Sécurité Maximale
- ✅ Authentification JWT
- ✅ Helmet.js pour headers sécurisés
- ✅ Rate limiting (protection DDoS)
- ✅ CORS configuré
- ✅ Mots de passe hashés (bcrypt)
- ✅ Validation des données

### 📊 Dashboard Admin
- ✅ Statistiques temps réel
- ✅ Rapports de ventes
- ✅ Gestion des commandes
- ✅ Suivi du stock
- ✅ Insights IA

### 📧 Automatisation
- ✅ Emails de confirmation automatiques
- ✅ Rapports hebdomadaires
- ✅ Surveillance stock quotidienne
- ✅ Notifications personnalisées
- ✅ Optimisation prix automatique

---

## 🎨 Branding WorkoutBrothers

**Identité:**
- **Nom:** WorkoutBrothers
- **Slogan:** Préparation Physique & Mentale
- **Style:** Militaire, tactique, robuste, professionnel

**Couleurs:**
- **Primaire:** `#1a1a1a` (Noir mat)
- **Secondaire:** `#4a5f4a` (Vert militaire)
- **Accent:** `#ff6b35` (Orange tactique)

**Logo:** Personnage masqué avec haltères

---

## 📦 Installation Locale

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

# Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos valeurs

# Démarrer le serveur
npm start

# Développement avec auto-reload
npm run dev
```

---

## ⚙️ Variables d'Environnement

### Obligatoires
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/workoutbrothers
JWT_SECRET=votre_secret_jwt_32_caracteres_minimum
NODE_ENV=production
```

### Optionnelles
```bash
# Domaine personnalisé
DOMAIN=baneworkout.com

# Stripe (Paiements)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=votre@email.com
EMAIL_PASSWORD=votre_mot_de_passe_app

# OpenAI (Agent IA)
OPENAI_API_KEY=sk-...

# Port (par défaut: 5000)
PORT=5000
```

---

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (auth)
- `PUT /api/products/:id` - Modifier un produit (auth)
- `DELETE /api/products/:id` - Supprimer un produit (auth)
- `POST /api/products/:id/reviews` - Ajouter un avis (auth)

### Panier
- `GET /api/cart` - Voir le panier (auth)
- `POST /api/cart/items` - Ajouter au panier (auth)
- `PUT /api/cart/items/:id` - Modifier quantité (auth)
- `DELETE /api/cart/items/:id` - Retirer du panier (auth)
- `DELETE /api/cart` - Vider le panier (auth)

### Commandes
- `GET /api/orders` - Mes commandes (auth)
- `GET /api/orders/:id` - Détails commande (auth)
- `POST /api/orders` - Créer une commande (auth)
- `PUT /api/orders/:id/status` - Modifier statut (admin)

### Paiements
- `POST /api/payments/create-intent` - Créer intention paiement (auth)
- `POST /api/payments/confirm` - Confirmer paiement (auth)
- `POST /api/payments/webhook` - Webhook Stripe

### Agent IA
- `POST /api/agent/chat` - Chat avec l'agent (auth)
- `GET /api/agent/recommendations` - Recommandations (auth)
- `GET /api/agent/inventory` - Rapport stock (admin)
- `GET /api/agent/insights` - Insights IA (admin)

### Admin
- `GET /api/admin/stats` - Statistiques dashboard (auth)

### Utilitaires
- `GET /api/health` - Santé du serveur
- `GET /api/categories` - Liste des catégories

---

## 🧪 Tests

### Test Pré-Déploiement
```bash
node tests/deployment-check.js
```

Ce script vérifie:
- ✅ Fichiers requis présents
- ✅ Configuration correcte
- ✅ Pas de références à l'ancien branding
- ✅ Syntaxe JSON valide
- ✅ Dépendances installées

### Tests Unitaires (à venir)
```bash
npm test
```

---

## 🌐 Configuration Domaine Personnalisé

Consultez le guide complet: [DEPLOIEMENT_DOMAINE.md](./DEPLOIEMENT_DOMAINE.md)

**Résumé rapide (Railway):**
1. Dans Railway: Settings → Networking → Custom Domain
2. Ajouter: `baneworkout.com`
3. Configurer DNS chez votre registrar:
   ```
   Type: CNAME
   Name: @
   Value: [votre-app].railway.app
   ```
4. SSL automatique via Let's Encrypt

---

## 📁 Structure du Projet

```
BaneWorkout/
├── backend/
│   ├── index.js              # Serveur principal Express
│   ├── ai-agent.js           # Agent IA autonome
│   ├── scheduled-jobs.js     # Tâches automatisées (cron)
│   └── .env.example          # Template variables d'environnement
├── frontend/
│   └── index.html            # Interface utilisateur
├── tests/
│   └── deployment-check.js   # Tests pré-déploiement
├── .gitignore                # Fichiers à ignorer
├── app.json                  # Config Heroku
├── railway.json              # Config Railway
├── render.yaml               # Config Render
├── Procfile                  # Config processus
├── package.json              # Dépendances Node.js
├── README.md                 # Documentation (ce fichier)
├── DEPLOIEMENT_RAPIDE.md     # Guide déploiement 10 min
├── DEPLOIEMENT_DOMAINE.md    # Guide configuration domaine
└── workout-generator.html    # Générateur d'entraînement
```

---

## 🔄 Tâches Automatisées

### Quotidien
- **8h00:** Vérification stock (alertes si <10 unités)
- **00h00:** Optimisation des prix
- **10h00:** Envoi notifications personnalisées
- **02h00:** Nettoyage base de données

### Hebdomadaire
- **Lundi 9h00:** Rapport hebdomadaire + insights IA
- **Dimanche 20h00:** Analyse inventaire

### Mensuel
- **1er du mois 9h00:** Rapport performance mensuel

### Horaire
- **Chaque heure:** Health check système

---

## 🛠️ Développement

### Structure Backend

Le serveur Express (`backend/index.js`) inclut:
- Configuration sécurité (Helmet, CORS, Rate Limiting)
- Routes API RESTful
- Authentification JWT
- Intégration Stripe
- Endpoints Agent IA
- Graceful shutdown

### Agent IA

L'agent IA (`backend/ai-agent.js`) fournit:
- Support client automatique
- Recommandations personnalisées
- Gestion stock intelligente
- Pricing dynamique
- Analyse de tendances

### Scheduled Jobs

Les tâches automatisées (`backend/scheduled-jobs.js`):
- Surveillance stock
- Rapports automatiques
- Optimisation prix
- Notifications
- Health checks

---

## 📊 Modèles de Données

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  image: String,
  rating: Number,
  reviews: [{
    userId: String,
    username: String,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    productName: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  status: String, // 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
  shippingAddress: Object,
  paymentMethod: String,
  stripePaymentIntentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifiez `MONGODB_URI` dans `.env`
- Vérifiez que MongoDB est accessible
- Vérifiez les logs: `npm start`

### Erreur de connexion MongoDB
- Vérifiez la chaîne de connexion
- Vérifiez Network Access dans MongoDB Atlas (0.0.0.0/0)
- Vérifiez Database User credentials

### Stripe ne fonctionne pas
- Les clés Stripe sont optionnelles
- Vérifiez `STRIPE_SECRET_KEY` et `STRIPE_PUBLIC_KEY`
- Testez avec clés de test (`sk_test_...`)

### CORS error
- Vérifiez que votre domaine est dans la config CORS
- Vérifiez `backend/index.js` ligne ~40

---

## 📞 Support

- **Documentation:** Lisez les guides `.md` dans le repo
- **Issues:** Ouvrez une issue sur GitHub
- **Email:** contact@baneworkout.com

---

## 📝 Licence

ISC License - Voir LICENSE pour plus de détails

---

## 🎯 Roadmap

### v1.1 (Prochainement)
- [ ] Intégration OpenAI pour agent IA avancé
- [ ] Dashboard admin React complet
- [ ] Mobile app (React Native)
- [ ] Multi-langue (FR, EN, ES)
- [ ] Programme de fidélité

### v1.2
- [ ] Analytics avancés
- [ ] Système de parrainage
- [ ] Blog intégré
- [ ] Chat live client

---

## 🙏 Contributeurs

- **Développeur Principal:** WorkoutBrothers Team
- **Agent IA:** Développé en interne
- **Design:** Style militaire/tactique custom

---

## 🎉 Remerciements

Merci d'utiliser **WorkoutBrothers**!

**💪 Préparation Physique & Mentale - baneworkout.com**

---

*Dernière mise à jour: 2024*

