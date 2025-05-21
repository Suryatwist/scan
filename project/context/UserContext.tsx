import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '@/types/user';

interface UserContextType {
  user: User | null;
  updateUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: async () => {},
  logout: async () => {},
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

// Platform-specific storage implementation
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user data from storage on app start
    const loadUser = async () => {
      try {
        const userData = await storage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // If no user exists, create a default user for demo purposes
          const defaultUser: User = {
            name: 'Demo User',
            age: 30,
            gender: 'Male',
            weight: 70,
            height: 175,
            bmi: '22.9',
            fitnessGoal: 'Weight Maintenance',
            medicalConditions: ['Diabetes'],
            allergies: ['Peanuts'],
            dietaryPreferences: ['Balanced Diet'],
            dailyTarget: {
              calories: 2000,
              carbs: 250,
              protein: 150,
              fat: 65,
              fiber: 25,
            },
          };
          
          await storage.setItem('user', JSON.stringify(defaultUser));
          setUser(defaultUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
  }, []);

  const updateUser = async (updatedUser: User) => {
    try {
      await storage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};