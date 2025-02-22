import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, UserRole } from '../types/user';
import { useToast } from '../hooks/useToast';

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
  isLoading: boolean;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const toast = useToast();
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  // Load stored user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Setup token refresh timer when user logs in
  useEffect(() => {
    if (user) {
      // Clear any existing timer
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      // Set up new refresh timer (14 minutes = 840000 milliseconds)
      const timer = setTimeout(refreshAccessToken, 840000);
      setRefreshTimer(timer);
    }

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [user]);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log("Calling to refresh ");
      console.log("Refresh token : "+refreshToken);

      const response = await fetch('https://www.waladom.club/api/auth/refresh', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      console.log("Called refresh");

      if (!response.ok) {
        if (response.status === 401) {
          // Refresh token expired, logout user
          logout();
          return;
        }
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      console.log("Token gotten : "+data.accessToken);
      // Update tokens
      localStorage.setItem('accessToken', data.accessToken);

      // Set up next refresh
      const timer = setTimeout(refreshAccessToken, 840000);
      setRefreshTimer(timer);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const login = async (emailOrPhone: string, password: string) => {
    try {
      const credentials = btoa(`${emailOrPhone.trim()}:${password.trim()}`);
      const isEmail = emailOrPhone.includes('@');
      
      const response = await fetch('https://www.waladom.club/api/auth/login', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${credentials}`,
          'Connection-Method': isEmail ? 'email' : 'phone'
        }
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

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
      
      // Start token refresh timer
      const timer = setTimeout(refreshAccessToken, 840000);
      setRefreshTimer(timer);
      
      toast.success(t('auth.loginSuccess'));
    } catch (error) {
      toast.error(t('auth.loginError'));
      throw error;
    }
  };

  const loginAsAdmin = async (email: string, password: string) => {
    try {
      const credentials = btoa(`${email.trim()}:${password.trim()}`);
      
      const response = await fetch('https://www.waladom.club/api/auth/login', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${credentials}`,
          'Connection-Method': 'email'
        }
      });

      if (!response.ok) {
        throw new Error('Invalid admin credentials');
      }

      const data = await response.json();

      if (!data.valid || data.user.role.id !== 'ROLE_ADMIN') {
        throw new Error('Invalid admin credentials');
      }

      const adminUser: User = {
        email: data.user.email,
        name: `${data.user.firstName} ${data.user.lastName}`,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phone: data.user.phone,
        cardId: data.user.id,
        role: 'A',
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
        isAdmin: true
      };

      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
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
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      setRefreshTimer(null);
    }
    toast.success(t('auth.logoutSuccess'));
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    try {
      const response = await fetch(`https://www.waladom.club/api/user/update/${userId}`, {
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
      const response = await fetch(`https://www.waladom.club/api/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
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
      deleteUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};