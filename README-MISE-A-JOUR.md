# 🔄 Manuel de Mise à Jour - Tabbeo Backend

## 🎯 Vue d'ensemble

Ce manuel décrit les procédures de mise à jour de l'infrastructure Tabbeo Backend, incluant les mises à jour de code, de dépendances, de configuration et d'infrastructure.

## 🚨 Prérequis Avant Mise à Jour

### ✅ Checklist Pré-Mise à Jour

- [ ] Sauvegarde complète de la base de données
- [ ] Sauvegarde des volumes Docker
- [ ] Sauvegarde des fichiers de configuration
- [ ] Test de la mise à jour en environnement de développement
- [ ] Communication aux utilisateurs (si downtime)
- [ ] Plan de rollback préparé

### 📋 Informations à Noter

```bash
# Vérifier la version actuelle
docker-compose -f docker-compose.prod.yml exec backend node -v
docker-compose -f docker-compose.prod.yml exec backend npm list

# Sauvegarder la configuration actuelle
cp docker-compose.prod.yml docker-compose.prod.yml.backup.$(date +%Y%m%d)
cp -r backend/.env backend/.env.backup.$(date +%Y%m%d)
```

## 🔄 Types de Mises à Jour

### 1. Mise à Jour du Code Application

#### 📥 Récupération du Code

```bash
# Se positionner dans le répertoire
cd "/Users/pierre/Documents/dev/Tabbeo backend"

# Sauvegarder les modifications locales (si nécessaire)
git stash push -m "Sauvegarde avant mise à jour $(date)"

# Récupérer les dernières modifications
git fetch origin
git pull origin main
```

#### 🔨 Déploiement du Code

```bash
# Arrêter les services
docker-compose -f docker-compose.prod.yml down

# Reconstruire les images avec les nouvelles modifications
docker-compose -f docker-compose.prod.yml build --no-cache

# Relancer les services
docker-compose -f docker-compose.prod.yml up -d

# Vérifier le déploiement
docker-compose -f docker-compose.prod.yml logs -f
```

### 2. Mise à Jour des Dépendances

#### 📦 Backend (Node.js)

```bash
# Accéder au conteneur backend
docker-compose -f docker-compose.prod.yml exec backend sh

# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour les dépendances (patch/minor)
npm update

# Mise à jour majeure (avec précaution)
npm install package-name@latest

# Sortir du conteneur
exit

# Reconstruire l'image
docker-compose -f docker-compose.prod.yml build backend
docker-compose -f docker-compose.prod.yml up -d backend
```

#### 🌐 Frontend (si applicable)

```bash
# Même procédure pour le frontend
docker-compose -f docker-compose.prod.yml exec frontend sh
npm outdated
npm update
exit

# Reconstruire
docker-compose -f docker-compose.prod.yml build frontend
docker-compose -f docker-compose.prod.yml up -d frontend
```

### 3. Mise à Jour de l'Infrastructure

#### 🐳 Docker et Docker Compose

```bash
# Vérifier les versions actuelles
docker --version
docker-compose --version

# Mise à jour Docker (Ubuntu/Debian)
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Mise à jour Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 🔀 Traefik

```bash
# Vérifier la version actuelle
docker-compose -f docker-compose.prod.yml exec traefik traefik version

# Mettre à jour vers une nouvelle version
# Modifier docker-compose.prod.yml
sed -i 's/traefik:v2\.10/traefik:v2.11/g' docker-compose.prod.yml

# Redéployer Traefik
docker-compose -f docker-compose.prod.yml pull traefik
docker-compose -f docker-compose.prod.yml up -d traefik
```

## 🗄️ Mise à Jour de Base de Données

### Migration des Données

```bash
# Sauvegarde avant migration
docker-compose -f docker-compose.prod.yml exec backend pg_dump database_name > backup_$(date +%Y%m%d).sql

# Exécuter les migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Vérifier l'intégrité
docker-compose -f docker-compose.prod.yml exec backend npm run db:check
```

### Mise à Jour du Schéma

```bash
# Si utilisation d'un ORM (Prisma, Sequelize, etc.)
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Ou migration custom
docker-compose -f docker-compose.prod.yml exec backend node scripts/migrate.js
```

## 🔐 Mise à Jour des Certificats SSL

### Certificats Let's Encrypt (Automatique)

```bash
# Vérifier l'expiration
openssl x509 -in letsencrypt/live/tabbeo.app/cert.pem -text -noout | grep "Not After"

# Forcer le renouvellement (si nécessaire)
docker-compose -f docker-compose.prod.yml exec traefik traefik version
docker-compose -f docker-compose.prod.yml restart traefik
```

### Certificats Manuels

```bash
# Remplacer les certificats dans certs/
cp nouveau-certificat.crt certs/tabbeo.crt
cp nouvelle-cle.key certs/tabbeo.key

