# Guide de déploiement Vercel - Tabbeo Backend

## ✅ Configuration terminée
- `vercel.json` configuré pour les fonctions serverless
- `api/serverless.ts` créé comme point d'entrée principal
- Types TypeScript corrigés

## 🔧 Variables d'environnement à configurer sur Vercel

### Variables requises :
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/tabbeo?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_super_securise_ici
JWT_REFRESH_SECRET=votre_secret_refresh_jwt_super_securise_ici
JWT_EXPIRATION=15m
REFRESH_JWT_EXPIRATION=7d
```

### Génération des secrets JWT :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚀 Étapes de déploiement

### 1. Préparer MongoDB Atlas
- Créez un cluster MongoDB Atlas
- Configurez l'accès réseau : `0.0.0.0/0` (pour Vercel)
- Récupérez votre URL de connexion

### 2. Tester localement
```bash
npm run build
npm run start:prod
```

### 3. Déployer sur Vercel

#### Option A : Interface web
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre repository GitHub
3. **IMPORTANT** : Définissez le "Root Directory" sur `backend`
4. Importez le projet
5. Configurez les variables d'environnement
6. Déployez !

#### Option B : CLI
```bash
npm i -g vercel
vercel
# Suivez les instructions
```

## 🌐 URLs après déploiement
- API : `https://votre-app.vercel.app/api/`
- Documentation Swagger : `https://votre-app.vercel.app/api/documentation`

## ⚠️ Points importants
- **Configurez le Root Directory sur `backend` dans Vercel**
- Ajoutez TOUTES les variables d'environnement avant le déploiement
- Le build peut prendre quelques minutes
- Testez tous vos endpoints après déploiement
- Les fonctions Vercel ont un timeout de 30 secondes max
