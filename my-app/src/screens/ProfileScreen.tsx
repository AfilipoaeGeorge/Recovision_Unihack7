import { useCallback, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { spacing, typography } from '../../res';
import { ColorPalette } from '../../res/colors';
import { TextField } from '../../components/TextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CameraCaptureModal } from '../../components/CameraCaptureModal';
import { ScreenHeader } from '../../components/ScreenHeader';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../hooks/useTranslation';

const profileData = {
  cnp: '1700110250546',
  name: 'COJOCARU',
  firstName: 'TOM-MAC-BIL-BOB-CONSTANTIN',
  dateOfBirth: '1987-01-02',
  birthPlace: 'Mun. Drobeta-Turnu Severin Jud. Mehedinți',
  idSeries: 'MH',
  idNumber: '069302',
  sex: 'M',
  citizenship: 'ROU',
  address: 'Str. Decebal nr.43 bl.41AP sc.1 et.9 ap.36, Mun. Drobeta-Turnu Severin Jud. Mehedinți',
  issueDate: '2001-05-03',
  expiryDate: '2011-01-10',
  issuedBy: 'Mun. Dr. Turnu Severin',
  userId: '35631f05-d261-4113-b008-0d24cdc09a11',
  avatarUrl: undefined,
  idImageUrl:
    'https://erasmusstorage.blob.core.windows.net/images/35631f05-d261-4113-b008-0d24cdc09a11/5862c51b-f6e1-431c-b737-41fb3c17651b.jpg',
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const t = useTranslation();
  const [avatarUri, setAvatarUri] = useState(profileData.avatarUrl);
  const [idDocumentUri, setIdDocumentUri] = useState(profileData.idImageUrl);
  const [pickerTarget, setPickerTarget] = useState<'avatar' | 'document' | null>(
    null,
  );
  const [cameraTarget, setCameraTarget] = useState<'avatar' | 'document' | null>(
    null,
  );
  const [cameraVisible, setCameraVisible] = useState(false);
  const [form, setForm] = useState({
    cnp: profileData.cnp,
    lastName: profileData.name,
    firstName: profileData.firstName,
    dateOfBirth: profileData.dateOfBirth,
    birthPlace: profileData.birthPlace,
    idSeries: profileData.idSeries,
    idNumber: profileData.idNumber,
    sex: profileData.sex,
    citizenship: profileData.citizenship,
    address: profileData.address,
    issueDate: profileData.issueDate,
    expiryDate: profileData.expiryDate,
    issuedBy: profileData.issuedBy,
    userId: profileData.userId,
  });
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const gradientStops = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const handleSave = () => {
    console.log('Profile data saved', {
      ...form,
      avatarUri,
      idDocumentUri,
    });
    Alert.alert(t('profile.saved'), t('profile.savedMessage'));
  };

  const handlePick = useCallback(
    async (source: 'camera' | 'library', target: 'avatar' | 'document') => {
      const setUri = target === 'avatar' ? setAvatarUri : setIdDocumentUri;

      const launch = async () => {
        if (source === 'camera') {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(t('profile.permission.needed'), t('profile.permission.camera'));
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
          });
          if (!result.canceled && result.assets?.length) {
            setUri(result.assets[0].uri);
          }
        } else {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(t('profile.permission.needed'), t('profile.permission.gallery'));
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
          });
          if (!result.canceled && result.assets?.length) {
            setUri(result.assets[0].uri);
          }
        }
      };

      try {
        await launch();
      } catch {
        Alert.alert(t('profile.error.title'), t('profile.error.message'));
      }
    },
    [t],
  );

  const openPicker = (target: 'avatar' | 'document') => {
    setPickerTarget(target);
  };

  const closePicker = () => setPickerTarget(null);

  const handleChoice = (source: 'camera' | 'library') => {
    if (!pickerTarget) return;
    if (source === 'camera') {
      setCameraTarget(pickerTarget);
      setCameraVisible(true);
      closePicker();
      return;
    }
    closePicker();
    handlePick('library', pickerTarget);
  };

  const handleCameraCapture = (uri: string) => {
    if (!cameraTarget) return;
    const setUri = cameraTarget === 'avatar' ? setAvatarUri : setIdDocumentUri;
    setUri(uri);
    setCameraVisible(false);
    setCameraTarget(null);
  };

  const closeCamera = () => {
    setCameraVisible(false);
    setCameraTarget(null);
  };

  return (
    <LinearGradient
      style={styles.gradient}
      colors={gradientStops}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title={t('profile.title')}
            subtitle={t('profile.subtitle')}
            onBack={() => navigation.goBack()}
          />

          <Pressable style={styles.avatarCard} onPress={() => openPicker('avatar')}>
            <View style={styles.avatarWrapper}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>
                    {profileData.firstName[0]}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.avatarText}>
              <Text style={styles.avatarTitle}>{t('profile.avatar.title')}</Text>
              <Text style={styles.avatarSubtitle}>
                {t('profile.avatar.subtitle')}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.documentCard}
            onPress={() => openPicker('document')}
          >
            <View style={styles.documentPreview}>
              {idDocumentUri ? (
                <Image source={{ uri: idDocumentUri }} style={styles.documentImage} />
              ) : (
                <View style={styles.documentPlaceholder}>
                  <Text style={styles.documentPlaceholderText}>ID</Text>
                </View>
              )}
            </View>
            <View style={styles.avatarText}>
              <Text style={styles.avatarTitle}>{t('profile.document.title')}</Text>
              <Text style={styles.avatarSubtitle}>
                {t('profile.document.subtitle')}
              </Text>
            </View>
          </Pressable>

          <View style={styles.infoCard}>
            <TextField
              label={t('profile.form.cnp')}
              value={form.cnp}
              onChangeText={(text) => updateField('cnp', text)}
            />
            <TextField
              label={t('profile.form.lastName')}
              value={form.lastName}
              onChangeText={(text) => updateField('lastName', text)}
            />
            <TextField
              label={t('profile.form.firstName')}
              value={form.firstName}
              onChangeText={(text) => updateField('firstName', text)}
            />
            <TextField
              label={t('profile.form.birthDate')}
              placeholder="YYYY-MM-DD"
              value={form.dateOfBirth}
              onChangeText={(text) => updateField('dateOfBirth', text)}
            />
            <TextField
              label={t('profile.form.birthPlace')}
              value={form.birthPlace}
              onChangeText={(text) => updateField('birthPlace', text)}
            />
            <TextField
              label={t('profile.form.idSeries')}
              value={form.idSeries}
              onChangeText={(text) => updateField('idSeries', text)}
            />
            <TextField
              label={t('profile.form.idNumber')}
              value={form.idNumber}
              onChangeText={(text) => updateField('idNumber', text)}
            />
            <TextField
              label={t('profile.form.sex')}
              value={form.sex}
              onChangeText={(text) => updateField('sex', text)}
            />
            <TextField
              label={t('profile.form.citizenship')}
              value={form.citizenship}
              onChangeText={(text) => updateField('citizenship', text)}
            />
            <TextField
              label={t('profile.form.address')}
              multiline
              value={form.address}
              onChangeText={(text) => updateField('address', text)}
            />
            <TextField
              label={t('profile.form.issueDate')}
              value={form.issueDate}
              onChangeText={(text) => updateField('issueDate', text)}
            />
            <TextField
              label={t('profile.form.expiryDate')}
              value={form.expiryDate}
              onChangeText={(text) => updateField('expiryDate', text)}
            />
            <TextField
              label={t('profile.form.issuedBy')}
              value={form.issuedBy}
              onChangeText={(text) => updateField('issuedBy', text)}
            />
            <TextField
              label={t('profile.form.userId')}
              value={form.userId}
              onChangeText={(text) => updateField('userId', text)}
            />
          </View>
          <PrimaryButton label={t('profile.save')} onPress={handleSave} />
        </ScrollView>
      </SafeAreaView>
      <Modal
        visible={!!pickerTarget}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
      >
        <TouchableWithoutFeedback onPress={closePicker}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>{t('profile.modal.title')}</Text>
                <Text style={styles.modalSubtitle}>
                  {t('profile.modal.subtitle')}
                </Text>
                <PrimaryButton
                  label={t('profile.modal.camera')}
                  onPress={() => handleChoice('camera')}
                />
                <PrimaryButton
                  label={t('profile.modal.gallery')}
                  variant="ghost"
                  onPress={() => handleChoice('library')}
                />
                <PrimaryButton label={t('profile.modal.cancel')} variant="ghost" onPress={closePicker} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <CameraCaptureModal
        visible={cameraVisible}
        onClose={closeCamera}
        onCapture={handleCameraCapture}
      />
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
      padding: spacing.xl,
      gap: spacing.lg,
    },
    kicker: {
      color: colors.accent,
      textTransform: 'uppercase',
      letterSpacing: 2,
      fontSize: typography.caption,
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
    avatarCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 28,
      padding: spacing.lg,
      gap: spacing.lg,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    avatarWrapper: {
      width: 96,
      height: 96,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    avatarPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    avatarInitials: {
      color: colors.textPrimary,
      fontSize: 34,
      fontWeight: typography.weight.bold as any,
    },
    avatarText: {
      flex: 1,
      gap: spacing.xs,
    },
    avatarTitle: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
    },
    avatarSubtitle: {
      color: colors.textSecondary,
      fontSize: typography.body,
    },
    documentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 28,
      padding: spacing.lg,
      gap: spacing.lg,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    documentPreview: {
      width: 140,
      height: 96,
      borderRadius: 18,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },
    documentImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    documentPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    documentPlaceholderText: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 28,
      padding: spacing.lg,
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(5, 14, 31, 0.8)',
      justifyContent: 'flex-end',
      padding: spacing.lg,
    },
    modalCard: {
      backgroundColor: colors.card,
      borderRadius: 28,
      padding: spacing.lg,
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    modalTitle: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
    },
    modalSubtitle: {
      color: colors.textSecondary,
      fontSize: typography.body,
    },
  });


