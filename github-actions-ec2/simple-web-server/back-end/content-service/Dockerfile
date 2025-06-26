# content-service/Dockerfile

# 1. Image de base légère
FROM node:18-alpine

# 2. Définir le répertoire de travail
WORKDIR /usr/src/app

# 3. Copier les fichiers de dépendances et installer
COPY package*.json ./
RUN npm install --production

# 4. Copier tout le code de l’application
COPY . .

# 5. Exposer le port (doit correspondre à PORT dans .env, ici 4002)
EXPOSE 4002

# 6. Commande de démarrage
CMD ["npm", "start"]
