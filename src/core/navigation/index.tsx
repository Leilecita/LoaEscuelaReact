import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen, LoginScreen, ProfileScreen, RegisterScreen, StudentListScreen } from '@containers';
import  CreateStudentScreen  from '../../../src/containers/students/screens/CreateStudentScreen'
import  InformationStudentScreen  from '../../../src/containers/students/screens/InformationStudentScreen'
import { AuthContext } from '../../contexts/AuthContext';
import type { AuthStackParamList, RootStackParamList } from '../../types';
import { MenuHeader } from '../../../src/core/components/MenuHeader' 

import { AppTabs } from './AppTabs'  
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { PaymentStudentListScreen } from 'containers/students/screens/PaymentStudentListScreen';

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

/*
<ImageBackground
        source={require('../../../assets/fondo.png')}  // ruta a la imagen
        style={styles.background}
      >
*/

export function NavigationApp() {
  const { userToken } = React.useContext(AuthContext);

  return (
    <NavigationContainer>
      <View style={styles.background}>
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
              name="PaymentStudentList"
              component={PaymentStudentListScreen}
              options={{ title: 'Alumnos' }}
            />
          <RootStack.Screen
            name="CreateStudent"
            component={CreateStudentScreen}
          />
          <RootStack.Screen
              name="PagosYClases"
              component={InformationStudentScreen}
              options={{
                title: 'Pagos y Clases',
                headerBackTitle: 'Volver',
                headerRight: () => <MenuHeader />,
              }}
            />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Authentication" component={AuthStack} />
        </RootStack.Navigator>
      )}
      </View>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.backgroundApp, 
  },
});