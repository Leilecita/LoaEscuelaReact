import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  userToken: string | null;
  userRole: string | null;   // 👈 agregamos rol
  userCategory: string | null; 
  userName: string | null; 
  userId: number | null;
  signIn: (token: string, level: string, userName: string, category: string, userId: number) => void; 
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  userRole: null,
  userCategory: null,
  userName: null,
  userId: null, 
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCategory, setUserCategory] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      const category = await AsyncStorage.getItem('userCategory');
      const userName = await AsyncStorage.getItem('userName');
      const userIdStr = await AsyncStorage.getItem('userId');
      setUserToken(token);
      setUserRole(role);
      setUserName(userName);
      setUserCategory(category);
      setUserId(userIdStr ? Number(userIdStr) : null);
    };
    loadAuth();
  }, []);

  const signIn = async (token: string, role: string, userName: string, category: string, userId: number) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userRole', role);
    await AsyncStorage.setItem('userCategory', category);
    await AsyncStorage.setItem('userName', userName);
    await AsyncStorage.setItem('userId', userId.toString());
    setUserToken(token);
    setUserRole(role);
    setUserName(userName);
    setUserCategory(category);
    setUserId(userId);
    
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userCategory');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userId');
    setUserToken(null);
    setUserRole(null);
    setUserName(null);
    setUserCategory(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userRole, userCategory, userName, userId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
