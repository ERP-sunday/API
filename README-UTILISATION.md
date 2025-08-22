# 👤 Manuel d'Utilisation - Tabbeo Backend

## 🎯 Introduction

Ce manuel guide les développeurs et administrateurs dans l'utilisation quotidienne de l'infrastructure Tabbeo Backend.

## 🚀 Démarrage Rapide

### Développement Local

```bash
# Démarrer l'environnement de développement
docker-compose -f docker-compose.dev.yml up -d

# Arrêter les services
docker-compose -f docker-compose.dev.yml down
```

### Production

```bash
# Démarrer la production
docker-compose -f docker-compose.prod.yml up -d

# Arrêter les services
docker-compose -f docker-compose.prod.yml down
```

## 🔧 Commandes Essentielles

### Gestion des Conteneurs

```bash
# Voir les conteneurs actifs
docker ps

# Voir tous les conteneurs
docker ps -a

# Redémarrer un service spécifique
docker-compose -f docker-compose.prod.yml restart backend

# Reconstruire un service
docker-compose -f docker-compose.prod.yml up -d --build backend
```

### Logs et Monitoring

```bash
# Voir les logs en temps réel
docker-compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f traefik

# Logs avec limite de lignes
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

### Accès aux Conteneurs

```bash
# Accéder au shell du backend
docker-compose -f docker-compose.prod.yml exec backend sh

# Exécuter une commande dans le backend
docker-compose -f docker-compose.prod.yml exec backend npm run [commande]

# Accéder au conteneur Traefik
docker-compose -f docker-compose.prod.yml exec traefik sh
```

## 🌐 Endpoints et Accès

### URLs Principales

#### Développement
- **Backend API** : https://backend.tabbeo.app
- **Dashboard Traefik** : http://localhost:80

#### Production
- **Backend API** : https://backend.tabbeo.app
- **Frontend** : https://frontend.tabbeo.app
- **Dashboard Traefik** : http://[IP-SERVEUR]:8080 (si activé)

### Tests de Connectivité

```bash
# Tester l'API Backend
curl -I https://backend.tabbeo.app/health

# Tester avec authentification (exemple)
curl -H "Authorization: Bearer [TOKEN]" https://backend.tabbeo.app/api/v1/users

# Vérifier les certificats SSL
openssl s_client -connect backend.tabbeo.app:443 -servername backend.tabbeo.app
```

## 📁 Structure des Fichiers

```
Tabbeo backend/
├── docker-compose.dev.yml      # Configuration développement
├── docker-compose.prod.yml     # Configuration production
├── certs-traefik.yml          # Configuration SSL Traefik
├── backend/                    # Code source Backend
│   ├── Dockerfile.dev         # Docker dev
│   ├── Dockerfile.prod        # Docker prod
│   └── .env                   # Variables d'environnement
├── frontend/                   # Code source Frontend (prod)
│   ├── Dockerfile.prod        # Docker prod
│   └── .env                   # Variables d'environnement
└── certs/                     # Certificats SSL
    ├── tabbeo.crt
    └── tabbeo.key
```

## ⚙️ Configuration

### Variables d'Environnement

#### Backend (.env)
```bash
# Éditer les variables d'environnement
nano backend/.env

# Variables principales
NODE_ENV=development|production
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
API_KEY=your-api-key
```

#### Frontend (.env) - Production uniquement
```bash
# Éditer les variables d'environnement
nano frontend/.env

# Variables principales
REACT_APP_API_URL=https://backend.tabbeo.app
REACT_APP_ENV=production
```

### Modification de Configuration

```bash
# Redémarrer après modification des .env
docker-compose -f docker-compose.prod.yml restart backend

# Reconstruction complète si nécessaire
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔄 Opérations Courantes

### Sauvegarde

```bash
# Exporter les données de la base (exemple)
docker-compose -f docker-compose.prod.yml exec backend pg_dump [database] > backup.sql

# Sauvegarder les volumes Docker
docker run --rm -v tabbeo-backend_data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz /data
```

### Mise à l'Échelle

```bash
# Augmenter le nombre d'instances backend
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Nettoyage

```bash
# Supprimer les conteneurs arrêtés
docker container prune -f

# Supprimer les images non utilisées
docker image prune -f

# Nettoyage complet (attention !)
docker system prune -af
```

## 📊 Monitoring et Performance

### Métriques Docker

```bash
# Utilisation des ressources
docker stats

# Informations détaillées d'un conteneur
docker inspect [container-name]

# Espace disque utilisé
docker system df
```

### Traefik Dashboard

Accéder au dashboard Traefik pour :
- Visualiser les routes configurées
- Surveiller les certificats SSL
- Voir les métriques de trafic
- Diagnostiquer les problèmes de routing

## 🛠️ Développement

### Mode Développement

```bash
# Démarrer avec rechargement automatique
docker-compose -f docker-compose.dev.yml up -d

# Suivre les logs du backend
docker-compose -f docker-compose.dev.yml logs -f backend

# Accéder au shell pour débugger
docker-compose -f docker-compose.dev.yml exec backend sh
```

### Tests

```bash
# Exécuter les tests dans le conteneur
docker-compose -f docker-compose.dev.yml exec backend npm test

# Tests avec couverture
docker-compose -f docker-compose.dev.yml exec backend npm run test:coverage

# Linter
docker-compose -f docker-compose.dev.yml exec backend npm run lint
```

## 🔐 Sécurité

### Certificats SSL

```bash
# Vérifier l'expiration des certificats
openssl x509 -in certs/tabbeo.crt -text -noout | grep "Not After"

# Renouveler les certificats Let's Encrypt (automatique)
docker-compose -f docker-compose.prod.yml restart traefik
```

### Accès et Authentification

```bash
# Générer un token JWT (exemple)
docker-compose -f docker-compose.prod.yml exec backend node scripts/generate-token.js

# Vérifier les permissions
docker-compose -f docker-compose.prod.yml exec backend ls -la /app
```

## 🆘 Dépannage Rapide

### Service ne répond pas

```bash
# 1. Vérifier l'état des conteneurs
docker ps

# 2. Vérifier les logs
docker-compose -f docker-compose.prod.yml logs [service]

# 3. Redémarrer le service
docker-compose -f docker-compose.prod.yml restart [service]
```

### Problèmes SSL

```bash
# Vérifier la configuration Traefik
docker-compose -f docker-compose.prod.yml exec traefik cat /etc/traefik/certs-traefik.yml

# Vérifier les certificats montés
docker-compose -f docker-compose.prod.yml exec traefik ls -la /etc/certs/
```

### Problèmes de Réseau

```bash
# Vérifier les réseaux Docker
docker network ls
docker network inspect tabbeo-backend_backend-network

# Tester la connectivité entre conteneurs
docker-compose -f docker-compose.prod.yml exec backend ping traefik
```

## 📞 Support et Resources

- **Logs** : Toujours commencer par vérifier les logs
- **Documentation Docker** : https://docs.docker.com/
- **Documentation Traefik** : https://doc.traefik.io/traefik/
- **Monitoring** : Utiliser le dashboard Traefik et `docker stats`

---

**💡 Conseil** : Garder ce manuel à portée de main lors des opérations quotidiennes et personnaliser les commandes selon vos besoins spécifiques.
