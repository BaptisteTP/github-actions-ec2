'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import defaultAvatar from '@/assets/default-image.jpg'

export default function EditProfilePage() {
    const router = useRouter()
    const [username, setUsername]   = useState('')
    const [bio, setBio]             = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState('')
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]))
        } catch {
            return null
        }
    }

    // Récupération initiale du profil
    useEffect(() => {
        async function fetchProfile() {
            setLoading(true)
            try {
                const token = localStorage.getItem('token')
                if (!token) throw new Error('Non connecté')
                const { userId } = parseJwt(token) || {}
                if (!userId) throw new Error('Token invalide')

                const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.message)

                setUsername(data.user.username)
                setBio(data.user.bio || '')
                setAvatarUrl(data.user.avatarUrl || '')
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    // Upload d’image
    const handleImageChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'projet_preset')

        try {
            const res = await fetch(
                'https://api.cloudinary.com/v1_1/daqtp8x9y/image/upload',
                { method: 'POST', body: formData }
            )
            const json = await res.json()
            if (json.secure_url) setAvatarUrl(json.secure_url)
            else throw new Error(json.error?.message || 'Échec upload')
        } catch (e) {
            alert('Erreur upload : ' + e.message)
        } finally {
            setUploading(false)
        }
    }

    // Soumission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const token = localStorage.getItem('token')
            if (!token) throw new Error('Non connecté')
            const { userId } = parseJwt(token) || {}
            if (!userId) throw new Error('Token invalide')

            const payload = { username: username.trim(), bio }
            if (avatarUrl) payload.avatarUrl = avatarUrl

            const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            router.push('/profile/me')
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) return <div className="p-4 text-center">Chargement…</div>
    if (error)   return <div className="p-4 text-center text-red-500">{error}</div>

    return (
        <div className="min-h-screen bg-white p-4 font-sans">
            {/* Header avec Annuler et titre centré */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-black font-medium"
                >
                    Annuler
                </button>
                <h1 className="text-lg font-semibold text-black">Modifier mon profil</h1>
                {/* Espace vide pour centrer le titre */}
                <div style={{ width: '80px' }} />
            </div>

            {/* Avatar */}
            <div className="flex items-center space-x-4 mb-6">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
                >
                    <Image
                        src={avatarUrl || defaultAvatar}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                    />
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                />
                {uploading && <span className="text-black">Upload en cours…</span>}
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-black">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2 text-black placeholder-black"
                        placeholder="Username"
                        required
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-black">Bio</label>
                    <textarea
                        rows={3}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2 text-black placeholder-black resize-none"
                        placeholder="Parlez un peu de vous…"
                    />
                </div>

                {/* Bouton Enregistrer */}
                <button
                    type="submit"
                    disabled={uploading}
                    className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
                >
                    Enregistrer
                </button>
            </form>
        </div>
    )
}
