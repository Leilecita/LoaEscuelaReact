import { NavigationApp } from './src/core/navigation';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Platform, SafeAreaView, View, Text, TextInput } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { ClasesPriceProvider } from './src/contexts/ClasesPriceContext';
import { PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Tema global Paper para inputs
const PaperTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    background: Platform.OS === 'android' ? '#fff' : PaperDefaultTheme.colors.background,
  },
};

// Desactivar escalado global
/*(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;
(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;*/

// Componente separado para poder usar useSafeAreaInsets()
function AppContent() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      //NavigationBar.setPositionAsync('relative');
      //NavigationBar.setBackgroundColorAsync('rgb(240,240,240)');
    }
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        Platform.OS === 'android' && { paddingBottom: insets.bottom },
      ]}
    >
      <NavigationApp />
    </SafeAreaView>
  );
}

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
     // SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={PaperTheme}>
        <AuthProvider>
          <ClasesPriceProvider>
            {/* Barra superior 
            <StatusBar style="light" backgroundColor="rgb(130, 94, 193)" />*/}
            <StatusBar style="light"  />
            {Platform.OS === 'ios' ? (
              <View style={styles.container}>
                <NavigationApp />
              </View>
            ) : (
              <AppContent />
            )}
          </ClasesPriceProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)',
  },
});
