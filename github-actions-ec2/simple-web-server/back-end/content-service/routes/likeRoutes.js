const express      = require('express');
const router       = express.Router({ mergeParams: true });
const authenticate = require('../middleware/authJwt');
const { likePost, unlikePost } = require('../controllers/likeController');

// POST /api/posts/:postId/like  → like
router.post('/:postId/like', authenticate, likePost);

// DELETE /api/posts/:postId/like → unlike
router.delete('/:postId/like', authenticate, unlikePost);

module.exports = router;
