import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen, LoginScreen, ProfileScreen, RegisterScreen, StudentListScreen } from '@containers';
import  CreateStudentScreen  from '../../../src/containers/students/screens/CreateStudentScreen'
import { AuthContext } from '../../contexts/AuthContext';
import type { AuthStackParamList, RootStackParamList } from '../../types';
import { MenuHeader } from '../../../src/core/components/MenuHeader' 

import { AppTabs } from './AppTabs'  

const hideHeader = { headerShown: false };

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen name="Login" component={LoginScreen} options={hideHeader} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} options={hideHeader} />
    </AuthStackNav.Navigator>
  );
}
function MainApp() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerRight: () => <MenuHeader />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerRight: () => <MenuHeader />,
        }}
      />
    </Tab.Navigator>
  );
}

export function NavigationApp() {
  const { userToken } = React.useContext(AuthContext);

  return (
    <NavigationContainer>
      {userToken ? (
        <RootStack.Navigator>
          <RootStack.Screen
            name="MainApp"
            component={MainApp}
            
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Asistencias"
            component={AppTabs}
            options={{
              title: 'Asistencias',
              headerBackTitle: 'Volver',
              headerRight: () => <MenuHeader
               />,
            }}
          />
          <RootStack.Screen
            name="ListaDeAlumnos"
            component={StudentListScreen}
            options={{ title: 'Todos los alumnos' }}
          />
          <RootStack.Screen
            name="CreateStudent"
            component={CreateStudentScreen}
          />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Authentication" component={AuthStack} />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
}



