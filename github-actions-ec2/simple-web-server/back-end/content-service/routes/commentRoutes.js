const express      = require('express');
const { body, param } = require('express-validator');
const router       = express.Router({ mergeParams: true });
const authenticate = require('../middleware/authJwt');
const { addComment, getComments } = require('../controllers/commentController');
const validate   = require('../middleware/validate');

// Ajouter un commentaire ou réponse
router.post(
  '/',
  authenticate,
  [
    param('postId').isMongoId().withMessage('postId invalide.'),
    body('content')
      .isLength({ min: 1, max: 280 })
      .withMessage('Le commentaire doit faire entre 1 et 280 caractères.'),
    body('parentComment')
      .optional()
      .isMongoId()
      .withMessage('parentComment doit être un ObjectId valide.')
  ],
  validate,
  addComment
);

// Lister les commentaires
router.get(
  '/',
  authenticate,
  [ param('postId').isMongoId().withMessage('postId invalide.') ],
  validate,
  getComments
);

module.exports = router;
