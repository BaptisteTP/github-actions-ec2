'use client'

import { useState } from 'react'
import Image from 'next/image'
import logo from '@/assets/breezy.png'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { username, email, password, confirmPassword } = formData

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }

    const payload = {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    }

    console.log('Payload envoyé:', payload)

    try {
      const res = await fetch('http://localhost:4001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log('Réponse serveur:', data)

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de l’inscription')
      }

      localStorage.setItem('token', data.token)
      router.push('/signup/profile')
    } catch (error) {
      console.error('Erreur:', error)
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full flex flex-col items-center space-y-10">
        <Image src={logo} alt="Logo Breezy" width={140} height={140} />
        <form onSubmit={handleRegister} className="w-full flex items-center flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-900">Username :</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="Username"
            />
            <label className="text-sm font-medium text-gray-900">Email :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="adresse@gmail.com"
            />
            <label className="text-sm font-medium text-gray-900">Password :</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="Password@1234"
            />
            <label className="text-sm font-medium text-gray-900">Confirm Password :</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="Password@1234"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition duration-300 cursor-pointer w-[320px] h-[40px]"
          >
            Sign-up
          </button>
        </form>
      </div>
    </div>
  )
}
