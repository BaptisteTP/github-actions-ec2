const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { username, email, password, bio, avatarUrl } = req.body;
    // 1. Vérifier unicité
    if (await User.exists({ $or: [{ email }, { username }] })) {
      return res.status(409).json({ message: 'Email ou username déjà utilisé' });
    }
    // 2. Hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    // 3. Créer l’utilisateur
    const user = await User.create({ username, email, password: hash, bio, avatarUrl });
    // 4. Générer un token
    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1. Trouver l’utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    // 2. Comparer le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    // 3. Générer un token
    const token = generateToken(user._id);
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
