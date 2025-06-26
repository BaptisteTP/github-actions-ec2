# Application Microservices – React & Express

Ceci est une application web basée sur une architecture **microservices**, avec un frontend développé en **React** et deux services backend en **Express.js**.

## Pour commencer

### 1. Configuration des variables d’environnement

Avant de lancer les services, crée les fichiers `.env` suivants :

#### `back-end/content-service/.env`

```env
PORT=4002
MONGO_URI=mongodb://content-db:27017/contentdb
USER_SERVICE_URL=http://user-service:4001/
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

Depuis la racine du projet, exécute la commande suivante :

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

Ouvre [http://localhost:5173](http://localhost:5173) dans ton navigateur pour accéder à l’application.

## Structure du projet

```
project-root/
├── front-end/                # Application React
└── back-end/
    ├── content-service/      # Microservice de gestion de contenu
    └── user-service/         # Microservice de gestion des utilisateurs
```

## En savoir plus

* [Documentation React](https://fr.react.dev/) – Apprends à créer des interfaces utilisateur avec React.
* [Documentation Express](https://expressjs.com/fr/) – Découvre le framework web pour Node.js.
* [Documentation Docker](https://docs.docker.com/) – Pour créer et gérer des conteneurs.
* [Documentation MongoDB](https://www.mongodb.com/fr-fr/docs/) – Base de données NoSQL utilisée par le projet.

