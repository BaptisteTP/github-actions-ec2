'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Post from '@/components/post'
import Navbar from '@/components/navbar'
import defaultAvatar from '@/assets/default-image.jpg'
import {jwtDecode} from 'jwt-decode'
import { useThemeLang } from '@/context/ThemeLangContext'
import { motion, AnimatePresence } from 'framer-motion'
import Link from "next/link";
import {HomeIcon} from "@heroicons/react/24/outline";

export default function MyProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [likedIds, setLikedIds] = useState([])
  const [selectedTab, setSelectedTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { themeClasses } = useThemeLang()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Non connecté.')
        const decoded = jwtDecode(token)
        const userId = decoded.userId || decoded.id || decoded._id || decoded.sub || (decoded.user && decoded.user._id)
        if (!userId) throw new Error('Token invalide.')

        const [uRes, pRes, lRes] = await Promise.all([
          fetch(`http://localhost:4001/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4002/api/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4002/api/posts/liked`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (!uRes.ok || !pRes.ok || !lRes.ok) throw new Error('Erreur de récupération des données.')

        const [uData, pData, lData] = await Promise.all([
          uRes.json(),
          pRes.json(),
          lRes.json(),
        ])

        setUser({ ...uData.user, stats: uData.stats })
        setPosts(Array.isArray(pData) ? pData : [])
        setLikedPosts(Array.isArray(lData) ? lData : [])
        setLikedIds(Array.isArray(lData) ? lData.map((p) => p._id) : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleShowFollowing = () => router.push('/profile/me/following')
  const handleShowFollowers = () => router.push('/profile/me/followers')

  const handleToggleLike = async (postId, isCurrentlyLiked) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Utilisateur non connecté')

      // 2.a) Appel POST ou DELETE
      const res = await fetch(
          `http://localhost:4002/api/posts/${postId}/like`,
          {
            method: isCurrentlyLiked ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // 2.b) Met à jour la liste des IDs likés
      setLikedIds(ids =>
          isCurrentlyLiked
              ? ids.filter(id => id !== postId)
              : [...ids, postId]
      )

      // 2.c) Met à jour le compteur dans posts
      setPosts(list =>
          list.map(p =>
              p._id === postId
                  ? { ...p, likesCount: p.likesCount + (isCurrentlyLiked ? -1 : 1) }
                  : p
          )
      )

      // 2.d) Met à jour likedPosts : on supprime ou on ajoute le post avec le nouveau compteur
      setLikedPosts(list => {
        if (isCurrentlyLiked) {
          // Si on enlève le like → on filtre
          return list.filter(p => p._id !== postId)
        } else {
          // Si on ajoute le like → on reconstruit un nouvel objet avec le compteur incrémenté
          const orig = posts.find(p => p._id === postId)
          if (!orig) return list
          const updated = { ...orig, likesCount: orig.likesCount + 1 }
          return [updated, ...list]
        }
      })
    } catch (err) {
      alert(err.message)
    }
  }
  if (loading) return <div className="p-4 text-center">Chargement…</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>

  const tabs = {
    posts,
    liked: likedPosts, 
  }

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${themeClasses}`}>
        <aside className="hidden lg:block w-64 border-r border-gray-300 dark:border-gray-700">
          <Navbar />
        </aside>

        <main className="flex-1 p-4 overflow-auto flex flex-col">
          <header className="flex justify-between items-center mb-4">
            {/* ← Bouton Home */}
            <Link href="/home" className="p-2 text-gray-800 hover:text-gray-900">
              <HomeIcon className="w-6 h-6" />
            </Link>

            {/* Titre de la page */}
            <h1 className="text-xl font-semibold text-black dark:text-white">
              Mon profil
            </h1>

            {/* Bouton Modifier */}
            <button
                onClick={() => router.push('/profile/me/edit')}
                className="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Modifier
            </button>
          </header>

          {/* Profil utilisateur */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border">
            <img
              src={user.avatarUrl || defaultAvatar.src}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.username}</h2>
            {user.bio && <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>}
          </div>
        </div>

        {user.stats && (
          <div className="flex space-x-6 text-sm mb-6">
            <span onClick={handleShowFollowing} className="cursor-pointer hover:underline">
              <strong>{user.stats.followingCount}</strong> Abonnements
            </span>
            <span onClick={handleShowFollowers} className="cursor-pointer hover:underline">
              <strong>{user.stats.followersCount}</strong> Abonnés
            </span>
          </div>
        )}

        {/* Onglets */}
        <div className="border-b mb-4 flex space-x-6">
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`pb-2 ${
                selectedTab === tab
                  ? 'border-b-2 border-black text-black dark:border-white dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Liste des posts avec transition */}
        <div className="relative flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {tabs[selectedTab].length === 0 ? (
                <p className="text-center">
                  {selectedTab === 'posts'
                    ? 'Aucun post publié.'
                    : 'Aucun post liké.'}
                </p>
              ) : (
                tabs[selectedTab].map((post) => {
                  const isLiked = likedIds.includes(post._id)
                  return (
                    <Post
                      key={post._id}
                      _id ={post._id}
                      authorId={post.authorId}
                      username={post.authorUsername}
                      image={post.authorAvatarUrl || defaultAvatar.src}
                      postImage={post.imageUrl}
                      postVideo={post.videoUrl}
                      content={post.content}
                      like={post.likesCount}
                      comment={post.commentsCount ?? 0}
                      share={0}
                      liked={isLiked}
                      onToggleLike={() => handleToggleLike(post._id, isLiked)}
                    />
                  )
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
