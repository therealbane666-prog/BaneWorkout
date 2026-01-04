# 📋 WorkoutBrothers - Clarification Technique & Guide Déploiement

## 🎯 CLARIFICATION DES 2 POINTS

### 1️⃣ Gestion des Stocks et Alertes

**Comment ça fonctionne :**

```javascript
// Surveillance automatique quotidienne (8h du matin)
cron.schedule('0 8 * * *', async () => {
  // Recherche produits avec stock < 10 unités
  const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
  
  // Affiche alertes dans les logs serveur
  if (lowStockProducts.length > 0) {
    console.log(`⚠️ ${lowStockProducts.length} produits en stock bas`);
    // Exemple: "Gilet Tactique: 5 unités restantes"
  }
});
```

**Pour votre business dropshipping/POD :**
- **Stock illimité** (9999) pour produits POD/dropshipping = pas d'alerte
- **Stock géré** uniquement pour nutrition white label (MOQ 50-100 unités)
- **Alertes automatiques** quand stock < 10 unités
- **Vous recevez** notification dans rapport hebdomadaire

**Exemple concret :**
```
Lundi 9h - Email rapport hebdomadaire:
⚠️ Alertes Stock:
- Whey Isolate Pro 2kg: 8 unités restantes → COMMANDER
- BCAA Complex: 15 unités → OK
- Créatine: 6 unités restantes → COMMANDER
```

---

### 2️⃣ API Complète pour Produits/Commandes/Paiements

**Architecture complète déjà implémentée :**

#### A) Produits (`/api/products`)
```javascript
GET    /api/products              // Liste tous les produits
GET    /api/products/:id          // Détails d'un produit
POST   /api/products              // Créer produit (admin)
PUT    /api/products/:id          // Modifier produit (admin)
DELETE /api/products/:id          // Supprimer produit (admin)
POST   /api/products/:id/reviews  // Ajouter avis client
GET    /api/categories            // Liste catégories
```

**Exemple utilisation :**
```bash
# Récupérer tous les produits tactiques
curl https://votre-app.herokuapp.com/api/products?category=Équipement%20Tactique

# Réponse JSON:
{
  "products": [
    {
      "_id": "abc123",
      "name": "Gilet Tactique Multi-Poches",
      "price": 89.99,
      "stock": 9999,
      "category": "Équipement Tactique"
    }
  ]
}
```

#### B) Commandes (`/api/orders`)
```javascript
GET  /api/orders           // Historique commandes utilisateur
GET  /api/orders/:id       // Détails commande spécifique
POST /api/orders           // Créer nouvelle commande
PUT  /api/orders/:id/status // Mettre à jour statut (admin)
```

**Flux automatique :**
```
1. Client ajoute au panier → POST /api/cart/items
2. Client valide commande → POST /api/orders
3. Système crée commande dans DB
4. Email confirmation envoyé automatiquement
5. Vous recevez notification (rapport hebdomadaire)
```

#### C) Paiements (`/api/payments`)
```javascript
POST /api/payments/create-intent  // Créer intention paiement Stripe
POST /api/payments/confirm        // Confirmer paiement
POST /api/payments/webhook        // Webhook Stripe (automatique)
```

**Processus paiement automatique :**
```
1. Client clique "Payer" → create-intent appelé
2. Stripe génère formulaire sécurisé 3D Secure
3. Client entre CB → Stripe traite paiement
4. Webhook Stripe notifie votre API automatiquement
5. Statut commande passe à "paid" automatiquement
6. Email confirmation envoyé automatiquement
7. Argent arrive sur votre compte bancaire J+2 à J+7
```

---

## 🚀 GUIDE DÉPLOIEMENT COMPLET

### Étape 1: Créer Compte Heroku (GRATUIT)

1. **Aller sur** https://signup.heroku.com/
2. **Créer compte** avec votre email
3. **Vérifier email** (cliquer lien de confirmation)
4. **Connexion** à Heroku Dashboard

**Temps: 3 minutes**

---

### Étape 2: Déployer en 1 Clic

1. **Ouvrir** le fichier `README.md` de ce repository
2. **Cliquer** sur le bouton violet "Deploy to Heroku"
   ```
   [![Deploy](https://www.herokucdn.com/deploy/button.svg)]
   ```
3. **Remplir le formulaire Heroku** :
   
   **Nom de l'app** (obligatoire):
   ```
   workoutbrothers-votreprenom
   ```
   
   **Variables d'environnement** (pré-remplies):
   - `NODE_ENV`: production ✅
   - `JWT_SECRET`: (auto-généré) ✅
   - `ADMIN_EMAIL`: **METTEZ VOTRE EMAIL** ⚠️
   
   **Laisser vide pour l'instant**:
   - STRIPE_SECRET_KEY (on configure après)
   - SENDGRID_API_KEY (on configure après)

