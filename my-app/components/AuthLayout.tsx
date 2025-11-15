import { ReactNode, useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, ViewStyle, ScrollView } from 'react-native';
import { spacing, typography } from '../res';
import { useThemeColors } from '../src/hooks/useThemeColors';
import { ColorPalette } from '../res/colors';

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  illustration?: ReactNode;
  footer?: ReactNode;
  style?: ViewStyle;
};

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  style,
}: AuthLayoutProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <LinearGradient
      colors={[colors.background, colors.surface, colors.card]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, style]}>
          <Text style={styles.kicker}>Recovision</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.content}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xxl,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 28,
      padding: spacing.xxl,
      gap: spacing.lg,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
      shadowColor: '#000',
      shadowOpacity: 0.45,
      shadowRadius: 45,
      shadowOffset: { width: 0, height: 30 },
      elevation: 10,
    },
    kicker: {
      color: colors.accent,
      fontSize: typography.caption,
      letterSpacing: 2,
      textTransform: 'uppercase',
      fontWeight: typography.weight.semibold as any,
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.hero,
      fontWeight: typography.weight.bold as any,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: typography.subtitle,
      lineHeight: 22,
    },
    content: {
      gap: spacing.lg,
    },
    footer: {
      marginTop: spacing.md,
    },
  });


