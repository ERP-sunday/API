# Guide de déploiement Vercel - Tabbeo Backend

## ✅ Fichiers créés
- `vercel.json` : Configuration Vercel pour votre API NestJS
- `VERCEL_ENV_VARS.md` : Liste des variables d'environnement à configurer

## 🚀 Étapes de déploiement

### 1. Préparer MongoDB Atlas
- Créez un cluster MongoDB Atlas si ce n'est pas fait
- Configurez l'accès réseau : `0.0.0.0/0` (pour Vercel)
- Récupérez votre URL de connexion

### 2. Tester localement
```bash
cd backend
npm run build
npm run start:prod
```

### 3. Déployer sur Vercel

#### Option A : Interface web
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre repository GitHub
3. Importez le projet
4. Configurez les variables d'environnement (voir `VERCEL_ENV_VARS.md`)
5. Déployez !

#### Option B : CLI
```bash
npm i -g vercel
vercel
# Suivez les instructions
```

### 4. Configurer les variables d'environnement
Dans les settings Vercel, ajoutez TOUTES les variables listées dans `VERCEL_ENV_VARS.md`

## 🌐 URLs après déploiement
- API : `https://votre-app.vercel.app/api/`
- Documentation Swagger : `https://votre-app.vercel.app/api/documentation`

## ⚠️ Points importants
- Le build peut prendre quelques minutes
- Vérifiez les logs de déploiement en cas d'erreur
- Testez tous vos endpoints après déploiement
- Les fonctions Vercel ont un timeout de 30 secondes max
