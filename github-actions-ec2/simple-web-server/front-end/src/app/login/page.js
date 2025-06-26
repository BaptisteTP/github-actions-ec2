'use client'

import { useState } from 'react'
import Image from 'next/image'
import logo from '@/assets/breezy.png'
import { useRouter } from 'next/navigation'

export default function Signin() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:4001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Erreur lors de la connexion')
        return
      }

      localStorage.setItem('token', data.token)
      router.push('/home')
    } catch (error) {
      console.error(error)
      alert('Une erreur est survenue')
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full flex flex-col items-center space-y-10">
        <Image src={logo} alt="Logo Breezy" width={140} height={140} />

        <div className="w-full flex items-center flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-900">Email :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="adresse@gmail.com"
            />

            <label htmlFor="password" className="text-sm font-medium text-gray-900">Password :</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="Password@1234"
            />
          </div>

          <button
            onClick={handleLogin}
            className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition duration-300 cursor-pointer w-[320px] h-[40px]"
          >
            Sign-in
          </button>
        </div>
      </div>
    </div>
  )
}
