import { NavigationApp } from './src/core/navigation';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { ClasesPriceProvider } from './src/contexts/ClasesPriceContext';
import { PaperProvider } from 'react-native-paper';

export default function App() {

  const [loaded, error] = useFonts({
    'PlaypenSans-Bold': require('./assets/fonts/PlaypenSans-Bold.ttf'),
    'PlaypenSans-Light': require('./assets/fonts/PlaypenSans-Light.ttf'),
    'PlaypenSans-Regular': require('./assets/fonts/PlaypenSans-Regular.ttf'),
    'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <PaperProvider>
      <AuthProvider>
      <ClasesPriceProvider>
        {/* 🎨 Barra superior */}
        <StatusBar style="light" backgroundColor="rgb(130, 94, 193)" />

        {/* Contenedor principal con fondo de barra inferior */}
        <View style={styles.container}>
          <NavigationApp />
        </View>
        </ClasesPriceProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)', // color de la “barra inferior”
  },
});
