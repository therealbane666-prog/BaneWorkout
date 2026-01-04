# 🔗 Liens et Étapes de Déploiement - WorkoutBrothers

Guide rapide avec tous les liens et textes à copier-coller.

---

## 📋 Étape 1: MongoDB Atlas (Base de données)

### 🔗 Lien: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

**Ce que tu dois faire:**
1. Créer un compte gratuit
2. Créer un cluster gratuit M0 (512MB)
3. Créer un utilisateur database
4. Autoriser toutes les IPs: `0.0.0.0/0`
5. Obtenir la connection string

### 📝 À copier (Connection String):
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/workoutbrothers?retryWrites=true&w=majority
```

**⚠️ Important:** Remplace `USERNAME` et `PASSWORD` par tes identifiants MongoDB

---

## 🚀 Étape 2: Déploiement Heroku

### 🔗 Lien Deploy: [https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout](https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout)

**Variables OBLIGATOIRES à remplir:**

#### MONGODB_URI
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/workoutbrothers?retryWrites=true&w=majority
```
👉 Colle ta connection string MongoDB ici

#### JWT_SECRET
```
[Généré automatiquement par Heroku - ne rien changer]
```

#### NODE_ENV
```
production
```
👉 Déjà configuré

---

## 📧 Étape 3 (OPTIONNEL): Emails SendGrid

### 🔗 Lien: [https://sendgrid.com](https://sendgrid.com)

**Variables à ajouter dans Heroku (Settings → Config Vars):**

#### EMAIL_SERVICE
```
sendgrid
```

#### EMAIL_FROM
```
noreply@workoutbrothers.com
```

#### SENDGRID_API_KEY
```
SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
👉 Obtenir depuis SendGrid → Settings → API Keys

#### ADMIN_EMAIL
```
ton.email@example.com
```
👉 Remplace par ton vrai email

---

## 💳 Étape 4 (OPTIONNEL): Paiements Stripe

### 🔗 Lien: [https://stripe.com](https://stripe.com)

**Variables à ajouter dans Heroku (Settings → Config Vars):**

#### STRIPE_SECRET_KEY
```
sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
👉 Obtenir depuis Stripe Dashboard → Developers → API Keys

#### STRIPE_WEBHOOK_SECRET
```
whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
👉 Obtenir depuis Stripe Dashboard → Developers → Webhooks

**Webhook URL à configurer dans Stripe:**
```
https://TON-APP-NAME.herokuapp.com/api/payments/webhook
```
👉 Remplace `TON-APP-NAME` par le nom de ton app Heroku

**Événements à sélectionner:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

---

## ✅ Étape 5: Vérification

### 🔗 Liens à tester:

#### Health Check
```
https://TON-APP-NAME.herokuapp.com/api/health
```

#### Liste des Produits
```
https://TON-APP-NAME.herokuapp.com/api/products
```

#### Catégories
```
https://TON-APP-NAME.herokuapp.com/api/categories
```

---

## 📝 Récapitulatif - Ce que tu DOIS copier-coller

### 1️⃣ MongoDB Atlas
- **Lien**: https://www.mongodb.com/cloud/atlas
- **À copier**: Ta connection string MongoDB

### 2️⃣ Heroku Deploy
- **Lien**: https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout
- **À coller**: Connection string MongoDB dans `MONGODB_URI`

### 3️⃣ SendGrid (optionnel)
- **Lien**: https://sendgrid.com
- **À ajouter**:
  - `EMAIL_SERVICE` = `sendgrid`
  - `EMAIL_FROM` = `noreply@workoutbrothers.com`
  - `SENDGRID_API_KEY` = Ta clé API
  - `ADMIN_EMAIL` = Ton email

### 4️⃣ Stripe (optionnel)
- **Lien**: https://stripe.com
- **À ajouter**:
  - `STRIPE_SECRET_KEY` = `sk_test_...`
  - `STRIPE_WEBHOOK_SECRET` = `whsec_...`
- **Webhook URL**: `https://TON-APP-NAME.herokuapp.com/api/payments/webhook`

---

## 🎯 Commandes Utiles

### Voir les logs Heroku
```bash
heroku logs --tail -a TON-APP-NAME
```

### Charger les produits manuellement
```bash
heroku run npm run seed -a TON-APP-NAME
```

### Redémarrer l'app
```bash
heroku restart -a TON-APP-NAME
```

---

## 🆘 En cas de problème

### MongoDB ne se connecte pas
✅ Vérifie que:
- L'IP `0.0.0.0/0` est autorisée dans Network Access
- L'utilisateur est créé dans Database Access
- Le mot de passe ne contient pas de caractères spéciaux (`<`, `>`, `@`)

### Les produits ne se chargent pas
```bash
heroku run npm run seed -a TON-APP-NAME
```

### Emails ne partent pas
✅ Vérifie que:
- `EMAIL_SERVICE` est configuré
- La clé API est valide
- L'app a été redémarrée après ajout des variables

---

**💪 WorkoutBrothers - Préparation Physique & Mentale** 🚀
