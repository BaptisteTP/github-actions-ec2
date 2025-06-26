const express      = require('express');
const { body }    = require('express-validator');
const router       = express.Router();
const authenticate = require('../middleware/authJwt');
const { createPost, getUserPosts, getFeed, getLikedPosts, getUserLikedPosts, getPostById } = require('../controllers/postController');
const validate   = require('../middleware/validate');
const { param } = require('express-validator');


router.get('/liked', authenticate, getLikedPosts);

// Créer un post
router.post(
  '/',
  authenticate,
  [
    body('content')
      .isLength({ min: 1, max: 280 })
      .withMessage('Le contenu doit faire entre 1 et 280 caractères.')
  ],
  validate,
  createPost
);
router.get('/posts/:postId', getPostById);

// Récupérer le fil d’actualité 
router.get('/feed', authenticate, getFeed);

// Récupérer tous les posts d’un profil 
router.get('/user/:userId', authenticate, getUserPosts);
// Récupérer les posts likés
// Récupérer les posts lukés d’un user précis
router.get(
    '/user/:userId/liked',
    authenticate,
    [
        param('userId').isMongoId().withMessage('userId invalide.')
    ],
    validate,
    getUserLikedPosts
);

module.exports = router;