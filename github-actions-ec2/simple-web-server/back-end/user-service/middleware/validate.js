const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // On renvoie un tableau d’erreurs avec champ, msg et valeur reçue
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
