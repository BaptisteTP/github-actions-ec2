// server.js

require('dotenv').config({ path: __dirname + '/.env' });
const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const connectDB    = require('./config/db');
const authRoutes   = require('./routes/authRoutes');
const followRoutes = require('./routes/followRoutes');
const userRoutes   = require('./routes/userRoutes');

const app = express();

// 1) Connexion à Mongo
connectDB();

// 2) CORS (une seule fois)
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// 3) Sécurité + limitation
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  message: { message: 'Trop de requêtes, réessayez plus tard.' }
}));

// 4) Parser le JSON
app.use(express.json());

// 5) Vos routes
app.use('/api/auth',   authRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/users',   userRoutes);

// 6) Gestionnaire d’erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: { message: err.message || 'Erreur interne', code: status }
  });
});

// 7) Démarrage
const PORT = process.env.PORT || 4001;
app.listen(PORT, () =>
    console.log(`User-service démarré sur le port ${PORT}`)
);
