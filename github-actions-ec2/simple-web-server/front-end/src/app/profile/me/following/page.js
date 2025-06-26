'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';
import defaultAvatar from '@/assets/default-image.jpg';

export default function FollowingPage() {
    const router = useRouter();
    const pathname = usePathname();
    const activeTab = pathname.endsWith('/following') ? 'following' : 'followers';

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchFollowing() {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Vous devez être connecté.');
                let decoded;
                try {
                    decoded = jwtDecode(token);
                } catch {
                    throw new Error('Token invalide, reconnectez-vous.');
                }
                const userId =
                    decoded._id ||
                    decoded.id ||
                    decoded.sub ||
                    decoded.userId ||
                    (decoded.user && decoded.user._id);
                if (!userId) throw new Error('ID utilisateur introuvable dans le token.');

                const res = await fetch(
                    `http://localhost:4001/api/follows/${userId}/following`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchFollowing();
    }, []);

    return (
        <div className="min-h-screen p-4 bg-white">
            {/* En-tête avec switch d’onglets */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => router.push('/profile/me')}
                    className="mr-4 text-gray-800 hover:text-gray-900"
                >
                    ← Retour
                </button>
                <div className="flex space-x-6 border-b">
                    <button
                        onClick={() => router.push('/profile/me/following')}
                        className={`pb-2 ${
                            activeTab === 'following'
                                ? 'border-b-2 border-black text-black'
                                : ''
                        }`}
                    >
                        Abonnements
                    </button>
                    <button
                        onClick={() => router.push('/profile/me/followers')}
                        className={`pb-2 ${
                            activeTab === 'followers'
                                ? 'border-b-2 border-black text-black'
                                : ''
                        }`}
                    >
                        Abonnés
                    </button>
                </div>
            </div>

            {/* Contenu */}
            {loading ? (
                <p>Chargement…</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : users.length === 0 ? (
                <p>Aucun abonnement pour le moment.</p>
            ) : (
                <ul className="space-y-4">
                    {users.map((user) => (
                        <li key={user._id} className="flex items-center space-x-3">
                            <Image
                                src={user.avatarUrl || defaultAvatar}
                                alt={`Avatar de ${user.username}`}
                                width={56}
                                height={56}
                                className="rounded-full object-cover"
                            />
                            <span className="font-medium">{user.username}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
