# 🚀 Déploiement WorkoutBrothers en 10 Minutes

Guide ultra-rapide pour déployer votre application WorkoutBrothers et la rendre accessible sur `baneworkout.com`.

---

## 📋 Prérequis (1 minute)

- ✅ Compte GitHub (gratuit)
- ✅ Domaine `baneworkout.com` (accès au DNS)
- ✅ Carte de crédit (pour services gratuits - pas de frais)

---

## Étape 1: MongoDB Atlas - Base de Données (2 minutes) 💾

1. **Créer un compte**
   - Allez sur https://cloud.mongodb.com
   - Cliquez sur `Sign Up` (ou utilisez Google/GitHub)

2. **Créer un Cluster Gratuit**
   - Cliquez sur `Build a Database`
   - Sélectionnez `M0 FREE` (512 MB gratuit)
   - Choisissez la région la plus proche de vos utilisateurs
   - Nom du cluster: `workoutbrothers`
   - Cliquez sur `Create`

3. **Configurer l'accès**
   
   **A. Créer un utilisateur de base de données:**
   - `Database Access` → `Add New Database User`
   - Username: `admin`
   - Password: Générer automatiquement (copier le mot de passe!)
   - Database User Privileges: `Read and write to any database`
   - Cliquez sur `Add User`
   
   **B. Autoriser l'accès réseau:**
   - `Network Access` → `Add IP Address`
   - Cliquez sur `Allow Access from Anywhere` (0.0.0.0/0)
   - Cliquez sur `Confirm`

4. **Obtenir la chaîne de connexion**
   - Retournez à `Database` → Cliquez sur `Connect`
   - Sélectionnez `Connect your application`
   - Copiez la chaîne de connexion:
   ```
   mongodb+srv://admin:<password>@workoutbrothers.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **IMPORTANT:** Remplacez `<password>` par le mot de passe copié à l'étape 3A

---

## Étape 2: Railway - Déploiement Backend (3 minutes) 🚂

Railway est la solution la plus rapide et simple.

1. **Créer un compte Railway**
   - Allez sur https://railway.app
   - Cliquez sur `Login` → Utilisez GitHub

2. **Créer un nouveau projet**
   - Cliquez sur `New Project`
   - Sélectionnez `Deploy from GitHub repo`
   - Autorisez Railway à accéder à vos repos
   - Sélectionnez `therealbane666-prog/BaneWorkout`

3. **Configurer les variables d'environnement**
   - Cliquez sur votre service déployé
   - Allez dans `Variables`
   - Ajoutez les variables suivantes:

   ```
   MONGODB_URI=mongodb+srv://admin:VOTRE_PASSWORD@workoutbrothers.xxxxx.mongodb.net/?retryWrites=true&w=majority
   JWT_SECRET=generate_random_string_here_32_characters_minimum
   NODE_ENV=production
   DOMAIN=baneworkout.com
   ```

   **Générer JWT_SECRET:**
   - Utilisez: https://generate-secret.vercel.app/32
   - Ou dans un terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **Attendre le déploiement**
   - Railway déploie automatiquement
   - Attendez que le statut passe à `Active` (1-2 minutes)
   - Notez l'URL fournie: `https://[votre-app].railway.app`

5. **Tester le déploiement**
   - Ouvrez: `https://[votre-app].railway.app/api/health`
   - Vous devriez voir: `{"status":"OK","timestamp":"..."}`

---

## Étape 3: Configuration Domaine (5 minutes) 🌐

### Sur Railway:

1. **Ajouter le domaine**
   - Dans Railway: `Settings` → `Networking` → `Custom Domains`
   - Cliquez sur `Add Domain`
   - Entrez: `baneworkout.com`
   - Railway affiche un enregistrement CNAME

