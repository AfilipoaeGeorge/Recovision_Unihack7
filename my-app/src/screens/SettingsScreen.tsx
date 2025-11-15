import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, typography } from '../../res';
import { ColorPalette } from '../../res/colors';
import { ScreenHeader } from '../../components/ScreenHeader';
import { RootStackParamList } from '../navigation/types';
import { useSettings } from '../context/SettingsContext';
import { useThemeColors } from '../hooks/useThemeColors';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { cameraEnabled, theme, language, toggleCamera, toggleTheme, toggleLanguage } =
    useSettings();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const previewGradient = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );

  return (
    <LinearGradient style={styles.gradient} colors={previewGradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ScreenHeader
            title="Settings"
            subtitle="Quick preferences for camera, theme, and language."
            onBack={() => navigation.goBack()}
          />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Camera access</Text>
            <View style={styles.row}>
              <Text style={styles.body}>
                Allow the app to open the camera within the profile and surgery modules.
              </Text>
              <Switch
                value={cameraEnabled}
                onValueChange={toggleCamera}
                trackColor={{ true: colors.primary, false: colors.primaryMuted }}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Appearance</Text>
            <Pressable style={styles.rowBetween} onPress={toggleTheme}>
              <View>
                <Text style={styles.body}>Dark mode</Text>
                <Text style={styles.caption}>
                  Currently {theme === 'dark' ? 'enabled' : 'disabled'}
                </Text>
              </View>
              <Text style={styles.value}>{theme === 'dark' ? 'On' : 'Off'}</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Language</Text>
            <Pressable style={styles.rowBetween} onPress={toggleLanguage}>
              <View>
                <Text style={styles.body}>Primary language</Text>
                <Text style={styles.caption}>
                  Switch between English and Romanian instantly.
                </Text>
              </View>
              <Text style={styles.value}>{language === 'en' ? 'English' : 'Română'}</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.xl,
      gap: spacing.lg,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.lg,
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.md,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    body: {
      color: colors.textPrimary,
      fontSize: typography.body,
    },
    caption: {
      color: colors.textSecondary,
      fontSize: typography.caption,
    },
    value: {
      color: colors.accent,
      fontSize: typography.subtitle,
      fontWeight: typography.weight.medium as any,
    },
  });


