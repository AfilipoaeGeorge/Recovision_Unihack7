import { forwardRef, useMemo, useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { spacing, typography, ColorPalette } from '../res';
import { useThemeColors } from '../src/hooks/useThemeColors';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helperText?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(
  ({ label, error, helperText, onFocus, onBlur, ...rest }, ref) => {
    const colors = useThemeColors();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            !!error && styles.inputWrapperError,
          ]}
        >
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
        </View>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}
      </View>
    );
  },
);

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      gap: spacing.xs,
    },
    label: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: typography.weight.medium as any,
    },
    inputWrapper: {
      backgroundColor: colors.inputBackground,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    inputWrapperFocused: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 5,
    },
    inputWrapperError: {
      borderColor: colors.danger,
    },
    input: {
      color: colors.textPrimary,
      fontSize: typography.body,
    },
    helperText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
    },
    errorText: {
      color: colors.danger,
      fontSize: typography.caption,
      fontWeight: typography.weight.medium as any,
    },
  });

