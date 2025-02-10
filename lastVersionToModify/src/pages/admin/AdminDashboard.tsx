import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import AdminNav from '../../components/Admin/AdminNav';
import UsersList from '../../components/Admin/UsersList';
import RegistrationRequests from '../../components/Admin/RegistrationRequests';
import Claims from '../../components/Admin/Claims';
import Events from '../../components/Admin/Events';
import UserVerificationPage from '../UserVerificationPage';
import { useAuth } from '../../contexts/AuthContext';

type TabType = 'users' | 'requests' | 'claims' | 'events' | 'verification';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <AdminNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'users' && (user?.role === 'A' || user?.role === 'X') && <UsersList />}
          {activeTab === 'requests' && <RegistrationRequests />}
          {activeTab === 'claims' && <Claims />}
          {activeTab === 'events' && <Events />}
          {activeTab === 'verification' && <UserVerificationPage />}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;