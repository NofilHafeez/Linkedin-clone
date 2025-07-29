'use client';

import { redirect, useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
export enum Status {
  online = 'online',
  offline = 'offline',
  away = 'away',
}


type User = {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  status: Status;
  viewedProfile: number;
  title: String;
  bannerPic: string;
  location: string;
} | null;

interface AuthContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  fetchUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/get-user', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.user) {
        console.log('User fetched successfully:', response.data.user);
        setUser(response.data.user);
      } else {
        console.log('User fetched successfully:', response.data.user);
        setUser(null);
        router.push('/login') 
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      router.push('/login')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
    fetchUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen text-gray-200">
          Loading...
        </div>
      ) : (
        children
      )}
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
