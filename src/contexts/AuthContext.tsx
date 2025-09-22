import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  userToken: string | null;
  userRole: string | null;   // 👈 agregamos rol
  userCategory: string | null; 
  userName: string | null; 
  signIn: (token: string, level: string, userName: string, category: string) => void; 
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  userRole: null,
  userCategory: null,
  userName: null,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCategory, setUserCategory] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      const category = await AsyncStorage.getItem('userCategory');
      const userName = await AsyncStorage.getItem('userName');
      setUserToken(token);
      setUserRole(role);
      setUserName(userName);
      setUserCategory(category);
    };
    loadAuth();
  }, []);

  const signIn = async (token: string, role: string, userName: string, category: string) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userRole', role);
    await AsyncStorage.setItem('userCategory', category);
    await AsyncStorage.setItem('userName', userName);
    setUserToken(token);
    setUserRole(role);
    setUserName(userName);
    setUserCategory(category);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('usercategory');
    await AsyncStorage.removeItem('userName');
    setUserToken(null);
    setUserRole(null);
    setUserName(null);
    setUserCategory(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userRole, userCategory, userName, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
