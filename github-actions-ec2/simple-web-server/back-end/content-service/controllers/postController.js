const axios = require('axios');
const Post  = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment'); // Assure-toi que c'est bien importé

// URL de base du user‐service (nom du service Docker ou URL en prod)
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:4001';

/**
 * Crée un post en embeddant l'auteur (username + avatar) dans le document.
 */
const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || content.length > 280) {
      return res
        .status(400)
        .json({ message: 'Le contenu doit faire entre 1 et 280 caractères.' });
    }
    const imageUrl = typeof req.body.imageUrl === 'string' ? req.body.imageUrl : null;

    const videoUrl = typeof req.body.videoUrl === 'string' ? req.body.videoUrl : null;

    const token = req.headers.authorization;
    const { data } = await axios.get(
      `${USER_SERVICE_URL}/api/users/${req.user.userId}`,
      { headers: { Authorization: token } }
    );
    const { username, avatarUrl } = data.user;

    const newPost = await Post.create({
      authorId:        req.user.userId,
      authorUsername:  username,
      authorAvatarUrl: avatarUrl,
      ...(imageUrl && { imageUrl }) ,
      ...(videoUrl && { videoUrl }),
      content,
    });

    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

/**
 * Récupère tous les posts d'un utilisateur, avec le nombre de commentaires.
 */
const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .lean();

    const postsWithCommentCounts = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return { ...post, commentsCount };
      })
    );

    res.json(postsWithCommentCounts);
  } catch (err) {
    next(err);
  }
};

/**
 * Récupère le fil d’actualité : posts des utilisateurs suivis + les siens, avec nombre de commentaires.
 */
const getFeed = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const currentUserId = req.user.userId;

    // 1) Obtenir les IDs des utilisateurs suivis
    const { data: followingUsers } = await axios.get(
      `${USER_SERVICE_URL}/api/follows/${currentUserId}/following`,
      { headers: { Authorization: token } }
    );
    const followingIds = followingUsers.map(u => u._id);
    followingIds.push(currentUserId); // Inclure ses propres posts

    // 2) Récupérer les posts
    const feed = await Post.find({ authorId: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .lean();

    // 3) Ajouter le nombre de commentaires à chaque post
    const feedWithCommentCounts = await Promise.all(
      feed.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return { ...post, commentsCount };
      })
    );

    res.json(feedWithCommentCounts);
  } catch (err) {
    next(err);
  }
};

/**
 * Récupère tous les posts likés par l'utilisateur connecté, avec nombre de commentaires.
 */
const getLikedPosts = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // 1) Trouver les likes de l'utilisateur
    const likes = await Like.find({ user: userId }).select('post');
    const postIds = likes.map(l => l.post);
    // 2) Charger les posts correspondants
    const likedPosts = await Post.find({ _id: { $in: postIds } })
      .sort({ createdAt: -1 })
      .lean();

    const likedPostsWithCommentCounts = await Promise.all(
      likedPosts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return { ...post, commentsCount };
      })
    );

    res.json(likedPostsWithCommentCounts);
  } catch (err) {
    next(err);
  }
};

/**
 * Récupère les posts likés par un user donné, avec nombre de commentaires.
 */
const getUserLikedPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // 1) trouver tous les likes de cet utilisateur
    const likes = await Like.find({ user: userId }).select('post');
    const postIds = likes.map(l => l.post);
    // 2) récupérer les posts correspondants
    const likedPosts = await Post.find({ _id: { $in: postIds } })
      .sort({ createdAt: -1 })
      .lean();

    const likedPostsWithCommentCounts = await Promise.all(
      likedPosts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return { ...post, commentsCount };
      })
    );

    res.json(likedPostsWithCommentCounts);
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé.' });
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPost,
  getUserPosts,
  getFeed,
  getLikedPosts,
  getUserLikedPosts,
  getPostById,
};
