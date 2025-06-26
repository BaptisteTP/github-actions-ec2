const Follow = require('../models/Follow');
const User   = require('../models/User');

const followUser = async (req, res, next) => {
  try {
    const followerId  = req.user._id;
    const followingId = req.params.userId;

    if (followerId.equals(followingId)) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous suivre vous-même.' });
    }
    // Vérifier que l'utilisateur existe
    const user = await User.findById(followingId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Créer la relation
    const follow = await Follow.create({ follower: followerId, following: followingId });
    res.status(201).json({ message: 'Abonné avec succès.', followId: follow._id });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Vous suivez déjà cet utilisateur.' });
    }
    next(err);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const followerId  = req.user._id;
    const followingId = req.params.userId;

    const result = await Follow.findOneAndDelete({ follower: followerId, following: followingId });
    if (!result) {
      return res.status(404).json({ message: 'Relation de suivi non trouvée.' });
    }
    res.json({ message: 'Vous ne suivez plus cet utilisateur.' });
  } catch (err) {
    next(err);
  }
};

// Récupérer la liste des abonnements d’un utilisateur (ids ou documents utilisateurs)
const getFollowing = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const follows = await Follow.find({ follower: userId }).populate('following', 'username avatarUrl');
    // Renvoie un tableau d'objets { _id, username, avatarUrl }
    const following = follows.map(f => f.following);
    res.json(following);
  } catch (err) {
    next(err);
  }
};

// Récupérer la liste des abonnés d’un utilisateur
const getFollowers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const follows = await Follow.find({ following: userId }).populate('follower', 'username avatarUrl');
    const followers = follows.map(f => f.follower);
    res.json(followers);
  } catch (err) {
    next(err);
  }
};

module.exports = { followUser, unfollowUser, getFollowing, getFollowers };
