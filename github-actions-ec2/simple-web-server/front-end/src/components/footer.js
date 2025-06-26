'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useThemeLang } from '@/context/ThemeLangContext';

export default function Footer() {
  const { themeClasses } = useThemeLang();

  return (
    <footer className={`fixed bottom-0 left-0 right-0 z-50 border-t bg-[var(--bg-color)] text-[var(--text-color)] ${themeClasses}`}>
      <nav className="flex justify-around items-center h-16">
        {/* Home */}
        <Link href="/home" aria-label="Accueil" className="flex flex-col items-center hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12
              M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875
              c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125
              1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>

        {/* Search */}
        <Link href="/search" aria-label="Recherche" className="flex flex-col items-center hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0
              5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </Link>

      </nav>
    </footer>
  );
}
