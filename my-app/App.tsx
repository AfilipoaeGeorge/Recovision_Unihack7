import { NavigationContainer, DefaultTheme, InitialState, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { CurrentSurgeryScreen } from './src/screens/CurrentSurgeryScreen';
import { ExerciseScreen } from './src/screens/ExerciseScreen';
import { SurgeryDetailsScreen } from './src/screens/SurgeryDetailsScreen';
import { RootStackParamList } from './src/navigation/types';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { useThemeColors } from './src/hooks/useThemeColors';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationWrapper = () => {
  const { theme } = useSettings();
  const colors = useThemeColors();
  const { loggedIn, loading } = useAuth();
  const [initialState, setInitialState] = useState<InitialState | undefined>();
  const [navReady, setNavReady] = useState(false);
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      primary: colors.primary,
      text: colors.textPrimary,
      card: colors.card,
      border: 'transparent',
    },
  };
  const navigatorKey = useMemo(() => (loggedIn ? 'auth' : 'guest'), [loggedIn]);
  const persistenceKey = useMemo(
    () => (loggedIn ? 'recovision.nav.auth' : 'recovision.nav.guest'),
    [loggedIn],
  );

  useEffect(() => {
    if (loading) {
      return;
    }
    let mounted = true;
    const restoreState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(persistenceKey);
        if (storedState && mounted) {
          setInitialState(JSON.parse(storedState));
        } else if (mounted) {
          setInitialState(undefined);
        }
      } catch {
        if (mounted) {
          setInitialState(undefined);
        }
      } finally {
        if (mounted) {
          setNavReady(true);
        }
      }
    };
    setNavReady(false);
    setInitialState(undefined);
    restoreState();
    return () => {
      mounted = false;
    };
  }, [loading, persistenceKey]);

  const handleStateChange = useCallback(
    (state?: NavigationState) => {
      if (state) {
        AsyncStorage.setItem(persistenceKey, JSON.stringify(state)).catch(() => {});
      }
    },
    [persistenceKey],
  );

  if (loading || !navReady) {
    return null;
  }

  return (
    <NavigationContainer
      theme={navigationTheme}
      initialState={initialState}
      onStateChange={handleStateChange}
    >
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator
        key={navigatorKey}
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        {loggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="CurrentSurgery" component={CurrentSurgeryScreen} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} />
            <Stack.Screen name="SurgeryDetails" component={SurgeryDetailsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <NavigationWrapper />
      </SettingsProvider>
    </AuthProvider>
  );
}
