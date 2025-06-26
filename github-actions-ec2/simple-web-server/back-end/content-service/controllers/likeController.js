const Like = require('../models/Like');
const Post = require('../models/Post');

const likePost = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    // 1) Créer un like (l'index unique dans Like empêche les doublons)
    const like = await Like.create({ user: userId, post: postId });

    // 2) Incrémenter le compteur dans Post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

    res.status(201).json({ message: 'Post liké', likeId: like._id });
  } catch (err) {
    // Gestion d'erreur si déjà liké
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Vous avez déjà liké ce post' });
    }
    next(err);
  }
};

const unlikePost = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    // 1) Supprimer le document Like
    const result = await Like.findOneAndDelete({ user: userId, post: postId });
    if (!result) {
      return res.status(404).json({ message: 'Like non trouvé' });
    }

    // 2) Décrémenter le compteur dans Post
    await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

    res.json({ message: 'Like supprimé' });
  } catch (err) {
    next(err);
  }
};

module.exports = { likePost, unlikePost };
