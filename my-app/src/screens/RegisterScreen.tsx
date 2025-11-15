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

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-()\s]{6,}$/;

export function RegisterScreen({ navigation }: Props) {
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
      nextErrors.firstName = 'First name is required.';
    }
    if (!form.lastName.trim()) {
      nextErrors.lastName = 'Last name is required.';
    }
    if (!emailRegex.test(form.email)) {
      nextErrors.email = 'Add a valid email.';
    }
    if (!phoneRegex.test(form.phone)) {
      nextErrors.phone = 'Add a reachable phone number.';
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
        title="Create account"
        subtitle="Let’s set up your profile so we can personalize your recovery."
        footer={
          <AuthLink
            label="Already have an account?"
            actionLabel="Back to login"
            onPress={() => navigation.navigate('Login')}
          />
        }
      >
        <TextField
          label="First name"
          placeholder="John"
          value={form.firstName}
          onChangeText={(value) => updateField('firstName', value)}
          error={errors.firstName}
        />
        <TextField
          label="Last name"
          placeholder="Doe"
          value={form.lastName}
          onChangeText={(value) => updateField('lastName', value)}
          error={errors.lastName}
        />
        <TextField
          label="Email"
          placeholder="john.doe@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => updateField('email', value)}
          error={errors.email}
        />
        <TextField
          label="Phone number"
          placeholder="+40 712 345 678"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(value) => updateField('phone', value)}
          error={errors.phone}
        />
        <PrimaryButton label="Register" onPress={handleRegister} />
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


