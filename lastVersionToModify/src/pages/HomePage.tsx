import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from '../components';
import { GuestHome, UserHome } from '../components/Home';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      {isAuthenticated ? <UserHome /> : <GuestHome />}
    </MainLayout>
  );
};

export default HomePage;