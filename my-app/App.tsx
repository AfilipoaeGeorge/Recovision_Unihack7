import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
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

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationWrapper = () => {
  const { theme } = useSettings();
  const colors = useThemeColors();
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

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="CurrentSurgery" component={CurrentSurgeryScreen} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
        <Stack.Screen name="SurgeryDetails" component={SurgeryDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <NavigationWrapper />
    </SettingsProvider>
  );
}
