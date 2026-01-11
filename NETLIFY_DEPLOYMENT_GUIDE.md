# 🚀 Guide de Déploiement Netlify - WorkoutBrothers.shop

Guide complet pour déployer WorkoutBrothers sur Netlify avec le domaine personnalisé WorkoutBrothers.shop.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration MongoDB Atlas](#configuration-mongodb-atlas)
3. [Déploiement sur Netlify](#déploiement-sur-netlify)
4. [Configuration du Domaine Personnalisé](#configuration-du-domaine-personnalisé)
5. [Variables d'Environnement](#variables-denvironnement)
6. [Configuration Stripe (Optionnel)](#configuration-stripe-optionnel)
7. [Configuration Email (Optionnel)](#configuration-email-optionnel)
8. [Tests et Vérification](#tests-et-vérification)
9. [Dépannage](#dépannage)

---

## 🎯 Prérequis

### Comptes Nécessaires:
- ✅ Compte GitHub (gratuit)
- ✅ Compte Netlify (gratuit)
- ✅ Compte MongoDB Atlas (gratuit - 512MB)
- ✅ Domaine WorkoutBrothers.shop (enregistré)

### Optionnels (pour fonctionnalités avancées):
- ⭕ Compte Stripe (paiements)
- ⭕ Compte SendGrid/Mailgun (emails)

**Temps estimé**: 20-30 minutes

---

## 📦 Configuration MongoDB Atlas

### 1. Créer un Cluster GRATUIT

1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un compte ou se connecter
3. Cliquer sur "Build a Database"
4. Sélectionner **"Shared"** (gratuit)
5. Provider: **AWS** ou **Google Cloud**
6. Région: **Europe (Ireland)** ou la plus proche
7. Cluster Tier: **M0 Sandbox (512MB - FREE)**
8. Nom du cluster: `WorkoutBrothers`
9. Cliquer sur **"Create"**
10. ⏳ Attendre 3-5 minutes

### 2. Créer un Utilisateur Database

1. Dans "Security Quickstart" ou "Database Access"
2. **Username**: `workoutadmin`
3. **Password**: Générer un mot de passe sécurisé
   - ⚠️ **COPIER ET SAUVEGARDER CE MOT DE PASSE !**
4. Cliquer sur "Create User"

### 3. Configurer l'Accès Réseau

1. Aller dans "Network Access"
2. Cliquer sur "Add IP Address"
3. Sélectionner **"Allow Access from Anywhere"**
4. IP Address: `0.0.0.0/0`
5. Cliquer sur "Confirm"

### 4. Obtenir la Connection String

1. Cliquer sur "Database" dans le menu
2. Cliquer sur **"Connect"** sur votre cluster
3. Choisir **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copier la connection string:
   ```
   mongodb+srv://workoutadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. ⚠️ **Remplacer `<password>` par votre mot de passe**
7. Ajouter le nom de la database après `.net/`:
   ```
   mongodb+srv://workoutadmin:VOTRE_PASSWORD@cluster0.xxxxx.mongodb.net/workoutbrothers?retryWrites=true&w=majority
   ```

✅ **Votre MongoDB est prêt !**

---

## 🌐 Déploiement sur Netlify

### Option A: Déploiement depuis GitHub (Recommandé)

#### 1. Connexion à Netlify
1. Aller sur [Netlify](https://www.netlify.com)
2. Se connecter avec GitHub
3. Cliquer sur **"Add new site"** → **"Import an existing project"**

#### 2. Connecter le Repository
1. Sélectionner **"GitHub"**
2. Autoriser Netlify à accéder à vos repos
3. Sélectionner le repo **therealbane666-prog/BaneWorkout**

#### 3. Configuration du Build
- **Branch to deploy**: `main` ou votre branche
- **Build command**: (laisser vide ou `echo 'No build needed'`)
- **Publish directory**: `public`
- **Functions directory**: `netlify/functions`

#### 4. Variables d'Environnement (Avant déploiement)

Cliquer sur **"Advanced"** → **"New variable"** et ajouter:

**Variables OBLIGATOIRES:**
```
MONGODB_URI = mongodb+srv://workoutadmin:PASSWORD@cluster0.xxxxx.mongodb.net/workoutbrothers?retryWrites=true&w=majority
JWT_SECRET = [générer avec: openssl rand -base64 32]
NODE_ENV = production
```

**Variables OPTIONNELLES (ajouter plus tard si besoin):**
```
STRIPE_SECRET_KEY = sk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
EMAIL_SERVICE = sendgrid
SENDGRID_API_KEY = SG....
EMAIL_FROM = noreply@workoutbrothers.shop
ADMIN_EMAIL = admin@workoutbrothers.shop
```

#### 5. Déployer
1. Cliquer sur **"Deploy site"**
2. ⏳ Attendre 2-3 minutes
3. Votre site est en ligne à: `https://random-name.netlify.app`

### Option B: Déploiement Manuel avec Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser le site
netlify init

# Déployer
netlify deploy --prod
```

---

## 🌐 Configuration du Domaine Personnalisé

### 1. Ajouter le Domaine sur Netlify

1. Aller dans **Site settings** → **Domain management**
2. Cliquer sur **"Add custom domain"**
3. Entrer: `workoutbrothers.shop`
4. Cliquer sur **"Verify"** et **"Add domain"**

### 2. Configurer les DNS

Chez votre registrar de domaine (GoDaddy, Namecheap, etc.):

#### Option A: Netlify DNS (Recommandé)
1. Sur Netlify, cliquer sur **"Set up Netlify DNS"**
2. Copier les 4 name servers fournis par Netlify
3. Chez votre registrar, remplacer les name servers par ceux de Netlify
4. ⏳ Attendre 24-48h pour propagation DNS

#### Option B: DNS Custom
Ajouter ces enregistrements DNS:

**Pour le domaine racine (workoutbrothers.shop):**
```
Type: A
Name: @
Value: 75.2.60.5 (IP de Netlify - vérifier la documentation actuelle)
```

**Pour www:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

### 3. Activer HTTPS
1. Sur Netlify, aller dans **Domain settings**
2. Sous **HTTPS**, cliquer sur **"Verify DNS configuration"**
3. Une fois vérifié, cliquer sur **"Provision certificate"**
4. ⏳ Attendre quelques minutes
5. Activer **"Force HTTPS"**

✅ **Votre domaine WorkoutBrothers.shop est maintenant configuré avec HTTPS !**

---

## 🔐 Variables d'Environnement

### Configuration sur Netlify

1. Aller dans **Site settings** → **Environment variables**
2. Cliquer sur **"Add a variable"**

### Variables Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGODB_URI` | Connection string MongoDB Atlas | `mongodb+srv://user:pass@...` |
| `JWT_SECRET` | Secret pour JWT (32+ caractères) | Générer avec `openssl rand -base64 32` |
| `NODE_ENV` | Environnement | `production` |

### Variables Optionnelles

#### Pour Stripe (Paiements)
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Pour SendGrid (Emails)
```
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@workoutbrothers.shop
SENDGRID_API_KEY=SG.xxxxx
ADMIN_EMAIL=admin@workoutbrothers.shop
```

#### Pour Mailgun (Alternative Emails)
```
EMAIL_SERVICE=mailgun
EMAIL_FROM=noreply@workoutbrothers.shop
MAILGUN_API_KEY=key-xxxxx
MAILGUN_DOMAIN=mg.workoutbrothers.shop
ADMIN_EMAIL=admin@workoutbrothers.shop
```

---

## 💳 Configuration Stripe (Optionnel)

### 1. Créer un Compte Stripe
1. Aller sur [Stripe](https://stripe.com)
2. S'inscrire (mode test gratuit)
3. Compléter la vérification du compte

### 2. Obtenir les Clés API
1. Aller dans **Developers** → **API Keys**
2. Copier:
   - **Publishable key**: `pk_live_...` (pour le frontend)
   - **Secret key**: `sk_live_...` (pour le backend)

### 3. Configurer les Webhooks
1. Aller dans **Developers** → **Webhooks**
2. Cliquer sur **"Add endpoint"**
3. URL: `https://workoutbrothers.shop/.netlify/functions/payments/webhook`
4. Sélectionner les événements:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copier le **Signing secret**: `whsec_...`

### 4. Ajouter dans Netlify
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📧 Configuration Email (Optionnel)

### Option A: SendGrid (Recommandé - 100 emails/jour gratuits)

1. Créer compte sur [SendGrid](https://sendgrid.com)
2. Aller dans **Settings** → **API Keys**
3. Créer une nouvelle clé avec accès "Mail Send"
4. Copier la clé: `SG.xxxxx`

**Dans Netlify:**
```
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@workoutbrothers.shop
SENDGRID_API_KEY=SG.xxxxx
ADMIN_EMAIL=admin@workoutbrothers.shop
```

### Option B: Mailgun (500 emails/mois gratuits)

1. Créer compte sur [Mailgun](https://mailgun.com)
2. Vérifier le domaine `workoutbrothers.shop`
3. Copier API Key et Domain

**Dans Netlify:**
```
EMAIL_SERVICE=mailgun
EMAIL_FROM=noreply@workoutbrothers.shop
MAILGUN_API_KEY=key-xxxxx
MAILGUN_DOMAIN=workoutbrothers.shop
ADMIN_EMAIL=admin@workoutbrothers.shop
```

---

## ✅ Tests et Vérification

### 1. Tester l'API

#### Health Check
```bash
curl https://workoutbrothers.shop/.netlify/functions/health
```

#### Lister les Produits
```bash
curl https://workoutbrothers.shop/.netlify/functions/products
```

### 2. Tester l'Authentification

#### Créer un Compte
```bash
curl -X POST https://workoutbrothers.shop/.netlify/functions/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

#### Se Connecter
```bash
curl -X POST https://workoutbrothers.shop/.netlify/functions/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### 3. Tester le Frontend

1. Ouvrir `https://workoutbrothers.shop`
2. Tester le générateur d'entraînement
3. Créer un compte
4. Parcourir les produits
5. Ajouter au panier
6. Tester le checkout

---

## 🔧 Dépannage

### Problème: "Application Error" ou 500

**Solutions:**
1. Vérifier les logs: Netlify Dashboard → **Functions** → Cliquer sur la function → **Logs**
2. Vérifier les variables d'environnement
3. Redéployer: **Deploys** → **Trigger deploy** → **Deploy site**

### Problème: "MongoDB connection error"

**Vérifications:**
- ✅ Connection string correcte dans `MONGODB_URI`
- ✅ Mot de passe correct (pas de `<password>`)
- ✅ IP `0.0.0.0/0` autorisée dans MongoDB Network Access
- ✅ Utilisateur créé dans MongoDB Database Access

### Problème: "CORS Error"

**Solution:**
Les headers CORS sont déjà configurés dans `netlify.toml`. Si problème persiste:
1. Vérifier que les requêtes API utilisent `/.netlify/functions/...`
2. Vérifier dans les logs Netlify

### Problème: Domaine ne fonctionne pas

**Vérifications:**
- ✅ DNS configuré correctement
- ✅ Attendre 24-48h pour propagation DNS
- ✅ Tester avec `nslookup workoutbrothers.shop`
- ✅ HTTPS activé sur Netlify

### Problème: Functions Timeout

**Solution:**
Les functions Netlify ont un timeout de 10s (gratuit) ou 26s (payant).
Pour requêtes longues:
1. Optimiser les requêtes MongoDB
2. Ajouter des index sur les collections
3. Utiliser le caching

---

## 📊 Monitoring et Performance

### Netlify Analytics
1. Activer dans **Site settings** → **Analytics**
2. Voir les métriques de trafic et performance

### MongoDB Atlas Monitoring
1. Aller dans **Monitoring** sur Atlas
2. Voir les métriques de database

### Logs Netlify Functions
1. **Functions** → Sélectionner une function
2. Voir les logs en temps réel

---

##  🚀 Optimisations de Performance

### 1. Caching
Le `netlify.toml` configure déjà le caching pour:
- CSS: 1 an
- JS: 1 an
- Assets: 1 an

### 2. Minification
Pour production, considérer:
```bash
# Minifier JS
npm install -g terser
terser public/js/*.js -o public/js/bundle.min.js

# Minifier CSS
npm install -g csso-cli
csso public/css/*.css -o public/css/bundle.min.css
```

### 3. Images
- Utiliser des formats modernes (WebP)
- Compresser les images
- Lazy loading déjà implémenté

---

## 📝 Checklist Finale

Avant de mettre en production:

- [ ] MongoDB Atlas configuré et accessible
- [ ] Toutes les variables d'environnement ajoutées
- [ ] Domaine personnalisé configuré
- [ ] HTTPS activé et force HTTPS activé
- [ ] Produits chargés dans la database (seed script)
- [ ] Tests API réussis
- [ ] Tests frontend réussis
- [ ] Stripe configuré (si paiements)
- [ ] Emails configurés (si notifications)
- [ ] Monitoring activé

---

## 🎓 Ressources

- [Documentation Netlify](https://docs.netlify.com)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com)
- [Documentation Stripe](https://stripe.com/docs)
- [Support Netlify](https://answers.netlify.com)

---

## 📞 Support

Pour questions ou problèmes:
- 📖 Consulter cette documentation
- 🐛 [Reporter un bug](https://github.com/therealbane666-prog/BaneWorkout/issues)
- 💬 [Forum Netlify](https://answers.netlify.com)

---

**💪 Félicitations ! WorkoutBrothers.shop est maintenant déployé sur Netlify !** 🎉

**Domaine**: https://workoutbrothers.shop
**Admin**: https://workoutbrothers.shop/#auth (après connexion)
**API**: https://workoutbrothers.shop/.netlify/functions/
