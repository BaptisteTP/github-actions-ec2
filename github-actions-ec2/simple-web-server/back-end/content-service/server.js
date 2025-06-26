// 1. Charger les variables d'environnement
require('dotenv').config({ path: __dirname + '/.env' });

const express       = require('express');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');

const connectDB     = require('./config/db');
const postRoutes    = require('./routes/postRoutes');
const likeRoutes    = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
// server.js (user-service)

// 1) Import du package CORS
const cors = require('cors');

// 2) Configuration CORS
const corsOptions = {
  origin: 'http://localhost:3000',               // ton front en dev
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,                             // si tu veux gérer les cookies/sessions
  optionsSuccessStatus: 204
};

// 3) Middleware pour toutes les requêtes
app.use(cors(corsOptions));

// 4) Répondre aux pré-vols OPTIONS (required pour POST/PUT avec headers custom)
app.options('*', cors(corsOptions));

app.use(express.json());

// 2. Connexion à MongoDB
connectDB();

// 3. Middlewares de sécurité
app.use(helmet());                              // Sécuriser les headers HTTP
app.use(rateLimit({                             // Limiter le nombre de requêtes
  windowMs: 15 * 60 * 1000,
  max: 600,
  message: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes'
}));

// 4. Middlewares globaux
app.use(cors());                                // Autoriser CORS
app.use(express.json());                        // Parser le JSON

// 5. Routes de l’API
app.use('/api/posts', postRoutes);
app.use('/api/posts', likeRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);

// 7. Gestionnaire d’erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Erreur interne',
      code: status
    }
  });
});

// 8. Démarrage du serveur
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
