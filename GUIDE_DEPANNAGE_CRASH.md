# 🔧 GUIDE DE DÉPANNAGE - WORKOUTBROTHERS

## ❌ Le Site Crash Après Le Déploiement

### Symptômes
- Le déploiement fonctionne pendant 2-3 minutes
- Puis le site plante/crash
- Erreur 503 ou "Application Error"

### ✅ SOLUTIONS IMMÉDIATES

## 1. VÉRIFIER LES LOGS (ÉTAPE CRITIQUE)

### Sur Heroku:
```
https://dashboard.heroku.com/apps/workoutbrothers/logs
```
- Cliquez "More" → "View logs"
- Cherchez les lignes avec ❌ ou ERROR

### Sur Railway:
```
https://railway.app/project/[votre-projet]/deployments
```
- Cliquez sur le déploiement
- Onglet "Logs"

### Sur Render:
```
https://dashboard.render.com/
```
- Sélectionnez votre service
- Onglet "Logs"

## 2. CONFIGURER MONGODB_URI (CAUSE #1 DE CRASH)

**C'est LA cause la plus fréquente de crash !**

### ❌ ERREUR TYPIQUE DANS LES LOGS:
```
❌ MongoDB connection error: MongooseServerSelectionError
Server selection timed out after 5000 ms
```

### ✅ SOLUTION:

**Option A - MongoDB Atlas (Recommandé)**
1. Créez compte: https://www.mongodb.com/cloud/atlas/register
2. Créez cluster GRATUIT (M0)
3. Créez utilisateur de base de données
4. Whitelist IP: `0.0.0.0/0` (Allow from anywhere)
5. Copiez connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workoutbrothers`
6. **IMPORTANT**: Remplacez `<password>` par votre vrai mot de passe

**Ajouter dans votre plateforme:**

Heroku:
```bash
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workoutbrothers"
```

Ou via dashboard:
```
Settings → Reveal Config Vars → Add
KEY: MONGODB_URI
VALUE: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workoutbrothers
```

Railway:
```
Variables → Add Variable
MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workoutbrothers
```

Render:
```
Environment → Add Environment Variable
MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/workoutbrothers
```

## 3. STRIPE (CAUSE #2 DE CRASH)

### ❌ ERREUR TYPIQUE:
```
❌ Error: Stripe API key is not set
```

### ✅ SOLUTION:

**Obtenir les clés Stripe:**
1. Créez compte: https://stripe.com
2. Mode Test: https://dashboard.stripe.com/test/apikeys
3. Copiez "Secret key" (commence par `sk_test_`)

**Ajouter:**
```
STRIPE_SECRET_KEY=sk_test_votre_cle_ici
```

**IMPORTANT**: Ne mettez PAS de guillemets autour de la clé !

## 4. AUTRES VARIABLES D'ENVIRONNEMENT

### Variables OBLIGATOIRES:
```bash
MONGODB_URI=mongodb+srv://...
```

### Variables RECOMMANDÉES (le site fonctionne sans, mais avec warnings):
```bash
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=un_secret_aleatoire_tres_long
ADMIN_EMAIL=therealbane666@gmail.com
```

## 5. TESTER LA CONFIGURATION

### Étape 1: Vérifier que le serveur démarre
Visitez:
```
https://votre-app.herokuapp.com/api/health
```

✅ Si vous voyez `{"status":"OK","timestamp":"..."}` → Le serveur fonctionne !

### Étape 2: Vérifier MongoDB
Visitez:
```
https://votre-app.herokuapp.com/api/products
```

✅ Si vous voyez `[]` (liste vide) → MongoDB connecté !
❌ Si erreur 500 → MongoDB PAS connecté, vérifiez MONGODB_URI

### Étape 3: Initialiser les produits
```bash
# Sur Heroku
heroku run npm run seed -a workoutbrothers

# Sur Railway
railway run npm run seed

