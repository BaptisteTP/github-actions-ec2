const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 280,
    },
      authorUsername:  { type: String, required: true },
      authorAvatarUrl: { type: String, default: '' },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      // Si null → commentaire de premier niveau sur le post
      // Sinon → réponse à un autre commentaire
    },
  },
  {
    timestamps: true,
  }
);

// Index pour charger rapidement les commentaires par post et par date
CommentSchema.index({ post: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', CommentSchema);
