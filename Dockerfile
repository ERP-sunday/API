# Étape 1 : Construction avec une image complète
FROM node:18 AS builder

# Crée et positionne le répertoire de travail
WORKDIR /backend

# Copie les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installe les dépendances de production
RUN npm install

# Copie le reste des fichiers du projet
COPY . .

# Compile le projet TypeScript en JavaScript
RUN npm run build

# Étape 2 : Utiliser une image légère pour exécuter l'application
FROM node:18-alpine

# Crée et positionne le répertoire de travail
WORKDIR /backend

# Copier uniquement les fichiers nécessaires à l'exécution depuis l'étape de build
COPY --from=builder /backend/dist ./dist
COPY --from=builder /backend/node_modules ./node_modules
COPY --from=builder /backend/package.json ./package.json

# Expose le port sur lequel l'application écoute
EXPOSE 4000

# Définit la commande par défaut pour lancer l'application
CMD ["node", "dist/main"]