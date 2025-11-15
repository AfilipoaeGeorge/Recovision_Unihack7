import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, typography } from '../res';
import { useThemeColors } from '../src/hooks/useThemeColors';
import { useTranslation } from '../src/hooks/useTranslation';
import { ColorPalette } from '../res/colors';

type FeatureCardProps = {
  title: string;
  description: string;
  accent: string;
  onPress: () => void;
};

export function FeatureCard({
  title,
  description,
  accent,
  onPress,
}: FeatureCardProps) {
  const t = useTranslation();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <LinearGradient
        colors={[accent, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <Text style={styles.cta}>{t('home.feature.open')}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    wrapper: {
      flexGrow: 1,
      flexBasis: '48%',
    },
    gradient: {
      borderRadius: 24,
      padding: spacing.lg,
      minHeight: 150,
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    content: {
      gap: spacing.xs,
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
    },
    description: {
      color: colors.textSecondary,
      fontSize: typography.body,
    },
    cta: {
      color: colors.accent,
      fontSize: typography.subtitle,
      fontWeight: typography.weight.semibold as any,
    },
  });