4. **Cliquer** "Deploy app" (bouton violet en bas)

5. **Attendre** 2-3 minutes pendant que Heroku :
   - Installe Node.js
   - Installe dépendances (npm install)
   - Crée base de données MongoDB
   - Charge les 30 produits automatiquement
   - Démarre le serveur

6. **Cliquer** "View" quand déploiement terminé

**Temps: 5 minutes**

---

### Étape 3: Vérifier que ça Marche

**URL de votre API** : `https://workoutbrothers-votreprenom.herokuapp.com`

**Tester dans navigateur** :
```
https://workoutbrothers-votreprenom.herokuapp.com/api/health
```

**Devrait afficher** :
```json
{
  "status": "OK",
  "timestamp": "2026-01-04T07:00:00.000Z"
}
```

✅ **C'est bon !** Votre backend est en ligne et fonctionne !

**Temps: 1 minute**

---

### Étape 4: Configurer Stripe (Paiements)

#### A) Créer Compte Stripe

1. **Aller sur** https://dashboard.stripe.com/register
2. **Créer compte** avec email
3. **Choisir pays** : France
4. **Vérifier email**

#### B) Récupérer Clés API

1. **Dans Stripe Dashboard**, cliquer "Developers" (menu gauche)
2. **Cliquer** "API keys"
3. **Copier** :
   - **Publishable key** : `pk_test_...`
   - **Secret key** : `sk_test_...` (cliquer "Reveal")

#### C) Ajouter à Heroku

1. **Retourner** Heroku Dashboard
2. **Ouvrir** votre app `workoutbrothers-votreprenom`
3. **Cliquer** onglet "Settings"
4. **Cliquer** "Reveal Config Vars"
5. **Ajouter** nouvelle variable :
   - KEY: `STRIPE_SECRET_KEY`
   - VALUE: `sk_test_...` (votre clé secrète Stripe)
6. **Ajouter** autre variable :
   - KEY: `STRIPE_PUBLISHABLE_KEY`
   - VALUE: `pk_test_...`

#### D) Configurer Webhook Stripe

1. **Dans Stripe**, aller "Developers > Webhooks"
2. **Cliquer** "Add endpoint"
3. **Endpoint URL** :
   ```
   https://workoutbrothers-votreprenom.herokuapp.com/api/payments/webhook
   ```
4. **Sélectionner événements** :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. **Cliquer** "Add endpoint"
6. **Copier** "Signing secret" (`whsec_...`)
7. **Retour Heroku**, ajouter Config Var :
   - KEY: `STRIPE_WEBHOOK_SECRET`
   - VALUE: `whsec_...`

#### E) Connecter Compte Bancaire

1. **Dans Stripe Dashboard**, cliquer "Balance > Payouts"
2. **Cliquer** "Add bank account"
3. **Renseigner** :
   - Nom titulaire
   - IBAN français
   - BIC/SWIFT
4. **Vérifier** compte (Stripe fait micro-virement test)
5. **Une fois vérifié** : Les paiements arrivent automatiquement sur votre compte tous les 2-7 jours

**Temps: 15 minutes**

---

### Étape 5: Configurer Emails (Optionnel mais Recommandé)

#### Option A: SendGrid (100 emails/jour GRATUIT)

1. **Créer compte** https://signup.sendgrid.com/
2. **Vérifier email**
3. **Créer API Key** :
   - Settings > API Keys
   - Create API Key
   - Full Access
   - Copier la clé (commence par `SG.`)
4. **Ajouter à Heroku** Config Vars :
   - KEY: `SENDGRID_API_KEY`
   - VALUE: `SG.xxx...`
5. **Ajouter** :
   - KEY: `EMAIL_FROM`
   - VALUE: `WorkoutBrothers <noreply@workoutbrothers.com>`
6. **Vérifier expéditeur** :
   - Dans SendGrid: Settings > Sender Authentication
   - Single Sender Verification
   - Renseigner votre email
   - Vérifier email

**Maintenant les emails automatiques fonctionnent !**

**Temps: 10 minutes**

---

### Étape 6: Configurer Fournisseurs POD/Dropshipping

#### A) Printful (Textiles POD)

1. **Créer compte** https://www.printful.com/
2. **Aller** Store > Add store > Manual order/API
3. **Nom store** : WorkoutBrothers
4. **Récupérer API key** : Settings > API
5. **Uploader vos designs** (4 fournis dans VISUELS_PRODUITS_EMAIL.html)
6. **Créer produits** avec designs
7. **Noter IDs produits** pour intégration API

#### B) CJDropshipping (Équipement)

1. **Créer compte** https://cjdropshipping.com/
2. **Sourcer produits** tactiques sur plateforme
3. **Commander échantillons** (3-5 produits)
4. **Demander branding** (logo WorkoutBrothers)
5. **Configuration** webhook pour tracking automatique

