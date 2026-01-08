# 📘 Guide de Déploiement BaneWorkout

Guide complet pour déployer votre application BaneWorkout en ligne et la rendre accessible au public.

---

## 📋 Table des Matières

1. [Configuration PayPal](#configuration-paypal)
2. [Déploiement GitHub Pages](#déploiement-github-pages)
3. [Déploiement Vercel](#déploiement-vercel)
4. [Déploiement Netlify](#déploiement-netlify)
5. [Configuration Domaine Personnalisé](#configuration-domaine-personnalisé)
6. [Passer PayPal en Production](#passer-paypal-en-production)
7. [Tests et Validation](#tests-et-validation)

---

## 🔧 Configuration PayPal

### Étape 1: Créer un Compte PayPal Business

1. Allez sur [PayPal Business](https://www.paypal.com/business)
2. Créez un compte professionnel (gratuit)
3. Vérifiez votre identité et ajoutez vos informations bancaires

### Étape 2: Obtenir vos Identifiants API

#### Mode SANDBOX (Tests)

1. Allez sur [PayPal Developer](https://developer.paypal.com/)
2. Connectez-vous avec votre compte PayPal
3. Allez dans **"Dashboard" → "My Apps & Credentials"**
4. Sous **"Sandbox"**, cliquez sur **"Create App"**
5. Donnez un nom à votre app (ex: "BaneWorkout Sandbox")
6. Copiez le **Client ID** (commence par `AXXXxxx...`)
7. Ce Client ID de sandbox est pour les tests uniquement

#### Mode PRODUCTION (Paiements Réels)

1. Sur la même page "My Apps & Credentials"
2. Basculez l'onglet de **"Sandbox"** à **"Live"**
3. Cliquez sur **"Create App"**
4. Donnez un nom à votre app (ex: "BaneWorkout Live")
5. Copiez le **Client ID de production**
6. ⚠️ **Gardez ce Client ID secret et sécurisé !**

### Étape 3: Configurer le Client ID dans l'Application

Dans le fichier `workout-generator.html`, ligne ~6 :

```html
<!-- Remplacez YOUR_PAYPAL_CLIENT_ID par votre Client ID -->
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=EUR"></script>
```

**Pour les tests (Sandbox):**
```html
<script src="https://www.paypal.com/sdk/js?client-id=VOTRE_CLIENT_ID_SANDBOX&currency=EUR"></script>
```

**Pour la production (Live):**
```html
<script src="https://www.paypal.com/sdk/js?client-id=VOTRE_CLIENT_ID_LIVE&currency=EUR"></script>
```

### Étape 4: Modifier le Prix (Optionnel)

Dans le fichier `workout-generator.html`, ligne ~193 :

```javascript
const PAYPAL_PRICE = '9.90'; // Modifiez ici le prix en euros
```

Vous pouvez changer cette valeur à tout moment (ex: `'19.90'`, `'4.99'`, etc.)

---

## 🚀 Déploiement GitHub Pages

### Avantages
- ✅ Gratuit
- ✅ HTTPS automatique
- ✅ Hébergement illimité
- ✅ Très simple

### Instructions

1. **Assurez-vous que votre code est sur GitHub**
   ```bash
   git add .
   git commit -m "Configuration PayPal et préparation déploiement"
   git push origin main
   ```

2. **Activer GitHub Pages**
   - Allez sur votre repository GitHub
   - Cliquez sur **"Settings"**
   - Dans le menu de gauche, cliquez sur **"Pages"**
   - Sous "Source", sélectionnez **"main"** (ou votre branche principale)
   - Sélectionnez **"/ (root)"** comme dossier
   - Cliquez sur **"Save"**

3. **Attendre le déploiement**
   - GitHub va construire votre site (1-2 minutes)
   - Votre site sera disponible à : `https://VOTRE_USERNAME.github.io/BaneWorkout/`

4. **Accéder à votre application**
   - URL finale : `https://VOTRE_USERNAME.github.io/BaneWorkout/workout-generator.html`
   - Vous pouvez créer un fichier `index.html` qui redirige vers `workout-generator.html`

### Créer une Page d'Accueil (Optionnel)

Créez `index.html` à la racine :

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=workout-generator.html">
    <title>BaneWorkout - Redirection</title>
</head>
<body>
    <p>Redirection vers BaneWorkout...</p>
    <a href="workout-generator.html">Cliquez ici si vous n'êtes pas redirigé</a>
</body>
</html>
```

---

## ⚡ Déploiement Vercel

### Avantages
- ✅ Gratuit
- ✅ Très rapide
- ✅ Builds automatiques
- ✅ Prévisualisation des PR

### Instructions

1. **Créer un compte Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Inscrivez-vous avec votre compte GitHub

2. **Importer votre projet**
   - Cliquez sur **"New Project"**
   - Sélectionnez votre repository `BaneWorkout`
   - Cliquez sur **"Import"**

3. **Configuration du projet**
   - **Framework Preset**: `Other` (ou laissez vide)
   - **Root Directory**: `./` (racine)
   - **Build Command**: Laissez vide
   - **Output Directory**: `./`

4. **Déployer**
   - Cliquez sur **"Deploy"**
   - Attendez 30-60 secondes
   - Votre site est en ligne !

5. **URL de votre application**
   - Vercel vous donne une URL : `https://bane-workout-xxx.vercel.app`
   - Vous pouvez accéder à : `https://bane-workout-xxx.vercel.app/workout-generator.html`

---

## 🌐 Déploiement Netlify

### Avantages
- ✅ Gratuit
- ✅ Drag & drop simple
- ✅ Formulaires intégrés
- ✅ Redirections faciles

### Instructions

#### Méthode 1: Drag & Drop (Plus Simple)

1. **Créer un compte Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Inscrivez-vous gratuitement

2. **Préparer vos fichiers**
   - Téléchargez votre repository en ZIP
   - Ou gardez juste le dossier local

3. **Déployer**
   - Sur Netlify, faites glisser votre dossier dans la zone de drop
   - Attendez le déploiement (30 secondes)
   - Votre site est en ligne !

#### Méthode 2: Git Integration

1. Connectez Netlify à votre GitHub
2. Sélectionnez le repository `BaneWorkout`
3. Configuration :
   - **Build command**: Laissez vide
   - **Publish directory**: `./`
4. Cliquez sur **"Deploy site"**

5. **Créer des redirections (Optionnel)**

Créez `netlify.toml` à la racine :

```toml
[[redirects]]
  from = "/"
  to = "/workout-generator.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/workout-generator.html"
  status = 200
```

---

## 🌍 Configuration Domaine Personnalisé

### GitHub Pages

1. Achetez un domaine (ex: `baneworkout.com`) sur Namecheap, OVH, etc.
2. Dans les DNS de votre domaine, ajoutez :
   ```
   Type: CNAME
   Nom: www
   Valeur: VOTRE_USERNAME.github.io
   ```
3. Dans GitHub Settings → Pages, ajoutez votre domaine personnalisé
4. Attendez la propagation DNS (2-48h)

### Vercel

1. Dans votre projet Vercel, allez dans **"Settings" → "Domains"**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS
4. Vercel configure automatiquement le SSL

### Netlify

1. Dans votre site Netlify, allez dans **"Domain settings"**
2. Cliquez sur **"Add custom domain"**
3. Entrez votre domaine
4. Configurez les DNS selon les instructions
5. SSL automatique en quelques minutes

---

## 💳 Passer PayPal en Production

### ⚠️ IMPORTANT : À faire avant de collecter de vrais paiements !

### Étape 1: Obtenir le Client ID de Production

1. Allez sur [PayPal Developer](https://developer.paypal.com/)
2. **"My Apps & Credentials" → Onglet "Live"**
3. Créez une app ou utilisez une existante
4. Copiez le **Client ID Live**

### Étape 2: Remplacer dans le Code

Dans `workout-generator.html`, ligne ~6 :

**AVANT (Sandbox - Tests):**
```html
<script src="https://www.paypal.com/sdk/js?client-id=SANDBOX_CLIENT_ID&currency=EUR"></script>
```

**APRÈS (Production - Vrais Paiements):**
```html
<script src="https://www.paypal.com/sdk/js?client-id=VOTRE_CLIENT_ID_LIVE&currency=EUR"></script>
```

### Étape 3: Modifier le Message Sandbox

Dans `workout-generator.html`, ligne ~387, supprimez ou modifiez :

**AVANT:**
```html
<p style="color: #666; font-size: 0.9em; margin-top: 20px;">
    💳 Paiement sécurisé par PayPal • Mode Sandbox activé pour les tests
</p>
```

**APRÈS:**
```html
<p style="color: #666; font-size: 0.9em; margin-top: 20px;">
    💳 Paiement 100% sécurisé par PayPal
</p>
```

### Étape 4: Tester en Production

1. Utilisez une **vraie carte bancaire** ou un **vrai compte PayPal**
2. Effectuez un paiement de test de 0.01€
3. Vérifiez que le paiement apparaît dans votre compte PayPal Business
4. Vérifiez que l'application débloque bien le contenu

### Étape 5: Déployer en Production

```bash
git add workout-generator.html
git commit -m "Passage PayPal en mode production"
git push origin main
```

Le déploiement se fera automatiquement sur GitHub Pages / Vercel / Netlify.

---

## ✅ Tests et Validation

### Tests à Effectuer Avant la Mise en Ligne

#### 1. Test du Paiement (Sandbox)
- [ ] Le bouton PayPal s'affiche correctement
- [ ] Le paiement test fonctionne
- [ ] Le contenu se débloque après paiement
- [ ] Le message de succès s'affiche

#### 2. Test de Génération
- [ ] Tester avec 1 jour d'entraînement
- [ ] Tester avec 6 jours d'entraînement
- [ ] Tester tous les objectifs (Force, Masse, Endurance, etc.)
- [ ] Tester tous les niveaux (Débutant, Intermédiaire, Avancé)
- [ ] Vérifier la cohérence des programmes générés

#### 3. Test des Fonctionnalités
- [ ] Le bouton "Copier" fonctionne
- [ ] Le bouton "Télécharger" fonctionne
- [ ] Le fichier téléchargé contient toutes les informations
- [ ] Les messages d'erreur s'affichent correctement
- [ ] La validation du formulaire fonctionne

#### 4. Test Mobile
- [ ] L'application est responsive sur smartphone
- [ ] Les boutons PayPal fonctionnent sur mobile
- [ ] La navigation est fluide
- [ ] Tout le texte est lisible

#### 5. Test du Footer
- [ ] Le footer s'affiche en bas de page
- [ ] Le lien Instagram fonctionne
- [ ] La page Mentions Légales s'affiche
- [ ] Le retour depuis Mentions Légales fonctionne

### Validation Finale

```bash
# Vérifiez qu'il n'y a pas d'erreurs JavaScript
# Ouvrez la console développeur (F12) et vérifiez qu'il n'y a pas d'erreurs rouges

# Testez le paiement en mode Sandbox
# Utilisez les comptes de test PayPal pour simuler un paiement

# Vérifiez le responsive
# Testez sur plusieurs tailles d'écran (mobile, tablette, desktop)
```

---

## 🎯 Checklist de Déploiement

### Avant le Déploiement
- [ ] Client ID PayPal configuré (Sandbox pour tests)
- [ ] Prix défini correctement (9.90€ ou autre)
- [ ] Toutes les traductions en français complètes
- [ ] Footer avec mentions légales présent
- [ ] Tests complets effectués

### Déploiement Initial (Tests)
- [ ] Déployé sur GitHub Pages / Vercel / Netlify
- [ ] URL accessible publiquement
- [ ] Mode Sandbox PayPal actif
- [ ] Tests effectués avec URL publique

### Passage en Production
- [ ] Client ID Live PayPal configuré
- [ ] Message "Mode Sandbox" supprimé
- [ ] Test paiement réel effectué (0.01€)
- [ ] Vérification réception paiement sur compte PayPal
- [ ] Déployé en production

### Après le Déploiement
- [ ] URL partagée sur Instagram
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Analytics configuré (optionnel)
- [ ] Monitoring des paiements actif

---

## 🆘 Dépannage

### Problème: Le bouton PayPal ne s'affiche pas

**Solutions:**
- Vérifiez que le Client ID est correct
- Vérifiez qu'il n'y a pas d'erreur dans la console (F12)
- Vérifiez que le script PayPal est bien chargé
- Testez sur un autre navigateur

### Problème: Le paiement ne débloque pas le contenu

**Solutions:**
- Vérifiez la console JavaScript pour les erreurs
- Testez en mode navigation privée (cache)
- Vérifiez que la fonction `onApprove` s'exécute bien

### Problème: "Invalid Client ID"

**Solutions:**
- Vérifiez que vous utilisez le bon Client ID (Live ou Sandbox)
- Assurez-vous de copier le Client ID complet
- Régénérez un nouveau Client ID si nécessaire

### Problème: Le site ne se charge pas après déploiement

**Solutions:**
- Attendez 2-5 minutes (propagation)
- Videz le cache de votre navigateur
- Vérifiez les logs de déploiement
- Sur GitHub Pages, vérifiez que Pages est activé

---

## 📞 Support

### Ressources Utiles
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

### Contact
- Email: therealbane666@gmail.com
- Instagram: @workoutbrothers

---

## 🎉 Félicitations !

Une fois le déploiement terminé, votre application BaneWorkout est prête à générer des revenus !

**Prochaines étapes:**
1. Partagez l'URL sur Instagram
2. Créez des visuels promotionnels
3. Lancez une campagne publicitaire
4. Surveillez les paiements dans votre dashboard PayPal

**Bonne chance ! 💪🚀**
