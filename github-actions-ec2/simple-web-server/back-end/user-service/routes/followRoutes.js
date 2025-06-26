const express      = require('express');
const { param }    = require('express-validator');
const router       = express.Router({ mergeParams: true });
const authenticate = require('../middleware/authJwt');
const {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
} = require('../controllers/followController');
const validate     = require('../middleware/validate');

// Suivre un utilisateur
router.post(
  '/:userId/follow',
  authenticate,
  [
    param('userId')
      .isMongoId()
      .withMessage('userId invalide.')
  ],
  validate,
  followUser
);

// Se désabonner
router.delete(
  '/:userId/follow',
  authenticate,
  [
    param('userId')
      .isMongoId()
      .withMessage('userId invalide.')
  ],
  validate,
  unfollowUser
);

// Lister les personnes suivies (/following)
router.get(
  '/:userId/following',
  authenticate,
  [
    param('userId')
      .isMongoId()
      .withMessage('userId invalide.')
  ],
  validate,
  getFollowing
);

// Lister les abonnés (/followers)
router.get(
  '/:userId/followers',
  authenticate,
  [
    param('userId')
      .isMongoId()
      .withMessage('userId invalide.')
  ],
  validate,
  getFollowers
);

module.exports = router;
