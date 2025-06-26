const express      = require('express');
const { body }    = require('express-validator');
const router       = express.Router();
const { register, login } = require('../controllers/authController');
const validate   = require('../middleware/validate');

// Création de compte
router.post(
  '/register',
 [
   body('username')
     .isLength({ min: 3, max: 30 })
     .withMessage('Le username doit faire entre 3 et 30 caractères.'),
   body('email').isEmail().withMessage('Email invalide.'),
   body('password')
     .isLength({ min: 8 })
     .withMessage('Le mot de passe doit faire au moins 8 caractères.'),
   body('bio').optional().isLength({ max: 160 }),
   body('avatarUrl').optional().isURL().withMessage('URL d’avatar invalide.')
 ],
  validate,
  register
);

// Connexion
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide.'),
    body('password').notEmpty().withMessage('Le mot de passe est requis.')
  ],
  validate,
  login
);

module.exports = router;