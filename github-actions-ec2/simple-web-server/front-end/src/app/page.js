'use client'

import Image from 'next/image'
import logo from '@/assets/breezy.png'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full flex flex-col items-center space-y-10">
        <Image src={logo} alt="Logo Breezy" width={140} height={140} />

        <div className="w-full flex items-center flex-col space-y-4">
          <button
            onClick={() => router.push('/signup')}
            className="bg-black text-white py-3 rounded-full w-[320px] h-[40px] hover:bg-gray-800 transition"
          >
            Sign-up
          </button>
          <button
            onClick={() => router.push('/login')}
            className="bg-black text-white py-3 rounded-full hover:bg-gray-800 transition w-[320px] h-[40px] -center"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
