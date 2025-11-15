import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FeatureCard } from '../../components/FeatureCard';
import { spacing, typography } from '../../res';
import { ColorPalette } from '../../res/colors';
import { RootStackParamList } from '../navigation/types';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Section = {
  titleKey: string;
  descriptionKey: string;
  accent: string;
  route: keyof RootStackParamList;
};

const sections: Section[] = [
  {
    titleKey: 'home.feature.profile',
    descriptionKey: 'home.feature.profile.desc',
    accent: '#6366F1',
    route: 'Profile',
  },
  {
    titleKey: 'home.feature.history',
    descriptionKey: 'home.feature.history.desc',
    accent: '#8B5CF6',
    route: 'History',
  },
  {
    titleKey: 'home.feature.settings',
    descriptionKey: 'home.feature.settings.desc',
    accent: '#EC4899',
    route: 'Settings',
  },
  {
    titleKey: 'home.feature.current',
    descriptionKey: 'home.feature.current.desc',
    accent: '#14B8A6',
    route: 'CurrentSurgery',
  },
  {
    titleKey: 'home.feature.exercise',
    descriptionKey: 'home.feature.exercise.desc',
    accent: '#F97316',
    route: 'Exercise',
  },
] as const;

export function HomeScreen({ navigation }: Props) {
  const t = useTranslation();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { logout } = useAuth();
  const gradientStops = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );
  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  return (
    <LinearGradient
      style={styles.gradient}
      colors={gradientStops}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <View style={styles.headerTop}>
            <Text style={styles.kicker}>{t('home.header.kicker')}</Text>
            <Pressable onPress={handleLogout} hitSlop={8}>
              <Text style={styles.logout}>{t('home.logout')}</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>{t('home.header.title')}</Text>
          <Text style={styles.subtitle}>
            {t('home.header.subtitle')}
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {sections.map((section) => (
              <FeatureCard
                key={section.titleKey}
                title={t(section.titleKey as any)}
                description={t(section.descriptionKey as any)}
                accent={section.accent}
                onPress={() => navigation.navigate(section.route)}
              />
            ))}
          </View>
        </ScrollView>
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
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.xl,
    },
    headerBar: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      gap: spacing.sm,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    kicker: {
      color: colors.accent,
      textTransform: 'uppercase',
      letterSpacing: 2,
      fontSize: typography.caption,
      fontWeight: typography.weight.semibold as any,
    },
    logout: {
      color: colors.danger,
      fontSize: typography.body,
      fontWeight: typography.weight.semibold as any,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 34,
      fontWeight: typography.weight.bold as any,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: typography.subtitle,
      lineHeight: 22,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.lg,
    },
  });