#### C) Bulk Powders (Nutrition White Label)

1. **Contacter** https://www.bulkpowders.com/white-label
2. **Demander devis** pour MOQ 50-100 unités
3. **Envoyer designs étiquettes** (template fourni)
4. **Commander premier batch**

**Temps: Variable (1-2 jours pour setup complet)**

---

### Étape 7: Tester Commande Complète

#### Test en Mode Test Stripe

1. **Ouvrir** générateur d'entraînement
   ```
   https://workoutbrothers-votreprenom.herokuapp.com/workout-generator.html
   ```

2. **Créer compte** utilisateur test
   - Email: test@example.com
   - Mot de passe: Test123!

3. **Ajouter produit** au panier

4. **Commander** avec carte test Stripe :
   ```
   Numéro: 4242 4242 4242 4242
   Date: 12/34
   CVC: 123
   ```

5. **Vérifier** :
   - ✅ Email confirmation reçu
   - ✅ Commande visible dans dashboard
   - ✅ Statut "paid" dans base de données

**Temps: 5 minutes**

---

### Étape 8: Monitoring & Rapports Automatiques

**Ce qui fonctionne automatiquement dès maintenant :**

1. **Chaque lundi 9h** : Email rapport hebdomadaire à `ADMIN_EMAIL`
   - Chiffre d'affaires semaine
   - Nombre commandes
   - Top 5 produits
   - Alertes stock
   - Nouveaux clients

2. **Chaque jour 8h** : Vérification stock automatique
   - Logs alertes dans Heroku
   - Inclus dans rapport hebdomadaire

3. **À chaque commande** : Email confirmation client automatique

**Voir les logs en temps réel** :
```bash
# Installer Heroku CLI
# Puis:
heroku logs --tail --app workoutbrothers-votreprenom
```

---

## 📊 RÉCAPITULATIF - VOTRE SYSTÈME

### ✅ Ce qui EST Automatisé

| Fonction | Status | Fréquence |
|----------|--------|-----------|
| Emails confirmation commande | ✅ Automatique | À chaque vente |
| Rapports hebdomadaires | ✅ Automatique | Lundi 9h |
| Alertes stock bas | ✅ Automatique | Quotidien 8h |
| Gestion paiements Stripe | ✅ Automatique | Temps réel |
| Webhooks Stripe | ✅ Automatique | Temps réel |
| API produits/commandes | ✅ Automatique | 24/7 |
| Dashboard statistiques | ✅ Automatique | Temps réel |

### ⚙️ Ce que VOUS Gérez

| Fonction | Fréquence | Outil |
|----------|-----------|-------|
| Upload designs textiles POD | Une fois | Printful |
| Commander stock nutrition | Mensuel | Bulk Powders |
| Répondre aux clients | Variable | Email |
| Gérer pub Facebook/Instagram | Quotidien | Ads Manager |
| Analyser rapports hebdo | Hebdo | Email |

---

## 💰 FLUX D'ARGENT

**Voici exactement comment vous êtes payé :**

1. **Client commande** sur votre site → 89.99€
2. **Stripe prend** 2.9% + 0.30€ = 2.91€
3. **Reste** 87.08€ dans votre balance Stripe
4. **Tous les 2-7 jours**, Stripe vire sur votre IBAN
5. **Vous payez** fournisseur (ex: CJDropshipping 25€)
6. **Profit net** = 62.08€

**Pas besoin PayPal** - Stripe gère tout et vire sur votre compte bancaire directement.

---

## 🎯 CHECKLIST FINALE

- [ ] Compte Heroku créé
- [ ] App déployée (bouton Deploy)
- [ ] API fonctionne (/api/health = OK)
- [ ] Stripe configuré (clés API + webhook)
- [ ] IBAN connecté à Stripe
- [ ] SendGrid configuré (emails)
- [ ] ADMIN_EMAIL configuré (rapports hebdo)
- [ ] Printful compte créé
- [ ] 1-2 designs uploadés sur Printful
- [ ] Test commande effectué
- [ ] Email confirmation reçu

**Une fois checklist complète = VOTRE BUSINESS EST OPÉRATIONNEL ! 🚀**

---

## 📞 Support

**Problème déploiement ?**
- Logs Heroku: `heroku logs --tail`
- Vérifier Config Vars dans Settings

**Problème paiements ?**
- Vérifier clés Stripe dans Config Vars
- Tester avec carte 4242 4242 4242 4242

**Emails non reçus ?**
- Vérifier SENDGRID_API_KEY configuré
- Vérifier ADMIN_EMAIL correct
- Vérifier expéditeur vérifié dans SendGrid

---

**WorkoutBrothers - Préparation Physique & Mentale**

*Votre business automatisé est prêt à générer de l'argent !*

🚀 **Déployez maintenant avec le bouton Deploy dans README.md**
