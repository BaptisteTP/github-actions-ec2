'use client';

import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import defaultAvatar from '@/assets/default-image.jpg';
import Image from 'next/image';
import { useThemeLang } from '@/context/ThemeLangContext.js';
import LanguageDropdown from './LanguageDropdown.js';
import ThemeDropdown from './ThemeDropdown.js';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const { themeClasses } = useThemeLang();

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');

      if (!token) return;

      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId;
        if (!userId) throw new Error();
      } catch {
        console.error('Token JWT invalide.');
        return;
      }

      try {
        const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Erreur utilisateur');
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Erreur récupération user :', err.message);
      }
    }

    fetchUser();
  }, []);

  const handleRedirect = (path) => {
    window.location.href = path;
  };

  return (
    <aside
      className={`flex flex-col justify-between w-64 h-screen p-6 border-r bg-[var(--bg-color)] text-[var(--text-color)] ${themeClasses}`}
      style={{ zIndex: 1000, position: 'fixed', left: 0, top: 0 }}
    >
      <div>
        <div className="flex flex-col mb-10">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black">
            <Image
              src={user?.avatarUrl || defaultAvatar}
              alt="Avatar"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="mt-2 font-semibold">{user?.username || 'User'}</span>
        </div>

        <nav className="space-y-6 pl-2">
          <div onClick={() => handleRedirect('/profile/me')}>
            <NavItem icon={<UserIcon />} label="Profile" />
          </div>
          <div onClick={() => handleRedirect('/home')}>
            <NavItem icon={<HomeIcon />} label="Home" />
          </div>
          <div onClick={() => handleRedirect('/search')}>
            <NavItem icon={<SearchIcon />} label="Search" />
          </div>
        </nav>

        <div className="mt-6 space-y-4 pl-2">
          <ThemeDropdown />
        </div>
      </div>

      <div className="text-sm cursor-pointer hover:underline pl-2">
        Help Center
      </div>
    </aside>
  );
}

function NavItem({ icon, label }) {
  return (
    <div className="flex items-center space-x-3 cursor-pointer hover:text-blue-600 text-[var(--text-color)]">
      {icon}
      <span>{label}</span>
    </div>
  );
}

// === ICONS ===
// Suppression des classes fixes de couleur et usage de currentColor

function LikeIcon(props) {
  return (
    <svg
      {...props}
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5C14.377 3.75 12.715 4.876 12 6.483 11.285 4.876 9.623 3.75 7.688 3.75 5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z"
      />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197M16.803 15.803A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 11.607 10.607Z"
      />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg
      {...props}
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75V20a1.125 1.125 0 0 0 1.125 1.125H9.75v-4.875A1.125 1.125 0 0 1 10.875 15h2.25A1.125 1.125 0 0 1 14.25 16.125V21h4.125A1.125 1.125 0 0 0 19.5 19.875V9.75"
      />
    </svg>
  );
}

function NotifyIcon(props) {
  return (
    <svg
      {...props}
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="grey"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 1 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022 23.85 23.85 0 0 0 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  );
}
