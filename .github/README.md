# GitHub Actions - Pipeline ESLint

## 📋 Description

Cette pipeline ESLint analyse automatiquement la qualité du code TypeScript à chaque push ou pull request vers les branches `main` et `develop`.

## 🚀 Fonctionnalités

### Déclenchement automatique
- **Push** vers `main` ou `develop`
- **Pull Request** vers `main` ou `develop`
- **Seulement** si des fichiers TypeScript/JavaScript ou des configurations sont modifiés

### Vérifications effectuées
- ✅ Analyse ESLint complète du code TypeScript
- ✅ Vérification des règles de formatage (Prettier)
- ✅ Détection des imports non utilisés
- ✅ Validation de la syntaxe TypeScript

### Rapports générés
- 📊 **Rapport JSON** : format machine-readable pour les intégrations
- 📄 **Rapport HTML** : visualisation conviviale des erreurs
- 💬 **Commentaire PR** : résumé automatique sur les pull requests
- 📦 **Artifacts** : rapports téléchargeables (conservés 30 jours)

## 🔧 Configuration

### Scripts npm utilisés
```json
{
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "lint:check": "eslint \"{src,apps,libs,test}/**/*.ts\""
}
```

### Fichiers surveillés
- `**/*.ts` - Fichiers TypeScript
- `**/*.js` - Fichiers JavaScript  
- `.eslintrc.js` - Configuration ESLint
- `package*.json` - Dépendances
- `tsconfig*.json` - Configuration TypeScript

## 📝 Utilisation locale

### Vérifier les erreurs sans correction
```bash
npm run lint:check
```

### Corriger automatiquement les erreurs
```bash
npm run lint
```

### Générer un rapport JSON
```bash
npm run lint:check -- --format json --output-file eslint-report.json
```

## 🎯 Statut de la pipeline

### ✅ Succès
- Aucune erreur ESLint détectée
- Le code respecte toutes les règles configurées

### ❌ Échec  
- Erreurs ESLint bloquantes détectées
- Le merge sera bloqué jusqu'à correction
- Un commentaire automatique sera ajouté sur la PR

### 📊 Rapport sur PR
En cas d'erreurs, un commentaire sera automatiquement ajouté avec :
- Nombre d'erreurs et d'avertissements
- Instructions pour corriger
- Lien vers le rapport détaillé

## 🛠️ Maintenance

### Modifier les règles ESLint
Editez le fichier `.eslintrc.js`

### Changer les branches surveillées
Modifiez la section `on` dans `.github/workflows/eslint.yml`

### Ajuster les patterns de fichiers
Modifiez la section `paths` dans le workflow

## 🔗 Liens utiles
- [Documentation ESLint](https://eslint.org/docs/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier](https://prettier.io/)
- [GitHub Actions](https://docs.github.com/en/actions)
