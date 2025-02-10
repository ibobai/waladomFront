import React from 'react';
import { Header, Footer } from '../components';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 bg-gray-50 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;