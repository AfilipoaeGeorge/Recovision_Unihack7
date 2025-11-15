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

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-()\s]{6,}$/;

export function RegisterScreen({ navigation }: Props) {
  const t = useTranslation();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors: Partial<typeof form> = {};
    if (!form.firstName.trim()) {
      nextErrors.firstName = t('auth.register.firstNameError');
    }
    if (!form.lastName.trim()) {
      nextErrors.lastName = t('auth.register.lastNameError');
    }
    if (!emailRegex.test(form.email)) {
      nextErrors.email = t('auth.register.emailError');
    }
    if (!phoneRegex.test(form.phone)) {
      nextErrors.phone = t('auth.register.phoneError');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = () => {
    if (validate()) {
      console.log('Register payload', form);
      navigation.navigate('Login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <AuthLayout
        title={t('auth.register.title')}
        subtitle={t('auth.register.subtitle')}
        footer={
          <AuthLink
            label={t('auth.register.alreadyHaveAccount')}
            actionLabel={t('auth.register.back')}
            onPress={() => navigation.navigate('Login')}
          />
        }
      >
        <TextField
          label={t('auth.register.firstName')}
          placeholder={t('auth.register.firstNamePlaceholder')}
          value={form.firstName}
          onChangeText={(value) => updateField('firstName', value)}
          error={errors.firstName}
        />
        <TextField
          label={t('auth.register.lastName')}
          placeholder={t('auth.register.lastNamePlaceholder')}
          value={form.lastName}
          onChangeText={(value) => updateField('lastName', value)}
          error={errors.lastName}
        />
        <TextField
          label={t('auth.register.email')}
          placeholder={t('auth.register.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => updateField('email', value)}
          error={errors.email}
        />
        <TextField
          label={t('auth.register.phone')}
          placeholder={t('auth.register.phonePlaceholder')}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(value) => updateField('phone', value)}
          error={errors.phone}
        />
        <PrimaryButton label={t('auth.register.button')} onPress={handleRegister} />
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


