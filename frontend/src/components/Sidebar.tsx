import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-lg transition-colors duration-300">
      <nav className="space-y-2">
        <Link
          href="/"
          className="block p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <span className="font-medium">Home Feed</span>
        </Link>
        <Link
          href="/favorites"
          className="block p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <span className="font-medium">Favorites</span>
        </Link>
        <Link
          href="/settings"
          className="block p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <span className="font-medium">Preferences</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
