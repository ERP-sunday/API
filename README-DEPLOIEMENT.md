# 📦 Manuel de Déploiement - Tabbeo Backend

## 🎯 Vue d'ensemble

Ce manuel décrit la procédure de déploiement de l'application Tabbeo avec son architecture microservices utilisant Docker, Traefik et les certificats SSL.

## 🏗️ Architecture

- **Traefik** : Reverse proxy et load balancer (ports 80/443)
- **Backend** : API Node.js (port 4000)
- **Frontend** : Application React (port 3000) - en production uniquement
- **Réseaux Docker** : `backend-network` et `front-network`

## 🔧 Prérequis

### Système
- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Git
- Accès au domaine `tabbeo.app` et ses sous-domaines

### Certificats SSL
- Certificats auto-signés pour le développement
- Let's Encrypt configuré pour la production

## 🚀 Déploiement en Développement

### 1. Préparation de l'environnement

```bash
# Cloner le repository
git clone <repository-url>
cd "Tabbeo backend"

# Créer les fichiers d'environnement
cp backend/.env.example backend/.env
```

### 2. Configuration des certificats (Développement)

Les certificats auto-signés doivent être placés dans le dossier `certs/` :
- `tabbeo.crt` : Certificat public
- `tabbeo.key` : Clé privée

### 3. Configuration DNS locale

Ajouter au fichier `/etc/hosts` :
```
127.0.0.1 backend.tabbeo.app
```

### 4. Lancement des services

```bash
# Démarrer en mode développement
docker-compose -f docker-compose.dev.yml up -d

# Vérifier les logs
docker-compose -f docker-compose.dev.yml logs -f
```

### 5. Vérification

- Backend API : https://backend.tabbeo.app
- Dashboard Traefik : http://localhost:80 (API insecure activée)

## 🏭 Déploiement en Production

### 1. Préparation du serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configuration DNS

Configurer les enregistrements DNS :
- `backend.tabbeo.app` → IP du serveur
- `frontend.tabbeo.app` → IP du serveur

### 3. Variables d'environnement

```bash
# Backend
cp backend/.env.example backend/.env
# Configurer les variables de production dans backend/.env

# Frontend (si applicable)
cp frontend/.env.example frontend/.env
# Configurer les variables de production dans frontend/.env
```

### 4. Certificats SSL (Let's Encrypt)

```bash
# Créer le dossier pour Let's Encrypt
mkdir -p letsencrypt
chmod 600 letsencrypt
```

⚠️ **Note** : Décommenter les lignes Let's Encrypt dans `docker-compose.prod.yml` avant le déploiement.

### 5. Déploiement

```bash
# Construire et démarrer
docker-compose -f docker-compose.prod.yml up -d --build

# Surveiller les logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 6. Vérification Post-Déploiement

```bash
# Vérifier les conteneurs
docker ps

# Tester les endpoints
curl -I https://backend.tabbeo.app/health
curl -I https://frontend.tabbeo.app

# Vérifier les certificats SSL
openssl s_client -connect backend.tabbeo.app:443 -servername backend.tabbeo.app
```

## 🔒 Sécurité

### Production
- Désactiver l'API Traefik insecure (`--api.insecure=false`)
- Configurer un pare-feu (UFW)
- Mettre en place la surveillance des logs
- Sauvegardes régulières

### Pare-feu UFW
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📊 Monitoring

### Logs
```bash
# Logs de tous les services
docker-compose -f docker-compose.prod.yml logs

# Logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs traefik
```

### Métriques Traefik
- Dashboard Traefik (si activé) : http://IP:8080
- Métriques Prometheus disponibles

## 🆘 Dépannage

### Problèmes courants

1. **Certificats SSL invalides**
   ```bash
   # Vérifier les certificats
   docker exec traefik ls -la /etc/certs/
   ```

2. **Services non accessibles**
   ```bash
   # Vérifier les réseaux Docker
   docker network ls
   docker network inspect tabbeo-backend_backend-network
   ```

3. **Problèmes de build**
   ```bash
   # Reconstruction complète
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
   ```

## 📝 Variables d'environnement importantes

### Backend (.env)
```
NODE_ENV=production
PORT=4000
DATABASE_URL=
JWT_SECRET=
# Autres variables spécifiques à l'application
```

## 🔄 Rollback

En cas de problème :
```bash
# Arrêter les services
docker-compose -f docker-compose.prod.yml down

# Revenir à la version précédente
git checkout <commit-precedent>

# Redéployer
docker-compose -f docker-compose.prod.yml up -d --build
```

---

**📞 Support** : En cas de problème, vérifier les logs et consulter la documentation technique.
