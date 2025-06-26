'use client';

import React, { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useThemeLang } from '@/context/ThemeLangContext';

export default function ThemeDropdown() {
  const { theme, setTheme } = useThemeLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const displayTheme = theme ? theme.charAt(0).toUpperCase() + theme.slice(1) : 'Système';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Thème : {displayTheme}
          <ChevronDownIcon className="w-5 h-5 ml-2 text-gray-500 dark:text-gray-300" />
        </Menu.Button>
      </div>
      <Menu.Items className="absolute left-0 mt-2 w-40 origin-top-left dark:bg-gray-800 border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg focus:outline-none z-50">
        <div className="px-1 py-1">
          {['light', 'dark', 'dark-orange', 'dark-blue', 'light-orange'].map((option) => (
            <Menu.Item key={option}>
              {({ active }) => (
                <button
                  onClick={() => setTheme(option)}
                  className={`${
                    active
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  } w-full text-left px-4 py-2 text-sm transition-colors`}
                >
                  {option === 'light' ? 'Clair'
                    : option === 'dark' ? 'Sombre'
                    : option === 'dark-orange' ? 'Orange sombre'
                    : option === 'dark-blue' ? 'Bleu sombre'
                    : option === 'light-orange' ? 'Orange clair'
                    : 'Système'}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
