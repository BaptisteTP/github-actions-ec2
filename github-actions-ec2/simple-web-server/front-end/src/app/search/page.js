'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { jwtDecode } from 'jwt-decode'
import defaultAvatar from '@/assets/default-image.jpg'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'
import { useThemeLang } from '@/context/ThemeLangContext'

export default function SearchPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [followingIds, setFollowingIds] = useState([])
  const { themeClasses } = useThemeLang()

  useEffect(() => {
    const fetchUsersAndFollowing = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError("Vous devez être connecté pour accéder à cette page.")
        setLoading(false)
        return
      }

      try {
        const decoded = jwtDecode(token)
        const userId =
          decoded._id ||
          decoded.id ||
          decoded.sub ||
          decoded.userId ||
          (decoded.user && decoded.user._id)

        if (!userId) {
          throw new Error("Token invalide : identifiant utilisateur manquant")
        }

        setCurrentUserId(userId)

        const resUsers = await fetch('http://localhost:4001/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!resUsers.ok) throw new Error("Erreur lors du chargement des utilisateurs.")
        const usersData = await resUsers.json()
        setUsers(usersData.users)
        setFilteredUsers(usersData.users)

        const resFollowing = await fetch(`http://localhost:4001/api/follows/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (resFollowing.ok) {
          const following = await resFollowing.json()
          const followingIds = following.map(user => user._id)
          setFollowingIds(followingIds)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsersAndFollowing()
  }, [])

  useEffect(() => {
    const search = searchTerm.toLowerCase()
    const filtered = users.filter(
      user =>
        user.username.toLowerCase().includes(search) ||
        (user.bio && user.bio.toLowerCase().includes(search))
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleFollowToggle = async (userId) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const isFollowing = followingIds.includes(userId)

    try {
      const method = isFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`http://localhost:4001/api/follows/${userId}/follow`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        const text = await res.text()
        let errorMsg = ''
        try {
          const data = JSON.parse(text)
          errorMsg = data.message || JSON.stringify(data)
        } catch {
          errorMsg = text
        }
        throw new Error(errorMsg || 'Erreur lors du suivi.')
      }

      setFollowingIds(prev =>
        isFollowing ? prev.filter(id => id !== userId) : [...prev, userId]
      )
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <p className="text-center mt-6 text-[color:var(--text-color)]">Chargement...</p>
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>

  return (
    <div className={`flex flex-col min-h-screen bg-[var(--bg-color)] text-[color:var(--text-color)] ${themeClasses}`}>
      <div className="block lg:hidden">
        <Header onProfileClick={() => setIsNavbarOpen(!isNavbarOpen)} />
      </div>

      <div className="flex flex-1">
        {isNavbarOpen && (
          <div className="fixed z-40 inset-y-0 left-0 w-64 bg-[var(--bg-color)] shadow-lg border-r border-gray-200 lg:hidden">
            <Navbar />
          </div>
        )}

        <div className="hidden lg:block">
          <Navbar />
        </div>

        <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-6 bg-white text-black"
          />

          <div className="grid gap-4">
            {filteredUsers.length === 0 && (
              <p>Aucun utilisateur trouvé.</p>
            )}

            {filteredUsers.map(user => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border rounded shadow-sm hover:bg-[rgba(0,0,0,0.05)] transition"
              >
                <Link
                  href={`/profile/${user._id}`}
                  className="flex items-center group"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 mr-4">
                    <Image
                      src={user.avatarUrl || defaultAvatar}
                      alt={`Avatar de ${user.username}`}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:underline text-[color:var(--text-color)]">
                      {user.username}
                    </p>
                    <p className="text-sm opacity-70">
                      {user.bio?.trim() ? user.bio : 'Pas de bio'}
                    </p>
                  </div>
                </Link>

                {user._id !== currentUserId && (
                  <button
                    onClick={() => handleFollowToggle(user._id)}
                    className="px-4 py-2 rounded text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: followingIds.includes(user._id)
                        ? 'red'
                        : 'var(--primary-color)',
                      color: 'var(--secondary-color)'
                    }}
                  >
                    {followingIds.includes(user._id) ? 'Se désabonner' : 'Suivre'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <div className="block lg:hidden">
        <Footer />
      </div>
    </div>
  )
}
