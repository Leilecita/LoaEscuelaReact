import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  userToken: string | null;
  userRole: string | null;   // 👈 agregamos rol
  signIn: (token: string, level: string) => void; 
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  userRole: null,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const role = await AsyncStorage.getItem('userRole');
      setUserToken(token);
      setUserRole(role);
    };
    loadAuth();
  }, []);

  const signIn = async (token: string, role: string) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userRole', role);
    setUserToken(token);
    setUserRole(role);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    setUserToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userRole, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
