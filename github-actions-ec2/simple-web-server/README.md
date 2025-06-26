Projet de développement WEB : 
Promotion : FISA A3 Info
Groupe : 1

Figma :  https://www.figma.com/design/XSSerPqNnU9MTk86BMFm9b/Untitled?node-id=0-1&m=dev&t=K0SymTVqkBqRdEZ8-1

===
# Application Microservices – React & Express

Ceci est une application web basée sur une architecture **microservices**, avec un frontend développé en **React** et deux services backend en **Express.js**.

## Pour commencer

### 1. Configuration des variables d’environnement

Avant de lancer les services, crée les fichiers `.env` suivants :

#### `back-end/content-service/.env`

```env
PORT=4002
MONGO_URI=mongodb://content-db:27017/contentdb
USER_SERVICE_URL=http://user-service:4001
JWT_SECRET=unSecretTresComplexeEtLong
```

#### `back-end/user-service/.env`

```env
PORT=4001
MONGO_URI=mongodb://user-db:27017/userdb
JWT_SECRET=unSecretTresComplexeEtLong
TOKEN_EXPIRATION=24h
```

### 2. Démarrer le backend (Docker)

Depuis la racine du projet, exécute la commande suivante (avec docker de lancer sur le pc):

```bash
docker-compose up --build -d
```

Cela va construire et lancer les services suivants :

* `user-service` (port 4001)
* `content-service` (port 4002)
* Instances MongoDB pour chaque service

### 3. Démarrer le frontend (React)

Dans un autre terminal :

```bash
cd front-end
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur pour accéder à l’application.

## Structure du projet

```
project-root/
├── front-end/                # Application React
└── back-end/
    ├── content-service/      # Microservice de gestion de contenu
    ├── nginx/                # Microservice Nginx
    └── user-service/         # Microservice de gestion des utilisateurs
```

