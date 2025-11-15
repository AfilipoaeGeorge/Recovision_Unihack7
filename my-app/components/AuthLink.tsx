import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { spacing, typography, ColorPalette } from '../res';
import { useThemeColors } from '../src/hooks/useThemeColors';

type AuthLinkProps = {
  label: string;
  actionLabel: string;
  onPress: () => void;
};

export function AuthLink({ label, actionLabel, onPress }: AuthLinkProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.action}>{actionLabel}</Text>
    </Pressable>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    label: {
      color: colors.textSecondary,
      fontSize: typography.body,
    },
    action: {
      color: colors.accent,
      fontSize: typography.body,
      fontWeight: typography.weight.semibold as any,
    },
  });

