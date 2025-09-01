# Variables d'environnement pour Vercel

## Variables requises à configurer sur Vercel :

### Base de données
- `MONGO_URL` : URL de connexion MongoDB Atlas
  - Exemple : `mongodb+srv://username:password@cluster.mongodb.net/tabbeo?retryWrites=true&w=majority`

### JWT Configuration
- `JWT_SECRET` : Secret pour signer les tokens JWT (générée aléatoirement, très sécurisée)
- `JWT_REFRESH_SECRET` : Secret pour les refresh tokens (différent du JWT_SECRET)
- `JWT_EXPIRATION` : Durée de vie des tokens JWT (ex: `15m`)
- `REFRESH_JWT_EXPIRATION` : Durée de vie des refresh tokens (ex: `7d`)

### Optionnel
- `PORT` : Port d'écoute (géré automatiquement par Vercel, pas besoin de le configurer)

## Comment configurer sur Vercel :
1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez chaque variable pour les environnements `Production`, `Preview` et `Development`

## Génération des secrets JWT :
```bash
# Pour générer des secrets sécurisés :
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
