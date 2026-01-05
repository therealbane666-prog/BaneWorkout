# 📘 Guide de Déploiement WorkoutBrothers

Guide complet pour déployer WorkoutBrothers sur Heroku en quelques minutes.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Étape 1: Créer un Cluster MongoDB Atlas](#étape-1-créer-un-cluster-mongodb-atlas)
3. [Étape 2: Déployer sur Heroku](#étape-2-déployer-sur-heroku)
4. [Étape 3: Configuration Optionnelle](#étape-3-configuration-optionnelle)
5. [Étape 4: Vérification](#étape-4-vérification)
6. [Dépannage](#dépannage)

---

## 🎯 Prérequis

### Ce dont vous avez besoin:
- ✅ Un compte GitHub (gratuit)
- ✅ Un compte Heroku (gratuit)
- ✅ Un compte MongoDB Atlas (gratuit - 512MB)

### Optionnel (pour fonctionnalités avancées):
- ⭕ Compte Stripe (pour paiements)
- ⭕ Compte SendGrid/Mailgun (pour emails)

**Temps estimé**: 10-15 minutes

---

## Étape 1: Créer un Cluster MongoDB Atlas

### 1.1 Créer un Compte
1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Cliquer sur "Try Free"
3. S'inscrire avec email ou Google

### 1.2 Créer un Cluster GRATUIT
1. Cliquer sur "Build a Database"
2. Sélectionner **"Shared"** (gratuit)
3. Sélectionner le provider: **AWS**
4. Région: **Europe (Ireland - eu-west-1)** ou la plus proche
5. Cluster Tier: **M0 Sandbox (512MB - FREE)**
6. Nom du cluster: `WorkoutBrothers` (ou laisser par défaut)
7. Cliquer sur **"Create"**
8. ⏳ Attendre 3-5 minutes que le cluster soit créé

### 1.3 Créer un Utilisateur Database
1. Une fenêtre "Security Quickstart" apparaît
2. **Username**: `workoutadmin` (ou votre choix)
3. **Password**: Cliquer sur "Autogenerate Secure Password" 
   - ⚠️ **COPIER ET SAUVEGARDER CE MOT DE PASSE !**
4. Cliquer sur "Create User"

### 1.4 Configurer l'Accès Réseau
1. Dans la même fenêtre ou dans "Network Access"
2. Cliquer sur "Add IP Address"
3. Sélectionner **"Allow Access from Anywhere"**
4. IP Address: `0.0.0.0/0` (déjà rempli)
5. Cliquer sur "Confirm"

### 1.5 Obtenir la Connection String
1. Cliquer sur "Database" dans le menu gauche
2. Cliquer sur **"Connect"** sur votre cluster
3. Choisir **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copier la connection string:
   ```
   mongodb+srv://workoutadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. ⚠️ **Remplacer `<password>` par votre mot de passe** (de l'étape 1.3)
7. Ajouter le nom de la database après `.net/`:
   ```
   mongodb+srv://workoutadmin:VOTRE_PASSWORD@cluster0.xxxxx.mongodb.net/workoutbrothers?retryWrites=true&w=majority
   ```

✅ **Votre MongoDB est prêt !**

---

## Étape 2: Déployer sur Heroku

### 2.1 Cliquer sur Deploy to Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout)

### 2.2 Configuration Heroku
1. **App name**: `workout-brothers-votreprenom` (doit être unique)
2. **Region**: Europe (si disponible)
3. Cliquer sur **"Deploy app"**... ATTENDEZ ! ⚠️

### 2.3 Configurer les Variables d'Environnement

Avant de déployer, remplir les variables:

#### ✅ Variables OBLIGATOIRES:

**MONGODB_URI**
```
mongodb+srv://workoutadmin:VOTRE_PASSWORD@cluster0.xxxxx.mongodb.net/workoutbrothers?retryWrites=true&w=majority
```
Coller votre connection string de l'Étape 1.5

**JWT_SECRET**
- Laisser la valeur auto-générée par Heroku
- Ou créer votre propre secret: `openssl rand -base64 32`

**NODE_ENV**
- Déjà défini à `production` ✅

#### ⭕ Variables OPTIONNELLES (laisser vides pour l'instant):

Ces variables ne sont pas nécessaires pour le démarrage:
- `STRIPE_SECRET_KEY`
- `EMAIL_SERVICE`
- `EMAIL_FROM`
- `ADMIN_EMAIL`
- Etc.

### 2.4 Lancer le Déploiement
1. Une fois MONGODB_URI rempli, cliquer sur **"Deploy app"**
2. ⏳ Attendre 2-3 minutes
3. Un message "Your app was successfully deployed" apparaît
4. Cliquer sur **"View"** pour ouvrir votre application

✅ **Votre application est déployée !**

### 2.5 Vérification Post-Déploiement

Les 30 produits sont automatiquement chargés au premier déploiement grâce au script `postdeploy`.

Pour vérifier:
1. Ouvrir votre app: `https://votre-app.herokuapp.com`
2. Tester l'API: `https://votre-app.herokuapp.com/api/health`

Vous devriez voir:
```json
{
  "status": "OK",
  "timestamp": "2024-01-04T...",
  "services": {
    "mongodb": "Connected",
    "stripe": "Not configured",
    "email": "Not configured",
    "scheduledJobs": "Enabled"
  }
}
```

3. Tester les produits: `https://votre-app.herokuapp.com/api/products`

✅ Si vous voyez 30 produits, c'est parfait !

---

## Étape 3: Configuration Optionnelle

### 3.1 Activer les Paiements Stripe

#### Créer un compte Stripe
1. Aller sur [Stripe](https://stripe.com)
2. S'inscrire (mode test gratuit)
3. Aller dans **Developers → API Keys**
4. Copier:
   - **Publishable key**: `pk_test_...` (pour le frontend)
   - **Secret key**: `sk_test_...` (pour le backend)

#### Ajouter dans Heroku
1. Aller sur votre app Heroku
2. **Settings → Config Vars → Reveal Config Vars**
3. Ajouter:
   - `STRIPE_SECRET_KEY` = `sk_test_...`

#### Webhooks Stripe (optionnel)
Pour recevoir les événements de paiement:
1. Stripe Dashboard → **Developers → Webhooks**
2. **Add endpoint**: `https://votre-app.herokuapp.com/api/payments/webhook`
3. Sélectionner les événements: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copier le **Signing secret**: `whsec_...`
5. Dans Heroku Config Vars:
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...`

### 3.2 Activer les Emails

#### Option A: SendGrid (Recommandé - 100 emails/jour gratuits)

1. Créer compte sur [SendGrid](https://sendgrid.com)
2. Aller dans **Settings → API Keys**
3. Créer une nouvelle clé avec accès "Mail Send"
4. Copier la clé: `SG.xxxxx`

Dans Heroku Config Vars:
```
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@workoutbrothers.com
SENDGRID_API_KEY=SG.xxxxx
ADMIN_EMAIL=votre.email@example.com
```

#### Option B: Mailgun (500 emails/mois gratuits)

1. Créer compte sur [Mailgun](https://mailgun.com)
2. Vérifier votre domaine ou utiliser le sandbox
3. Copier API Key et Domain

Dans Heroku Config Vars:
```
EMAIL_SERVICE=mailgun
EMAIL_FROM=noreply@workoutbrothers.com
MAILGUN_API_KEY=key-xxxxx
MAILGUN_DOMAIN=mg.votredomaine.com
ADMIN_EMAIL=votre.email@example.com
```

#### Option C: SMTP (Gmail, Outlook, etc.)

Exemple avec Gmail:
1. Activer "2-Step Verification" sur votre compte Google
2. Créer un "App Password": [Guide](https://support.google.com/accounts/answer/185833)

Dans Heroku Config Vars:
```
EMAIL_SERVICE=smtp
EMAIL_FROM=votre.email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASS=votre_app_password
ADMIN_EMAIL=votre.email@gmail.com
```

### 3.3 Redémarrer l'Application

Après avoir ajouté des Config Vars:
1. Heroku Dashboard → **More → Restart all dynos**
2. Ou utiliser le CLI: `heroku restart -a votre-app`

---

## Étape 4: Vérification

### 4.1 Tester l'API

#### Health Check
```bash
curl https://votre-app.herokuapp.com/api/health
```

#### Lister les produits
```bash
curl https://votre-app.herokuapp.com/api/products
```

#### Obtenir les catégories
```bash
curl https://votre-app.herokuapp.com/api/categories
```

### 4.2 Créer un Compte Test

```bash
curl -X POST https://votre-app.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

Vous recevrez un token JWT. Copiez-le pour les prochaines requêtes.

### 4.3 Tester une Commande

```bash
curl -X POST https://votre-app.herokuapp.com/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "shippingAddress": {
      "street": "123 Rue Test",
      "city": "Paris",
      "zipCode": "75001",
      "country": "France"
    },
    "paymentMethod": "stripe"
  }'
```

Si les emails sont configurés, vous recevrez un email de confirmation !

### 4.4 Accéder aux Stats Admin

```bash
curl https://votre-app.herokuapp.com/api/admin/stats \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 🔧 Dépannage

### Problème: "Application error"

**Solution**:
1. Voir les logs: Heroku Dashboard → **More → View logs**
2. Ou avec CLI: `heroku logs --tail -a votre-app`

### Problème: "MongoDB connection error"

**Vérifications**:
- ✅ Connection string correcte dans MONGODB_URI
- ✅ Mot de passe correct (pas de `<password>`)
- ✅ IP `0.0.0.0/0` autorisée dans MongoDB Network Access
- ✅ Utilisateur créé dans MongoDB Database Access

### Problème: "No products found"

**Solution**:
Les produits ne se sont pas chargés. Les charger manuellement:

1. Installer Heroku CLI: [Guide](https://devcenter.heroku.com/articles/heroku-cli)
2. Se connecter: `heroku login`
3. Charger les produits:
```bash
heroku run npm run seed -a votre-app
```

### Problème: Emails ne partent pas

**Vérifications**:
- ✅ EMAIL_SERVICE configuré (`sendgrid`, `mailgun` ou `smtp`)
- ✅ Clés API correctes
- ✅ EMAIL_FROM et ADMIN_EMAIL configurés
- ✅ Application redémarrée après ajout des variables

Tester manuellement:
```bash
curl -X POST https://votre-app.herokuapp.com/api/admin/trigger-report \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

### Problème: "Rate limit exceeded"

C'est normal ! Le rate limiting protège votre API:
- API générale: 100 requêtes / 15 minutes
- Auth: 5 tentatives / 15 minutes
- Admin: 10 requêtes / 15 minutes

Attendre 15 minutes ou redémarrer l'app en développement.

---

## 📊 Monitoring

### Voir les Logs en Temps Réel
```bash
heroku logs --tail -a votre-app
```

### Voir les Métriques
Heroku Dashboard → **Metrics**

### Planificateur de Tâches
Les tâches automatiques sont déjà configurées:
- 📊 Rapport hebdomadaire: Lundi 9h00
- 📦 Vérification stock: Tous les jours 8h00

---

## 🚀 Prochaines Étapes

1. **Frontend**: Développer une interface utilisateur (React, Vue.js)
2. **Domaine personnalisé**: Configurer un nom de domaine
3. **SSL**: Activer HTTPS (inclus gratuitement avec Heroku)
4. **Monitoring**: Ajouter Sentry pour tracking d'erreurs
5. **Analytics**: Intégrer Google Analytics
6. **CDN**: Utiliser Cloudflare pour les images

---

## 📞 Support

- 📖 [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)
- 📖 [Documentation Heroku](https://devcenter.heroku.com/)
- 🐛 [Reporter un bug](https://github.com/therealbane666-prog/BaneWorkout/issues)

---

**💪 Félicitations ! Votre boutique WorkoutBrothers est en ligne !** 🎉
