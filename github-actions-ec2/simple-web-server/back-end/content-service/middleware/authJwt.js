const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  try {
    const raw = req.headers.authorization?.split(' ')[1];
    const payload = verifyToken(raw);

    // Récupère l'ID selon ce qui est dans le token (id ou userId)
    const userId = payload.userId || payload.id || payload._id;
    if (!userId) {
      throw new Error('Payload JWT sans identifiant utilisateur');
    }

    req.user = { userId, token: raw };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
