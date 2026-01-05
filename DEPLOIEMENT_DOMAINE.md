# 🌐 Configuration Domaine baneworkout.com

Ce guide vous explique comment configurer votre domaine personnalisé `baneworkout.com` pour votre application WorkoutBrothers.

---

## Option 1: Railway (Recommandé - Plus Rapide) ⚡

Railway offre la configuration la plus simple et la plus rapide.

### Étapes:

1. **Déployer sur Railway**
   - Connectez-vous à [Railway](https://railway.app)
   - Créez un nouveau projet depuis votre dépôt GitHub
   - Railway détectera automatiquement votre configuration

2. **Configurer le domaine personnalisé**
   - Dans Railway: `Settings → Networking → Custom Domain`
   - Cliquez sur `Add Domain`
   - Entrez: `baneworkout.com`
   - Railway vous fournira un enregistrement CNAME

3. **Configurer DNS chez votre registrar**
   ```
   Type: CNAME
   Name: @ (ou www pour www.baneworkout.com)
   Value: [votre-app].railway.app
   TTL: 3600
   ```

4. **SSL/HTTPS**
   - Railway configure automatiquement SSL/HTTPS via Let's Encrypt
   - Aucune configuration supplémentaire nécessaire

### Variables d'environnement Railway:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=[généré automatiquement]
NODE_ENV=production
DOMAIN=baneworkout.com
```

---

## Option 2: Render 🎨

Render offre également un excellent support pour les domaines personnalisés.

### Étapes:

1. **Déployer sur Render**
   - Connectez-vous à [Render](https://render.com)
   - Créez un nouveau Web Service
   - Connectez votre dépôt GitHub
   - Render utilisera automatiquement `render.yaml`

2. **Configurer le domaine personnalisé**
   - Dans Render: `Settings → Custom Domain`
   - Cliquez sur `Add Custom Domain`
   - Entrez: `baneworkout.com`
   - Render vous fournira une adresse IP ou un CNAME

3. **Configurer DNS**
   
   **Si Render fournit une IP (A record):**
   ```
   Type: A
   Name: @
   Value: [IP fournie par Render]
   TTL: 3600
   ```
   
   **Si Render fournit un CNAME:**
   ```
   Type: CNAME
   Name: @
   Value: [votre-app].onrender.com
   TTL: 3600
   ```

4. **SSL/HTTPS**
   - Render configure automatiquement SSL/HTTPS
   - Vérifiez dans `Settings → Custom Domain`

---

## Option 3: Vercel (Frontend) + Railway/Render (Backend) 🚀

Pour une architecture séparée frontend/backend:

### Frontend sur Vercel:

1. Déployez le dossier `frontend/` sur Vercel
2. Configurez le domaine `baneworkout.com` sur Vercel
3. Variables d'environnement:
   ```
   NEXT_PUBLIC_API_URL=https://api.baneworkout.com
   ```

### Backend sur Railway/Render:

1. Déployez le backend sur Railway ou Render
2. Configurez le sous-domaine `api.baneworkout.com`
3. Configurez CORS pour accepter `baneworkout.com`

---

## Option 4: Heroku (Traditionnel) 🟣

### Étapes:

1. **Déployer sur Heroku**
   ```bash
   heroku create workoutbrothers
   git push heroku main
   ```

2. **Ajouter le domaine**
   ```bash
   heroku domains:add baneworkout.com
   heroku domains:add www.baneworkout.com
   ```

3. **Configurer DNS**
   ```
   Type: CNAME
   Name: @
   Value: [votre-app].herokuapp.com
   TTL: 3600
   ```

4. **SSL**
   - Heroku fournit SSL automatiquement avec Automated Certificate Management

---

## Vérification de la Configuration DNS 🔍

Après avoir configuré vos enregistrements DNS, utilisez ces outils pour vérifier:

```bash
# Vérifier la propagation DNS
nslookup baneworkout.com

# Vérifier avec dig
dig baneworkout.com

# Vérifier en ligne
https://www.whatsmydns.net/
```

**Note:** La propagation DNS peut prendre de 5 minutes à 48 heures.

---

## Configuration CORS pour Domaine Personnalisé 🔒

Assurez-vous que votre backend accepte les requêtes de votre domaine:

```javascript
// Dans backend/index.js
app.use(cors({
  origin: [
    'https://baneworkout.com',
    'https://www.baneworkout.com',
    'http://localhost:3000' // Pour développement local
  ],
  credentials: true
}));
```

---

## Troubleshooting 🛠️

### Le site ne se charge pas:
- Vérifiez la propagation DNS (peut prendre jusqu'à 48h)
- Vérifiez que le certificat SSL est actif
- Vérifiez les logs de votre plateforme de déploiement

### Erreur CORS:
- Vérifiez que votre domaine est dans la configuration CORS
- Vérifiez que HTTPS est activé

### Certificat SSL invalide:
- Attendez que Let's Encrypt génère le certificat (peut prendre 5-10 minutes)
- Forcez le renouvellement dans les paramètres de la plateforme

---

## Checklist Finale ✅

- [ ] Domaine configuré sur la plateforme de déploiement
- [ ] Enregistrements DNS configurés chez le registrar
- [ ] SSL/HTTPS actif
- [ ] CORS configuré pour le domaine
- [ ] Variables d'environnement `DOMAIN` définie
- [ ] Test: `https://baneworkout.com/api/health` retourne OK
- [ ] Test: `https://baneworkout.com` charge correctement

---

**🎉 Félicitations! Votre domaine baneworkout.com est maintenant configuré!**
