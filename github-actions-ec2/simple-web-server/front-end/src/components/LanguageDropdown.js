'use client';

import React, { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useThemeLang } from '@/context/ThemeLangContext';

export default function LanguageDropdown() {
  const { language = 'fr', setLanguage } = useThemeLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const displayLanguage =
    typeof language === 'string' && language.length > 0
      ? language.toUpperCase()
      : 'FR';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Langue : {displayLanguage}
          <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-300" />
        </Menu.Button>
      </div>
      <Menu.Items className="absolute left-0 mt-2 w-40 origin-top-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg focus:outline-none z-50">
        <div className="px-1 py-1">
          {['fr', 'en'].map((lang) => (
            <Menu.Item key={lang}>
              {({ active }) => (
                <button
                  onClick={() => setLanguage(lang)}
                  className={`${
                    active
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  } w-full text-left px-4 py-2 text-sm transition-colors`}
                >
                  {lang === 'fr' ? 'Français' : 'English'}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
