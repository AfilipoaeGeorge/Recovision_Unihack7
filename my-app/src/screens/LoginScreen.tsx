import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthLayout } from '../../components/AuthLayout';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { AuthLink } from '../../components/AuthLink';
import { ColorPalette } from '../../res/colors';
import { useThemeColors } from '../hooks/useThemeColors';
import { RootStackParamList } from '../navigation/types';
import { useTranslation } from '../hooks/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({ navigation }: Props) {
  const t = useTranslation();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!emailRegex.test(email)) {
      nextErrors.email = t('auth.login.emailError');
    }
    if (password.length < 6) {
      nextErrors.password = t('auth.login.passwordError');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      // placeholder for auth call
      console.log('Login payload', { email, password });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <AuthLayout
        title={t('auth.login.title')}
        subtitle={t('auth.login.subtitle')}
        footer={
          <AuthLink
            label={t('auth.login.noAccount')}
            actionLabel={t('auth.login.createOne')}
            onPress={() => navigation.navigate('Register')}
          />
        }
      >
        <TextField
          label={t('auth.login.email')}
          placeholder={t('auth.login.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <TextField
          label={t('auth.login.password')}
          placeholder={t('auth.login.passwordPlaceholder')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <PrimaryButton label={t('auth.login.button')} onPress={handleLogin} />
      </AuthLayout>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });


