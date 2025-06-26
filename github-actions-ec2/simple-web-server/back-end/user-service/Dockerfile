# user-service/Dockerfile

# 1) Image Node légère
FROM node:18-alpine

# 2) Création du dossier de travail
WORKDIR /usr/src/app

# 3) Copier package.json et package-lock.json puis installer
COPY package*.json ./
RUN npm install --production

# 4) Copier le reste du code
COPY . .

# 5) Exposer le port (celui défini dans .env ou 4001 par défaut)
EXPOSE 4001

# 6) Lancer l'application
CMD ["npm", "start"]
