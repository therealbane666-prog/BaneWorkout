# 🚀 Guide de Déploiement WorkoutBrothers

Guide complet pour déployer et configurer votre plateforme e-commerce WorkoutBrothers.

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Déploiement Heroku (Recommandé)](#déploiement-heroku)
3. [Configuration des Services](#configuration-des-services)
4. [Initialisation des Produits](#initialisation-des-produits)
5. [Tests et Vérification](#tests-et-vérification)
6. [Maintenance](#maintenance)

---

## 🔧 Prérequis

### Comptes nécessaires (GRATUITS pour commencer)

1. **Heroku** (hébergement)
   - Inscription: https://signup.heroku.com/
   - Plan gratuit disponible (suffisant pour démarrer)

2. **MongoDB Atlas** (base de données)
   - Inscription: https://www.mongodb.com/cloud/atlas/register
   - Cluster gratuit 512MB (inclus automatiquement avec Heroku)

3. **Stripe** (paiements)
   - Inscription: https://dashboard.stripe.com/register
   - Mode test gratuit (aucune transaction réelle)

4. **SendGrid** (emails) - OPTIONNEL
   - Inscription: https://signup.sendgrid.com/
   - Plan gratuit: 100 emails/jour

---

## 🚀 Déploiement Heroku

### Option 1: Déploiement One-Click (PLUS SIMPLE)

1. **Cliquez sur le bouton Deploy**
   
   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout)

2. **Configurez votre application**
   - Nom de l'app: `workoutbrothers-[votre-nom]`
   - Région: Europe (ou US selon préférence)

3. **Variables d'environnement** (remplissez les champs)
   - `JWT_SECRET`: Généré automatiquement ✅
   - `STRIPE_SECRET_KEY`: Votre clé Stripe (optionnel pour test)
   - `ADMIN_EMAIL`: Votre email pour les rapports hebdomadaires
   - Laissez les autres vides pour l'instant

4. **Déployez !**
   - Cliquez sur "Deploy app"
   - Attendez 2-3 minutes
   - Cliquez sur "View" pour voir votre app

### Option 2: Ligne de commande (Avancé)

```bash
# Installer Heroku CLI
# Windows: https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew install heroku/brew/heroku
# Linux: sudo snap install heroku --classic

# Se connecter
heroku login

# Créer l'application
heroku create workoutbrothers-votrerom

# Ajouter MongoDB
heroku addons:create mongolab:sandbox

# Configurer les variables
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
heroku config:set ADMIN_EMAIL=votre@email.com

# Déployer
git push heroku main

# Initialiser les produits
heroku run npm run seed
```

---

## ⚙️ Configuration des Services

### 1. MongoDB Atlas

Si vous n'utilisez pas l'addon Heroku:

1. Créez un cluster gratuit sur MongoDB Atlas
2. Ajoutez votre IP (ou 0.0.0.0/0 pour tous)
3. Créez un utilisateur de base de données
4. Copiez la connection string
5. Sur Heroku: `heroku config:set MONGODB_URI="votre_connection_string"`

### 2. Stripe (Paiements)

1. **Créez un compte Stripe**
   - Allez sur https://dashboard.stripe.com/register
   - Vérifiez votre email

2. **Récupérez vos clés TEST**
   - Dans le dashboard: Developers > API Keys
   - Copiez "Publishable key" (pk_test_...)
   - Copiez "Secret key" (sk_test_...)

3. **Configurez Heroku**
   ```bash
   heroku config:set STRIPE_SECRET_KEY="sk_test_..."
   heroku config:set STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

4. **Webhook (Important!)**
   - Dans Stripe: Developers > Webhooks
   - Cliquez "Add endpoint"
   - URL: `https://votre-app.herokuapp.com/api/payments/webhook`
   - Événements: Sélectionnez `payment_intent.succeeded` et `payment_intent.payment_failed`
   - Copiez le "Signing secret" (whsec_...)
   - `heroku config:set STRIPE_WEBHOOK_SECRET="whsec_..."`

### 3. SendGrid (Emails)

1. **Créez un compte SendGrid**
   - Inscription: https://signup.sendgrid.com/
   - Plan gratuit: 100 emails/jour

2. **Créez une API Key**
   - Settings > API Keys
   - Créez une nouvelle clé avec "Full Access"
   - Copiez la clé (commence par SG....)

3. **Configurez Heroku**
   ```bash
   heroku config:set SENDGRID_API_KEY="SG...."
   heroku config:set EMAIL_FROM="WorkoutBrothers <noreply@workoutbrothers.com>"
   heroku config:set ADMIN_EMAIL="votre@email.com"
   ```

4. **Vérifiez l'expéditeur**
   - Dans SendGrid: Settings > Sender Authentication
   - Vérifiez votre email ou domaine

---

## 📦 Initialisation des Produits

### Automatique lors du déploiement

Les produits sont automatiquement ajoutés lors du premier déploiement.

### Manuelle (si nécessaire)

```bash
# Via Heroku CLI
heroku run npm run seed

# Ou connectez-vous à la console Heroku
heroku run bash
npm run seed
exit
```

### Produits inclus

**30 produits répartis en 3 catégories:**

1. **Équipement Tactique** (8 produits)
   - Gilets tactiques, casques, holsters
   - Pantalons cargo, bottes, gants
   - Sacs militaires, ceintures

2. **Nutrition & Suppléments** (8 produits)
   - Protéines, BCAA, créatine
   - Multivitamines, omega-3
   - Pre-workout, barres protéinées

3. **Équipement Sport** (10 produits)
   - Kettlebells, cordes à sauter
   - Sacs de frappe, gants de boxe
   - Gilets lestés, bandes de résistance

---

## ✅ Tests et Vérification

### 1. Vérifiez que l'API fonctionne

```bash
# Health check
curl https://votre-app.herokuapp.com/api/health

# Devrait retourner: {"status":"OK","timestamp":"..."}
```

### 2. Testez l'inscription

```bash
curl -X POST https://votre-app.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'
```

### 3. Listez les produits

```bash
curl https://votre-app.herokuapp.com/api/products
```

### 4. Vérifiez les catégories

```bash
curl https://votre-app.herokuapp.com/api/categories
```

### 5. Testez le rapport hebdomadaire

```bash
# D'abord, connectez-vous et récupérez le token
# Puis testez l'envoi du rapport
curl -X POST https://votre-app.herokuapp.com/api/admin/send-report \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 🔄 Maintenance

### Rapports Hebdomadaires Automatiques

Les rapports sont envoyés automatiquement **tous les lundis à 9h00**.

Contenu du rapport:
- Chiffre d'affaires de la semaine
- Nombre de commandes
- Nouveaux clients
- Panier moyen
- Produits les plus vendus
- Alertes de stock bas

### Surveillance du Stock

Vérification automatique **tous les jours à 8h00**.
Alerte si stock < 10 unités.

### Voir les logs

```bash
# Logs en temps réel
heroku logs --tail

# Dernières 200 lignes
heroku logs -n 200
```

### Redémarrer l'application

```bash
heroku restart
```

### Sauvegarder la base de données

```bash
# Via MongoDB Atlas
# Clusters > [...] > Collections > Export

# Ou via mongodump
mongodump --uri="votre_mongodb_uri"
```

---

## 🎯 Configuration Domaine Personnalisé

### 1. Achetez un domaine

Fournisseurs recommandés:
- Namecheap (10-15€/an)
- OVH (5-10€/an)
- Google Domains (12€/an)

### 2. Configurez Heroku

```bash
# Ajoutez votre domaine
heroku domains:add www.workoutbrothers.fr

# Récupérez le DNS target
heroku domains
```

### 3. Configurez les DNS

Chez votre registrar, ajoutez:
- Type: CNAME
- Nom: www
- Valeur: [le DNS target de Heroku]

### 4. Activez HTTPS (gratuit)

```bash
heroku certs:auto:enable
```

---

## 📊 Tableau de Bord

### Accéder au dashboard Heroku

```bash
heroku open
# Ou: https://dashboard.heroku.com/apps/votre-app
```

### Métriques disponibles

- Requêtes par seconde
- Temps de réponse
- Utilisation mémoire
- Erreurs

### Alerts (optionnel)

Configuration dans le dashboard Heroku > Metrics

---

## 💰 Coûts Prévisionnels

### Gratuit (pour commencer)

- Heroku: Free dyno
- MongoDB: 512MB gratuit
- Stripe: Mode test gratuit
- SendGrid: 100 emails/jour gratuit

**Total: 0€/mois** ✅

### Recommandé (production)

- Heroku Hobby: 7$/mois
- MongoDB Atlas M10: 10$/mois (optionnel)
- SendGrid Essentials: 15$/mois (40k emails)
- Domaine: 10€/an

**Total: ~20-30€/mois**

### Scaling (croissance)

- Heroku Standard: 25-50$/mois
- MongoDB Atlas M20: 30$/mois
- SendGrid Pro: 90$/mois (100k emails)

**Total: ~100-150€/mois** (pour 1000+ commandes/mois)

---

## 🆘 Dépannage

### Erreur "Application Error"

```bash
heroku logs --tail
# Cherchez la ligne d'erreur
```

### Base de données non connectée

```bash
heroku config:get MONGODB_URI
# Vérifiez que l'URI est correcte
```

### Emails non envoyés

```bash
heroku config:get SENDGRID_API_KEY
# Vérifiez que la clé est configurée
# Vérifiez les logs: heroku logs --tail
```

### Produits non chargés

```bash
heroku run npm run seed
```

---

## 📞 Support

### Ressources

- Documentation Heroku: https://devcenter.heroku.com/
- Documentation Stripe: https://stripe.com/docs
- Documentation SendGrid: https://docs.sendgrid.com/
- MongoDB Atlas: https://docs.atlas.mongodb.com/

### Communauté

- Stack Overflow: Tag `heroku`, `stripe`, `mongodb`
- GitHub Issues: Ouvrez une issue sur le repo

---

## 🎉 Prochaines Étapes

1. ✅ Déployez l'application
2. ✅ Configurez Stripe et emails
3. ✅ Initialisez les produits
4. 📝 Personnalisez les descriptions des produits
5. 🖼️ Ajoutez vos propres images
6. 🎨 Développez le frontend client
7. 📱 Créez l'application mobile
8. 🚀 Lancez le marketing !

---

**WorkoutBrothers - Préparation Physique & Mentale**

*Document mis à jour: Janvier 2026*
