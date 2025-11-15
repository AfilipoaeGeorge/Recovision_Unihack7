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

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Section = {
  title: string;
  description: string;
  accent: string;
  route: keyof RootStackParamList;
};

const sections: Section[] = [
  {
    title: 'Profile',
    description: 'Update your personal recovery details.',
    accent: '#6366F1',
    route: 'Profile',
  },
  {
    title: 'History',
    description: 'Review completed practices and surgeries.',
    accent: '#8B5CF6',
    route: 'History',
  },
  {
    title: 'Settings',
    description: 'Fine-tune notifications and accessibility.',
    accent: '#EC4899',
    route: 'Settings',
  },
  {
    title: 'Current Surgery',
    description: 'Track the plan for your current recovery.',
    accent: '#14B8A6',
    route: 'CurrentSurgery',
  },
  {
    title: 'Exercises',
    description: 'Stay on track with guided exercises.',
    accent: '#F97316',
    route: 'Exercise',
  },
] as const;

export function HomeScreen({ navigation }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const gradientStops = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );
  const handleLogout = () =>
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  return (
    <LinearGradient
      style={styles.gradient}
      colors={gradientStops}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <View style={styles.headerTop}>
            <Text style={styles.kicker}>Dashboard</Text>
            <Pressable onPress={handleLogout} hitSlop={8}>
              <Text style={styles.logout}>Logout</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>Your recovery hub</Text>
          <Text style={styles.subtitle}>
            Quick actions designed to keep you focused on getting better.
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {sections.map((section) => (
              <FeatureCard
                key={section.title}
                title={section.title}
                description={section.description}
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