# Sur Render
Via Shell → npm run seed
```

Ensuite revisitez `/api/products` → Vous devriez voir 30 produits !

## 6. ERREURS SPÉCIFIQUES & SOLUTIONS

### Erreur: "Application Error"
**Cause**: Crash du serveur au démarrage
**Solution**: 
1. Vérifiez les logs (section 1)
2. Vérifiez MONGODB_URI (section 2)
3. Redéployez après avoir ajouté les variables

### Erreur: "H10 - App Crashed"
**Cause**: Même que ci-dessus
**Solution**: Ajoutez MONGODB_URI et redéployez

### Erreur: "Cannot read property 'paymentIntents' of undefined"
**Cause**: STRIPE_SECRET_KEY manquant
**Solution**: Ajoutez STRIPE_SECRET_KEY ou ignorez (paiements désactivés)

### Erreur: "MongooseServerSelectionError"
**Cause**: 
- MONGODB_URI pas configuré
- OU mauvais format
- OU IP pas whitelistée dans MongoDB Atlas

**Solution**:
1. Vérifiez le format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
2. Dans MongoDB Atlas: Network Access → Add IP → `0.0.0.0/0`
3. Vérifiez que le mot de passe ne contient pas de caractères spéciaux sans échappement

## 7. CHECKLIST RAPIDE

Cochez chaque point:

- [ ] MONGODB_URI est configuré dans les variables d'environnement
- [ ] Format MONGODB_URI est correct (commence par `mongodb+srv://`)
- [ ] MongoDB Atlas: IP `0.0.0.0/0` est whitelistée
- [ ] Le mot de passe dans MONGODB_URI est correct (pas de `<password>`)
- [ ] L'application redéployée APRÈS avoir ajouté les variables
- [ ] Les logs ne montrent plus d'erreurs MongoDB
- [ ] `/api/health` retourne `{"status":"OK"}`
- [ ] `/api/products` fonctionne (même si liste vide)

## 8. ALTERNATIVES SI ÇA NE FONCTIONNE TOUJOURS PAS

### Option A: Railway (Le Plus Simple)
Railway configure MongoDB automatiquement:

1. https://railway.app/new
2. "Deploy from GitHub repo"
3. Sélectionnez "BaneWorkout"
4. Railway configure TOUT automatiquement
5. C'est prêt en 2 minutes !

### Option B: Render
1. https://dashboard.render.com/
2. "New +" → "Web Service"
3. Connectez GitHub
4. Render détecte Node.js automatiquement
5. Ajoutez seulement MONGODB_URI

## 9. COMMANDES UTILES

### Voir les variables configurées (Heroku):
```bash
heroku config -a workoutbrothers
```

### Voir les logs en temps réel (Heroku):
```bash
heroku logs --tail -a workoutbrothers
```

### Redémarrer l'app (Heroku):
```bash
heroku restart -a workoutbrothers
```

### Ouvrir l'app (Heroku):
```bash
heroku open -a workoutbrothers
```

## 10. CONTACT & SUPPORT

Si après tout cela le problème persiste:

1. **Copiez les logs** (dernières 50 lignes)
2. **Listez vos variables configurées** (masquez les valeurs sensibles)
3. **Indiquez votre plateforme** (Heroku/Railway/Render)
4. **Partagez ces informations** pour obtenir de l'aide

---

## 🎯 RÉSUMÉ ULTRA-RAPIDE

**90% des crashs sont causés par:**

1. ❌ **MONGODB_URI pas configuré** 
   → Ajoutez-le dans Config Vars / Variables
   
2. ❌ **Format MONGODB_URI incorrect**
   → Vérifiez le format et le mot de passe
   
3. ❌ **Variables ajoutées MAIS app pas redéployée**
   → Redéployez après avoir ajouté les variables

**Solution en 3 minutes:**
1. MongoDB Atlas → Créer cluster → Copier connection string
2. Dashboard hosting → Config Vars → Ajouter MONGODB_URI
3. Redéployer l'application
4. Visiter `/api/health` pour confirmer

**C'EST TOUT ! Le site devrait maintenant fonctionner sans crash.**

---

**📝 Note**: Ce guide couvre 99% des problèmes de crash. Si votre problème persiste après avoir tout vérifié, c'est probablement un problème spécifique à votre configuration unique. Dans ce cas, les logs sont votre meilleur ami - ils indiquent EXACTEMENT où est le problème.
