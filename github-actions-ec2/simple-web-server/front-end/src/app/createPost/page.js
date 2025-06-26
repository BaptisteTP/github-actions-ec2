'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function CreatePostPage() {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Utilisateur non connecté.');
        setLoadingUser(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data.user);
      } catch {
        setError("Erreur lors du chargement de l'utilisateur.");
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

  const handleUploadVideo = async (e) => {
    const videoFile = e.target.files?.[0];
    if (!videoFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', videoFile); // CORRIGÉ : utiliser "file", pas "videoFile"
    formData.append('upload_preset', 'projet_preset');
    // `resource_type` est défini automatiquement si tu utilises le bon endpoint

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/daqtp8x9y/video/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setVideoUrl(data.secure_url); // CORRIGÉ : on stocke l’URL dans le state
      } else {
        alert("Échec de l'upload vidéo.");
      }
    } catch (err) {
      alert("Erreur d'upload vidéo.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'projet_preset');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/daqtp8x9y/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        alert("Échec de l'upload image.");
      }
    } catch (err) {
      alert("Erreur d'upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handlePost = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Utilisateur non connecté.");
      return;
    }

    try {
      const res = await fetch('http://localhost:4002/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, imageUrl, videoUrl }), // ✅ Ajout du videoUrl
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de la création du post.');
        return;
      }

      // Réinitialisation
      setContent('');
      setImageUrl('');
      setVideoUrl('');
      setError('');
      router.push('/home');
    } catch {
      setError('Erreur réseau.');
    }
  };

  if (loadingUser) return <p className="text-center mt-10">Chargement utilisateur...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!user) return <p className="text-center mt-10">Utilisateur introuvable.</p>;

  return (
      <div className="p-4 max-w-xl mx-auto font-sans">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => router.back()} className="text-blue-500 text-sm">Cancel</button>
          <button
              onClick={handlePost}
              disabled={content.trim().length === 0 || uploading}
              className={`px-4 py-1 rounded-full text-white font-semibold text-sm transition 
          ${content.trim().length > 0 && !uploading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-200 cursor-not-allowed'}`}
          >
            {uploading ? 'Envoi...' : 'Post'}
          </button>
        </div>

        <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value.slice(0, 280));
              setError('');
            }}
            placeholder={`Que veux-tu dire, ${user.username} ?`}
            className="w-full h-40 p-3 text-base border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image (facultative)</label>
          <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading}
          />
          {imageUrl && (
              <img src={imageUrl} alt="Aperçu" className="mt-2 rounded max-h-64 object-cover" />
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Vidéo (facultative)</label>
          <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleUploadVideo}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading}
          />
          {videoUrl && (
              <video controls className="mt-2 rounded max-h-64 w-full">
                <source src={videoUrl} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
          )}
        </div>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
  );
}
