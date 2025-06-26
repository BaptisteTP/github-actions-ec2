'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function PostPage() {
  const { postId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null); // ID commentaire parent si réponse
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Non connecté.');

        const decoded = jwtDecode(token);
        const userId =
            decoded.userId || decoded.id || decoded._id || decoded.sub || (decoded.user && decoded.user._id);
        if (!userId) throw new Error('Token invalide.');

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user
        const uRes = await fetch(`http://localhost:4001/api/users/${userId}`, { headers });
        if (!uRes.ok) throw new Error('Erreur récupération utilisateur');
        const uData = await uRes.json();
        setUser(uData.user);

        // Fetch post
        const pRes = await fetch(`http://localhost:4002/api/posts/posts/${postId}`, { headers });
        if (!pRes.ok) throw new Error('Post introuvable');
        const pData = await pRes.json();
        setPost(pData);

        // Fetch comments
        const cRes = await fetch(`http://localhost:4002/api/posts/${postId}/comments`, { headers });
        if (!cRes.ok) throw new Error('Erreur récupération commentaires');
        const cData = await cRes.json();

        if (Array.isArray(cData)) {
          setComments(cData);
        } else if (cData.comments && Array.isArray(cData.comments)) {
          setComments(cData.comments);
        } else {
          setComments([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [postId]);

  // Construire arbre avec parentComment
  function buildCommentsTree(commentsList) {
    const map = {};
    const roots = [];

    commentsList.forEach((c) => {
      map[c._id || c.id] = { ...c, children: [] };
    });

    commentsList.forEach((c) => {
      // Si parentComment === postId => racine sinon enfant d'un commentaire
      if (c.parentComment && c.parentComment !== postId) {
        if (map[c.parentComment]) {
          map[c.parentComment].children.push(map[c._id || c.id]);
        }
      } else {
        roots.push(map[c._id || c.id]);
      }
    });

    return roots;
  }

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    setPostingComment(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Non connecté.');

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // Si c'est une réponse à un commentaire -> parentComment = id du commentaire
      // Sinon parentComment = id du post
      const bodyData = {
        content: commentContent,
        author: user._id,
        post: postId,
        parentComment: replyToCommentId ? replyToCommentId : postId,
      };

      const res = await fetch(`http://localhost:4002/api/posts/${postId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur lors de l\'ajout du commentaire');
      }

      setCommentContent('');
      setReplyToCommentId(null);

      // Re-fetch comments après ajout
      const cRes = await fetch(`http://localhost:4002/api/posts/${postId}/comments`, { headers });
      if (!cRes.ok) throw new Error('Erreur récupération commentaires');
      const cData = await cRes.json();

      if (Array.isArray(cData)) {
        setComments(cData);
      } else if (cData.comments && Array.isArray(cData.comments)) {
        setComments(cData.comments);
      } else {
        setComments([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPostingComment(false);
    }
  };

  // Composant récursif pour afficher commentaires + réponses
  const CommentItem = ({ comment, level = 0 }) => {
    const author = comment.author;
    const username =
        author && typeof author === 'object' && author.username
            ? author.username
            : comment.authorUsername || 'Utilisateur';
    const avatar =
        author && typeof author === 'object' && author.avatarUrl
            ? author.avatarUrl
            : comment.authorAvatarUrl || '/default-avatar.png';

    return (
        <div
            className="border rounded p-3 "
            style={{ marginLeft: level * 20 }}
            key={comment._id || comment.id}
        >
          <div className="flex items-center gap-2 mb-1">
            <img
                src={avatar || '/default-avatar.png'}
                alt={username}
                className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-sm">{username}</span>
            <span className="text-xs ml-auto">
            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
          </span>
          </div>
          <p className="text-sm  whitespace-pre-wrap">{comment.content}</p>

          {/* Bouton répondre uniquement si c'est un commentaire racine (parentComment === postId) */}
          {comment.parentComment === postId && (
              <button
                  onClick={() => {
                    if (replyToCommentId === comment._id) {
                      setReplyToCommentId(null);
                      setCommentContent('');
                    } else {
                      setReplyToCommentId(comment._id);
                      setCommentContent(`@${username} `);
                    }
                  }}
                  className="text-blue-600 text-sm mt-1 hover:underline"
              >
                {replyToCommentId === comment._id ? 'Annuler' : 'Répondre'}
              </button>
          )}

          {/* Affiche les enfants récursivement */}
          {comment.children && comment.children.length > 0 && (
              <div className="mt-3 space-y-3">
                {comment.children.map((child) => (
                    <CommentItem key={child._id || child.id} comment={child} level={level + 1} />
                ))}
              </div>
          )}
        </div>
    );
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Chargement…</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!post) return <div className="text-center mt-10">Post non trouvé.</div>;

  const commentsTree = buildCommentsTree(comments);

  return (
      <div className="max-w-2xl mx-auto p-4">
        <button
            onClick={() => router.back()}
            className="mb-4 px-3 py-1  rounded "
        >
          ← Retour
        </button>

        {/* Post */}
        <div className=" shadow-md rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img
                src={post.authorAvatarUrl || '/default-avatar.png'}
                alt={post.authorUsername || 'Auteur'}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold text-lg">{post.authorUsername || 'Auteur'}</h2>
              <p className="text-sm">
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
              </p>
            </div>
          </div>
          <p className=" text-base whitespace-pre-wrap">{post.content}</p>
          {post.imageUrl && (
              <div className="flex justify-center items-center radius-5 mt-4">
                <img
                    src={post.imageUrl}
                    alt="Image du post"
                    className="w-full max-w-md h-60 object-contain radius-5"
                />
              </div>
          )}
          {post.videoUrl && (
              <div className="flex justify-center items-center mb-3">
                <video
                    src={post.videoUrl}
                    className="w-[320px] h-[240px] object-contain rounded"
                    autoPlay
                    loop
                    muted
                    controls
                />
              </div>
          )}
        </div>

        {/* Ajouter un commentaire ou réponse */}
        <div className="mb-6">
        <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            placeholder={replyToCommentId ? 'Répondre au commentaire...' : 'Ajouter un commentaire...'}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={postingComment}
        />
          <button
              onClick={handleAddComment}
              disabled={postingComment}
              className="px-4 py-2   rounded  disabled:opacity-50"
          >
            {postingComment ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>

        {/* Liste commentaires */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Commentaires</h3>
          {commentsTree.length === 0 ? (
              <p className="">Aucun commentaire pour l’instant.</p>
          ) : (
              commentsTree.map((comment) => <CommentItem key={comment._id || comment.id} comment={comment} />)
          )}
        </div>
      </div>
  );
}
