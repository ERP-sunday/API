# Utilise l'image Node.js officielle comme image de base
FROM node:18-alpine

# Crée et positionne le répertoire de travail de l'application
WORKDIR /app

# Copie les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installe les dépendances de l'application
RUN npm install

# Copie le reste des fichiers du projet
COPY . .

# Compile le projet Typescript en JavaScript
RUN npm run build

# Expose le port sur lequel l'application écoute
EXPOSE 4000

# Définit la commande par défaut pour lancer l'application
CMD ["node", "dist/main"]