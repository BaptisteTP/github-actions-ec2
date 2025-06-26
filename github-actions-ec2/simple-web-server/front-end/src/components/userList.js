'use client';

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import { useThemeLang } from '@/context/ThemeLangContext';
import defaultAvatar from '@/assets/default-image.jpg';

export default function UserList() {
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState('');
  const { themeClasses } = useThemeLang();

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté.');
          return;
        }

        try {
          jwtDecode(token);
        } catch {
          localStorage.removeItem('token');
          setError('Token invalide, reconnectez-vous.');
          return;
        }

        const { userId } = jwtDecode(token);
        if (!userId) {
          setError('ID utilisateur introuvable dans le token.');
          return;
        }

        const res = await fetch(`http://localhost:4001/api/follows/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        const data = await res.json();
        setFollowing(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchFollowing();
  }, []);

  return (
    <aside className={`hidden lg:block w-64 p-4 border-l ${themeClasses}`}>
      <h2 className={`text-lg font-semibold mb-4`}>Abonnements</h2>
      {error && <p className={`text-sm mb-2`}>{error}</p>}
      {!error && following.length === 0 && (
        <p className={`text-sm`}>Aucun abonnement</p>
      )}
      <ul className="space-y-3">
        {following.map((user) => {
          // 1. Détermine l’URL finale de l’avatar
          const avatarSrc = user.avatarUrl
              ? (user.avatarUrl.startsWith('http')
                  ? user.avatarUrl
                  : `${apiUrl}${user.avatarUrl}`)
              : defaultAvatar.src

          return (
              <li key={user._id} className="flex items-center space-x-3">
                <Link
                    href={`/profile/${user._id}`}
                    className="flex items-center space-x-3 hover:underline"
                >
                  {/* <<< remplace cette balise : */}
                  <img
                      src={avatarSrc}
                      alt={`Avatar de ${user.username}`}
                      className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{user.username}</span>
                </Link>
              </li>
          )
        })}
      </ul>
    </aside>
  );
}
