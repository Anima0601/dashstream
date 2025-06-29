import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, header }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {header ? header : <Header onSearch={() => {}} searchQuery="" />}
        <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
