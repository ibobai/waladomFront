import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, UserRole } from '../types/user';
import { useToast } from '../hooks/useToast';
import { refreshTokens } from '../utils/api';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (emailOrPhone: string, password: string) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  currentCountry: string;
  currentCity: string;
  currentVillage: string;
  job: string;
  dateOfBirth: string;
  placeOfBirth: string;
  tribe: string;
  motherFirstName: string;
  motherLastName: string;
  nationalities: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);

// Sample users data
const sampleUsers: User[] = [
  {
    email: "admin@admin.admin",
    password: "admin111995",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    phone: "+1234567890",
    cardId: "WLD-ADMIN",
    role: "A" as UserRole,
    country: "Sudan",
    currentCountry: "Sudan",
    currentCity: "Khartoum",
    currentVillage: "Central",
    job: "Administrator",
    dateOfBirth: "1990-01-01",
    placeOfBirth: "Khartoum",
    gender: "Other",
    tribe: "Admin",
    motherFirstName: "Admin",
    motherLastName: "Mother",
    nationalities: ["Sudanese"],
    joinedDate: "2024-01-01",
    isAdmin: true
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const { t } = useTranslation();
  const toast = useToast();

  const initAuth = async () => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (storedUser && (accessToken || refreshToken)) {
      try {
        if (!accessToken && refreshToken) {
          // Try to refresh the token
          const response = await fetch('https://www.waladom.club/api/auth/refresh', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
          } else {
            // If refresh fails, clear everything
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            return;
          }
        }

        // Set the user from stored data
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
  };

  // Set up token refresh interval
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (user) {
      // Refresh token every 14 minutes (840000 ms)
      refreshInterval = setInterval(async () => {
        try {
          const { accessToken, refreshToken } = await refreshTokens();
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        } catch (error) {
          console.error('Token refresh failed:', error);
          // If refresh fails, log out the user
          logout();
        }
      }, 840000);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user]);

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const credentials = btoa(`${emailOrPhone.trim()}:${password.trim()}`);
      
      const response = await fetch('https://www.waladom.club/api/auth/login', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${credentials}`,
          'Connection-Method': emailOrPhone.includes('@') ? 'email' : 'phone'
        }
      });

      const data = await response.json();

      if (!data.valid) {
        throw new Error('Invalid credentials');
      }

      // Create user object from API response
      const loggedInUser: User = {
        email: data.user.email,
        name: `${data.user.firstName} ${data.user.lastName}`,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phone: data.user.phone,
        cardId: data.user.id,
        role: mapApiRoleToInternal(data.user.role.id),
        country: data.user.birthCountry,
        currentCountry: data.user.currentCountry,
        currentCity: data.user.currentCity,
        currentVillage: data.user.currentVillage,
        job: data.user.occupation,
        dateOfBirth: data.user.birthDate,
        placeOfBirth: data.user.birthCity,
        gender: data.user.sex,
        tribe: data.user.tribe,
        motherFirstName: data.user.mothersFirstName,
        motherLastName: data.user.mothersLastName,
        nationalities: data.user.nationalities,
        joinedDate: data.user.createdAt,
        photoUrl: data.user.waladomCardPhoto?.photoUrl
      };

      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      toast.success(t('auth.loginSuccess'));
    } catch (error) {
      toast.error(t('auth.loginError'));
      throw error;
    }
  };

  const loginAsAdmin = async (email: string, password: string) => {
    try {
      const adminUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password && 
        u.role === 'A'
      );
      
      if (!adminUser) {
        throw new Error('Invalid admin credentials');
      }

      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      toast.success(t('auth.loginSuccess'));
    } catch (error) {
      toast.error(t('auth.loginError'));
      throw error;
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch('https://www.waladom.club/api/user/register/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...registerData,
          isActive: false,
          status: "inactive",
          role: "ROLE_USER"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      toast.success(t('auth.registerSuccess'));
    } catch (error) {
      toast.error(t('auth.registerError'));
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success(t('auth.logoutSuccess'));
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    try {
      const response = await fetch(`https://www.waladom.club/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update local state
      const updatedUsers = users.map(u => 
        u.cardId === userId ? { ...u, ...data } : u
      );
      setUsers(updatedUsers);
      
      // Update current user if it's the same user
      if (user?.cardId === userId) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success(t('profile.updateSuccess'));
    } catch (error) {
      toast.error(t('profile.updateError'));
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`https://www.waladom.club/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const updatedUsers = users.filter(u => u.cardId !== userId);
      setUsers(updatedUsers);
      toast.success(t('admin.userDeleted'));
    } catch (error) {
      toast.error(t('admin.deleteError'));
      throw error;
    }
  };

  // Helper function to map API roles to internal roles
  const mapApiRoleToInternal = (apiRole: string): UserRole => {
    const roleMap: Record<string, UserRole> = {
      'ROLE_ADMIN': 'A',
      'ROLE_CONTENT_MANAGER': 'X',
      'ROLE_MODERATOR': 'Y',
      'ROLE_REVIEWER': 'Z',
      'ROLE_USER': 'F'
    };
    return roleMap[apiRole] || 'F';
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      users,
      login,
      loginAsAdmin,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'A',
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};