2. **Configurer DNS chez votre registrar**
   
   Connectez-vous à votre registrar (GoDaddy, Namecheap, Cloudflare, etc.):
   
   **Configuration recommandée:**
   ```
   Type: CNAME
   Name: @ (ou racine)
   Value: [votre-app].railway.app
   TTL: 3600 (1 heure)
   ```
   
   **Si votre registrar ne supporte pas CNAME pour @:**
   ```
   Type: A
   Name: @
   Value: [IP fournie par Railway]
   TTL: 3600
   ```
   
   **Pour www (optionnel):**
   ```
   Type: CNAME
   Name: www
   Value: [votre-app].railway.app
   TTL: 3600
   ```

3. **Attendre la propagation DNS**
   - La propagation DNS prend généralement 5-30 minutes
   - Peut prendre jusqu'à 48 heures dans certains cas
   - Vérifier sur: https://www.whatsmydns.net/

4. **SSL/HTTPS Automatique**
   - Railway configure automatiquement SSL via Let's Encrypt
   - Aucune action requise
   - Le certificat est généré dans les 5-10 minutes après la propagation DNS

---

## Étape 4: Vérification Finale (1 minute) ✅

### Tests à effectuer:

1. **Backend API:**
   ```
   ✅ https://baneworkout.com/api/health
   → Devrait retourner: {"status":"OK"}
   
   ✅ https://baneworkout.com/api/products
   → Devrait retourner: {"products":[...]}
   ```

2. **HTTPS:**
   ```
   ✅ Le cadenas vert doit apparaître dans le navigateur
   ✅ Le certificat doit être valide
   ```

3. **Frontend (si déployé):**
   ```
   ✅ https://baneworkout.com
   → Page d'accueil doit se charger
   ```

---

## 🎯 Alternative: Déploiement en 1 Clic sur Heroku

Si vous préférez Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/therealbane666-prog/BaneWorkout)

1. Cliquez sur le bouton ci-dessus
2. Remplissez les variables d'environnement
3. Cliquez sur `Deploy App`
4. Configuration du domaine dans Heroku: `Settings` → `Domains`

---

## 🔧 Variables d'Environnement Optionnelles

Pour fonctionnalités avancées, ajoutez:

```bash
# Stripe (Paiements)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=votre@email.com
EMAIL_PASSWORD=votre_mot_de_passe_app

# OpenAI (Agent IA - optionnel)
OPENAI_API_KEY=sk-...
```

---

## 🐛 Troubleshooting

### Le backend ne démarre pas:
- Vérifiez `MONGODB_URI` - assurez-vous d'avoir remplacé `<password>`
- Vérifiez les logs Railway: `Deployments` → Cliquez sur le déploiement → `View Logs`

### Le domaine ne fonctionne pas:
- Attendez la propagation DNS (5-30 minutes)
- Vérifiez la configuration DNS avec `nslookup baneworkout.com`
- Vérifiez que le CNAME pointe vers Railway

### Erreur 502/503:
- Le backend est peut-être en cours de démarrage (attendez 1-2 minutes)
- Vérifiez les logs pour les erreurs

---

## 📊 Étapes Suivantes

Une fois déployé:

1. **Ajouter des produits:** Utilisez l'API `/api/products` (POST)
2. **Configurer Stripe:** Pour accepter les paiements
3. **Personnaliser le frontend:** Modifier les fichiers dans `frontend/`
4. **Configurer les emails:** Pour notifications automatiques
5. **Activer l'agent IA:** Ajouter `OPENAI_API_KEY`

---

## 📚 Documentation Complète

- **Configuration Domaine:** Voir `DEPLOIEMENT_DOMAINE.md`
- **API Documentation:** Voir `README.md`
- **Frontend Setup:** Voir `frontend/README.md`

---

## 🎉 Félicitations!

Votre application WorkoutBrothers est maintenant déployée et accessible sur **baneworkout.com**!

**Temps total:** ⏱️ 10-15 minutes

**Coût:** 💰 $0/mois (avec les tiers gratuits)

---

**Support:** Pour toute question, consultez la documentation ou ouvrez une issue sur GitHub.