# Redémarrer Traefik pour charger les nouveaux certificats
docker-compose -f docker-compose.prod.yml restart traefik
```

## ⚙️ Mise à Jour de Configuration

### Variables d'Environnement

```bash
# Sauvegarder la configuration actuelle
cp backend/.env backend/.env.backup

# Éditer les nouvelles variables
nano backend/.env

# Redémarrer le service concerné
docker-compose -f docker-compose.prod.yml restart backend
```

### Configuration Docker Compose

```bash
# Sauvegarder
cp docker-compose.prod.yml docker-compose.prod.yml.backup

# Appliquer les modifications
nano docker-compose.prod.yml

# Redéployer avec nouvelle configuration
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 Procédure de Mise à Jour Complète

### 🎯 Mise à Jour Majeure (Step by Step)

```bash
# 1. Notification et préparation
echo "Début de la mise à jour $(date)" >> mise-a-jour.log

# 2. Sauvegarde complète
./scripts/backup-complet.sh  # À créer si nécessaire

# 3. Récupération du code
git fetch origin
git checkout main
git pull origin main

# 4. Vérification des changements
git log --oneline HEAD~5..HEAD
git diff HEAD~1 docker-compose.prod.yml

# 5. Test en développement (recommandé)
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build

# 6. Déploiement en production
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 7. Vérification post-déploiement
./scripts/verification-post-deploiement.sh
```

## 🔍 Vérifications Post-Mise à Jour

### Tests Automatiques

```bash
# Santé des services
curl -f https://backend.tabbeo.app/health || echo "❌ Backend KO"
curl -f https://frontend.tabbeo.app || echo "❌ Frontend KO"

# Vérification des conteneurs
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "(backend|frontend|traefik)"

# Tests API
curl -H "Content-Type: application/json" https://backend.tabbeo.app/api/v1/status
```

### Monitoring

```bash
# Vérifier les logs pour les erreurs
docker-compose -f docker-compose.prod.yml logs --tail=50 | grep -i error

# Métriques de performance
docker stats --no-stream

# Espace disque
df -h
docker system df
```

## 🚨 Procédure de Rollback

### Rollback Rapide

```bash
# 1. Identifier la version précédente
git log --oneline

# 2. Revenir au commit précédent
git checkout [commit-hash-precedent]

# 3. Redéployer
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Vérifier
curl -I https://backend.tabbeo.app/health
```

### Rollback de Base de Données

```bash
# Restaurer la sauvegarde
docker-compose -f docker-compose.prod.yml exec backend psql database_name < backup_YYYYMMDD.sql

# Redémarrer les services
docker-compose -f docker-compose.prod.yml restart backend
```

## 📅 Planning de Mise à Jour

### 🕐 Mise à Jour Recommandées

- **Sécurité** : Immédiatement
- **Dépendances critiques** : Dans les 48h
- **Fonctionnalités** : Selon planning projet
- **Infrastructure** : Fenêtre de maintenance planifiée

### 📊 Suivi des Versions

```bash
# Créer un fichier de versioning
echo "$(date): Migration vers version X.Y.Z" >> CHANGELOG.md
git tag v$(date +%Y.%m.%d)
git push origin --tags
```

## ⚡ Mise à Jour d'Urgence

### 🚨 Procédure Express

```bash
# 1. Notification équipe
echo "⚠️ MISE À JOUR D'URGENCE EN COURS" > /tmp/maintenance

# 2. Hotfix rapide
git fetch origin
git checkout hotfix-branch
git pull origin hotfix-branch

# 3. Déploiement immédiat
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Vérification critique
curl -f https://backend.tabbeo.app/health

# 5. Notification fin
rm /tmp/maintenance
```

## 📞 Support et Escalade

### 🔧 Diagnostic Post-Mise à Jour

```bash
# Script de diagnostic complet
#!/bin/bash
echo "=== DIAGNOSTIC POST-MISE À JOUR ==="
echo "Date: $(date)"
echo "Version Git: $(git rev-parse --short HEAD)"
echo "Conteneurs: $(docker ps --format 'table {{.Names}}\t{{.Status}}')"
echo "Santé API: $(curl -s https://backend.tabbeo.app/health)"
echo "Logs récents:"
docker-compose -f docker-compose.prod.yml logs --tail=10
```

### 🆘 Points de Contact

- **Erreurs critiques** : Rollback immédiat
- **Problèmes mineurs** : Logs détaillés + ticket
- **Amélioration continue** : Documentation des lessons learned

---

**🎯 Conseil** : Toujours tester les mises à jour en développement et garder un plan de rollback prêt avant toute mise à jour en production.
