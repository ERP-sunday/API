# ERP Sunday API

Notre objectif dans le cadre de ce projet est de proposer un ERP fonctionnel qui répondrait à la plupart des attentes des restaurateurs.

## Fonctionnalités prévues

- **Gestion des stocks**
- **Gestion des commandes et des tables**
- **Gestion du personnel et des plannings**
- **Gestion de la carte du restaurant**

L’objectif clé est de permettre au personnel d’un restaurant, via un unique logiciel qui est le notre,d’avoir la main mise de façon simple et efficace sur tous les points clés de leur travail.

## Stack Technique

- **Backend**: <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS" width="24" height="24">
- **Frontend**: <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="24" height="24">
- **Langage**: <img src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg" alt="TypeScript" width="24" height="24">
- **Base de données**: <img src="https://webimages.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png" alt="MongoDB" height="24">

## Communication

Pour notre communication interne, nous utilisons :

- <img src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" alt="Notion" width="24" height="24"> **Notion** : Outil de planification de nos tâches respectives et de leur avancées. L'outil nous sert également à mettre en commun nos idées quant à l'évolution du projet.
- <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" alt="Discord" width="24" height="24"> **Discord** : Outil de communication vocale directe. Nous utilisons Discord pour faire nos réunions sur l'avancée des nos tâches respectives ou lorsque nous souhaitons travailler ensemble.

## CI/CD

La CI/CD est gérée via :

- <img src="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png" alt="Git" width="24" height="24"> **Git**
- <img src="https://avatars.githubusercontent.com/u/44036562?s=200&v=4" alt="GitHub Actions" width="24" height="24"> **GitHub Actions**

---

# Initialisation du Projet

## Prérequis

>[!IMPORTANT]
Pour accéder au Swagger de l'API, il faut se rendre sur le lien: [http://localhost:3000/api#/](http://localhost:3000/api#/)

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/ERP-sunday/API.git
cd API
```

## Ajouter les credentials et le fichier .env

:information_source: *(Tous les fichiers se trouve dans le dossier API reçu en privé)*

Ajouter le fichier **credentials.json** dans le dossier **configs** (/src/configs) <br />
Puis, à la racine du projet, ajouter le fichier **.env**

## Installation

```bash
npm install
```

## Load Fixtures

```bash
npm run load-fixtures
```

## Lancer l'app

```bash
npm run start
```

## Contact

Nous restons disponible via mail :
- *Pierre* : pierre.gourgouillon@ynov.com
- *Clément* : clement.bilger@ynov.com
- *Tom* : tom.schmidt@ynov.com
