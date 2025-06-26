/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'static.vecteezy.com',
      'localhost',         // <— pour vos avatars « http://localhost:4001/... »
      '127.0.0.1',
    ],
  },
}

export default nextConfig
