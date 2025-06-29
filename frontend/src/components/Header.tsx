'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleDarkMode } from '../redux/slices/userPreferencesSlice';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery }) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.userPreferences.darkMode);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localSearchQuery.trim());
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [localSearchQuery, onSearch]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(localSearchQuery.trim());
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col sm:flex-row justify-between items-center transition-colors duration-300">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
          My Dashboard
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="w-full sm:w-auto flex-grow flex justify-center sm:ml-4 sm:mr-4">
        <input
          type="text"
          placeholder="Search news..."
          value={localSearchQuery}
          onChange={handleSearchInputChange}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-full sm:max-w-md"
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors duration-200"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </form>

      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors duration-300"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.292 8.614a1 1 0 00-1.04-.153 6.993 6.993 0 01-2.926 0 1 1 0 00-1.039.153 6.002 6.002 0 00-7.397 7.397 1 1 0 00-.153 1.039 6.993 6.993 0 010 2.926 1 1 0 00.153 1.04 6.002 6.002 0 007.397-7.397 1 1 0 001.039-.153 6.993 6.993 0 012.926 0 1 1 0 001.04-.153 6.002 6.002 0 007.397 7.397 1 1 0 00.153-1.039 6.993 6.993 0 010-2.926z"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 10a4 4 0 11-8 0 4 4 0 018 0zm-.459 4.363A9.998 9.998 0 0110 18a9.998 9.998 0 01-3.541-1.637 1 1 0 01-.117-1.403 1 1 0 011.403-.117zM16.172 7.76a1 1 0 01.087 1.393l-1.393 1.488a1 1 0 01-1.393-.087 1 1 0 01-.087-1.393l1.393-1.488a1 1 0 011.393.087zM5.828 7.76a1 1 0 00-.087 1.393l1.393 1.488a1 1 0 001.393-.087 1 1 0 00.087-1.393L7.22 7.673a1 1 0 00-1.393-.087zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm13 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"></path>
            </svg>
          )}
        </button>
        <Link href="/settings" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap">
          Settings
        </Link>
      </div>
    </header>
  );
};

export default Header;
