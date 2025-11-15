import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { spacing, typography, ColorPalette } from '../res';
import { useThemeColors } from '../src/hooks/useThemeColors';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  style?: ViewStyle;
  disabled?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
}: PrimaryButtonProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'ghost' ? styles.ghost : styles.primary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'ghost' ? styles.labelGhost : styles.labelPrimary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    base: {
      width: '100%',
      paddingVertical: spacing.md,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    primary: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.35,
      shadowRadius: 30,
      elevation: 6,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
    },
    pressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
    disabled: {
      backgroundColor: colors.primaryMuted,
    },
    label: {
      fontSize: typography.subtitle,
      fontWeight: typography.weight.semibold as any,
    },
    labelPrimary: {
      color: colors.textPrimary,
    },
    labelGhost: {
      color: colors.textSecondary,
    },
  });

