import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Alert,
  ColorValue,
  Image,
  Modal,
  Platform,
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
import { useFocusEffect } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 24;
const FORM_FIELD_KEYS = [
  'cnp',
  'lastName',
  'firstName',
  'dateOfBirth',
  'birthPlace',
  'idSeries',
  'idNumber',
  'sex',
  'citizenship',
  'address',
  'issueDate',
  'expiryDate',
  'issuedBy',
  'userId',
] as const;
type FormFieldKey = (typeof FORM_FIELD_KEYS)[number];
// Mapping from backend field names to form field names
const PARSED_FIELD_MAP: Record<FormFieldKey, string[]> = {
  cnp: ['cnp'],
  lastName: ['nume'],
  firstName: ['prenume'],
  dateOfBirth: ['data_nasterii'],
  birthPlace: ['loc_nastere'],
  idSeries: ['serie_ci'],
  idNumber: ['numar_ci'],
  sex: ['sex'],
  citizenship: ['cetatenie'],
  address: ['adresa'],
  issueDate: ['data_emitere'],
  expiryDate: ['data_expirare'],
  issuedBy: ['emis_de'],
  userId: ['user_id'],
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PROFILE_STORAGE_KEY_PREFIX = '@recovision:profileData';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const t = useTranslation();
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [idDocumentUri, setIdDocumentUri] = useState<string | undefined>(undefined);
  const [pickerTarget, setPickerTarget] = useState<'avatar' | 'document' | null>(
    null,
  );
  const [cameraTarget, setCameraTarget] = useState<'avatar' | 'document' | null>(
    null,
  );
  const [cameraVisible, setCameraVisible] = useState(false);
  const [form, setForm] = useState({
    cnp: '',
    lastName: '',
    firstName: '',
    dateOfBirth: '',
    birthPlace: '',
    idSeries: '',
    idNumber: '',
    sex: '',
    citizenship: '',
    address: '',
    issueDate: '',
    expiryDate: '',
    issuedBy: '',
    userId: '',
  });
  const [blocking, setBlocking] = useState({
    active: false,
    message: '',
  });
  const [fileStatus, setFileStatus] = useState<number | null>(null);
  const processingRef = useRef(false);
  const mountedRef = useRef(true);
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const gradientStops = useMemo<[ColorValue, ColorValue, ColorValue]>(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );

  const isDocumentLoaded = fileStatus === 3 && !!idDocumentUri;

  const showBlocking = useCallback((message: string) => {
    setBlocking({ active: true, message });
  }, []);

  const updateBlockingMessage = useCallback((message: string) => {
    setBlocking((prev) => ({ ...prev, active: true, message }));
  }, []);

  const hideBlocking = useCallback(() => {
    setBlocking({ active: false, message: '' });
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (blocking.active) {
      setPickerTarget(null);
      setCameraVisible(false);
    }
  }, [blocking.active]);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getProfileStorageKeyForCurrentUser = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem('@userData');
      if (!raw) return null;
      const user = JSON.parse(raw);
      const userId = user?.userId ?? user?.user_id ?? user?.id ?? user?.Id;
      if (!userId) return null;
      return `${PROFILE_STORAGE_KEY_PREFIX}:${String(userId)}`;
    } catch (error) {
      console.log('Could not resolve profile storage key:', error);
      return null;
    }
  }, []);

  // Load profile data from AsyncStorage
  const loadProfileDataFromStorage = useCallback(async () => {
    try {
      const storageKey = await getProfileStorageKeyForCurrentUser();
      if (!storageKey) return false;

      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        const profileData = JSON.parse(stored);
        if (profileData.form) {
          setForm(profileData.form);
        }
        if (profileData.avatarUri) {
          setAvatarUri(profileData.avatarUri);
        }
        if (profileData.idDocumentUri) {
          setIdDocumentUri(profileData.idDocumentUri);
        }
        return true; // Data was loaded
      }
    } catch (error) {
      console.log('Could not load profile data from storage:', error);
    }
    return false; // No data was loaded
  }, [getProfileStorageKeyForCurrentUser]);

  const getTokenOrThrow = useCallback(async () => {
    const token = await AsyncStorage.getItem('@authToken');
    if (!token) {
      throw new Error('Nu am găsit token-ul de autentificare. Te rugăm să te loghezi din nou.');
    }
    return token;
  }, []);

  const checkFileStatus = useCallback(async () => {
    try {
      const token = await getTokenOrThrow();
      const statusResponse = await fetch(`${API_URL}/Pacient/file-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statusResponse.ok) {
        const statusPayload = await statusResponse.json();
        const status = statusPayload?.fileStatus;
        setFileStatus(status);
      }
    } catch (error) {
      // Silently fail if status cannot be checked
      console.log('Could not check file status:', error);
    }
  }, [getTokenOrThrow]);

  const uploadIdDocument = useCallback(async (uri: string, token: string) => {
    let fileName = uri.split('/').pop() ?? `document-${Date.now()}.jpg`;
    // Remove query parameters if present (e.g., blob URLs)
    fileName = fileName.split('?')[0];
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    // Ensure we have a valid extension for backend validation
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const hasValidExtension = extension && allowedExtensions.includes(extension);
    
    if (!hasValidExtension) {
      // If no valid extension, default to jpg
      fileName = fileName.includes('.') 
        ? fileName.replace(/\.[^.]+$/, '.jpg')
        : `${fileName}.jpg`;
    }
    
    const finalExtension = extension && allowedExtensions.includes(extension) ? extension : 'jpg';
    
    const mimeType =
      finalExtension === 'png'
        ? 'image/png'
        : finalExtension === 'gif'
          ? 'image/gif'
          : finalExtension === 'webp'
            ? 'image/webp'
            : 'image/jpeg';

    const formData = new FormData();
    
    // For web platform, we need to convert URI to Blob/File
    if (Platform.OS === 'web') {
      try {
        // Fetch the image as blob
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Create a File object from the blob
        const file = new File([blob], fileName, { type: mimeType });
        formData.append('file', file);
      } catch (error) {
        throw new Error('Nu am putut procesa imaginea pentru upload.');
      }
    } else {
      // For React Native (iOS/Android), use the standard structure
      formData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: fileName,
        type: mimeType,
      } as any);
    }

    const response = await fetch(`${API_URL}/ImageUpload/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type manually - let fetch set it with boundary
      },
      body: formData,
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || 'Încărcarea documentului a eșuat.';
      throw new Error(errorMessage);
    }

    return data;
  }, []);

  const applyParsedData = useCallback(
    (data: Record<string, any>, preserveNameFields = false) => {
      let newIdDocumentUri = idDocumentUri;
      if (data?.image_url) {
        newIdDocumentUri = data.image_url;
        setIdDocumentUri(newIdDocumentUri);
      }

      setForm((prev) => {
        const next = { ...prev };
        FORM_FIELD_KEYS.forEach((key: FormFieldKey) => {
          // Don't overwrite lastName and firstName if they already exist and we want to preserve them
          if (preserveNameFields && (key === 'lastName' || key === 'firstName')) {
            if (prev[key] && prev[key].trim().length > 0) {
              return; // Keep existing value from buletin
            }
          }

          const candidateKeys = PARSED_FIELD_MAP[key];
          const value = candidateKeys
            .map((fieldName) => data?.[fieldName])
            .find((entry) => entry !== undefined && entry !== null && `${entry}`.trim().length);
          if (value !== undefined && value !== null) {
            next[key] = String(value).trim();
          }
        });

        // Save to storage after applying parsed data (only when data comes from backend)
        const save = async () => {
          try {
            const storageKey = await getProfileStorageKeyForCurrentUser();
            if (!storageKey) return;
            const profileData = {
              form: next,
              avatarUri,
              idDocumentUri: newIdDocumentUri || idDocumentUri,
              savedAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem(storageKey, JSON.stringify(profileData));
          } catch (error) {
            console.log('Could not save profile data:', error);
          }
        };

        // fire and forget
        save();

        return next;
      });
    },
    [avatarUri, getProfileStorageKeyForCurrentUser, idDocumentUri],
  );

  const fetchProfileFromBackend = useCallback(async () => {
    try {
      const token = await getTokenOrThrow();
      const response = await fetch(`${API_URL}/Pacient/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Preserve lastName and firstName from buletin when loading from /Pacient/profile
        applyParsedData(data, true);
        if (data?.image_url) {
          setIdDocumentUri(data.image_url);
        }
      }
    } catch (error) {
      // Silently fail if profile data cannot be loaded from backend
      // Data from storage will still be shown
      console.log('Could not load profile data from backend:', error);
    }
  }, [applyParsedData, getTokenOrThrow]);

  // Load profile data on mount - first from storage, then from backend
  useEffect(() => {
    const loadProfileData = async () => {
      // First, try to load from storage
      await loadProfileDataFromStorage();
      // Then always try to load latest data from backend
      await fetchProfileFromBackend();
    };

    loadProfileData();
    // Check file status on mount
    checkFileStatus();
  }, [fetchProfileFromBackend, loadProfileDataFromStorage, checkFileStatus]);

  // Re-fetch profile every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProfileFromBackend();
      checkFileStatus();
    }, [fetchProfileFromBackend, checkFileStatus]),
  );

  const fetchParsedData = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(`${API_URL}/Pacient/parsed-data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || data?.error || 'Nu am putut prelua datele procesate.');
        }

        applyParsedData(data);
      } catch (err: any) {
        throw err instanceof Error
          ? err
          : new Error('Nu am putut prelua datele procesate.');
      }
    },
    [applyParsedData],
  );

  const pollFileStatusAndAutofill = useCallback(
    async (token: string) => {
      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        if (!mountedRef.current) {
          return;
        }
        const statusResponse = await fetch(`${API_URL}/Pacient/file-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const statusPayload = await statusResponse.json();

        if (!statusResponse.ok) {
          throw new Error(
            statusPayload?.message || statusPayload?.error || 'Nu am putut verifica statusul fișierului.',
          );
        }

        const currentFileStatus = statusPayload?.fileStatus;
        setFileStatus(currentFileStatus);

        if (currentFileStatus === 2) {
          updateBlockingMessage(t('profile.upload.fetching'));
          await fetchParsedData(token);
          // After fetching data, status should be 3 (loaded)
          setFileStatus(3);
          if (mountedRef.current) {
            Alert.alert(t('profile.upload.successTitle'), t('profile.upload.success'));
          }
          return;
        }

        await delay(POLL_INTERVAL_MS);
      }

      throw new Error('Procesarea documentului durează mai mult decât ne așteptam. Încearcă din nou.');
    },
    [fetchParsedData, t, updateBlockingMessage],
  );

  const processIdDocument = useCallback(
    async (uri: string) => {
      if (!uri || processingRef.current) return;
      processingRef.current = true;
      showBlocking(t('profile.upload.uploading'));
      try {
        const token = await getTokenOrThrow();
        await uploadIdDocument(uri, token);
        updateBlockingMessage(t('profile.upload.processing'));
        await pollFileStatusAndAutofill(token);
      } catch (error: any) {
        const message =
          error?.message || 'A apărut o eroare în timpul procesării documentului. Te rugăm să încerci din nou.';
        Alert.alert('Eroare', message);
      } finally {
        processingRef.current = false;
        if (mountedRef.current) {
          hideBlocking();
        }
      }
    },
    [
      getTokenOrThrow,
      hideBlocking,
      pollFileStatusAndAutofill,
      showBlocking,
      t,
      updateBlockingMessage,
      uploadIdDocument,
    ],
  );

  const handleSelectedImage = useCallback(
    async (target: 'avatar' | 'document', uri: string) => {
      if (!uri) return;
      if (target === 'avatar') {
        setAvatarUri(uri);
        return;
      }
      setIdDocumentUri(uri);
      await processIdDocument(uri);
    },
    [processIdDocument],
  );
  const handleSave = useCallback(async () => {
    try {
      const token = await getTokenOrThrow();

      const payload = {
        cnp: form.cnp || '',
        nume: form.lastName || '',
        prenume: form.firstName || '',
        data_Nasterii: form.dateOfBirth || '',
        loc_Nastere: form.birthPlace || '',
        serie_Ci: form.idSeries || '',
        numar_Ci: form.idNumber || '',
        sex: form.sex || '',
        cetatenie: form.citizenship || '',
        adresa: form.address || '',
        telefon: '', // telefonul poate fi completat ulterior în backend sau extins UI-ul
        data_Emitere: form.issueDate || '',
        data_Expirare: form.expiryDate || '',
        emis_De: form.issuedBy || '',
      };

      const response = await fetch(`${API_URL}/Pacient/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message || data?.error || 'Nu am putut salva profilul.';
        Alert.alert(t('profile.error.title'), message);
        return;
      }

      // După salvare, reîncarcă profilul din backend ca să fie sigur că UI + storage au datele noi
      await fetchProfileFromBackend();

      Alert.alert(t('profile.saved'), t('profile.savedMessage'));
    } catch (error: any) {
      const message =
        error?.message || 'A apărut o eroare la salvarea profilului. Te rugăm să încerci din nou.';
      Alert.alert(t('profile.error.title'), message);
    }
  }, [form, getTokenOrThrow, t, fetchProfileFromBackend]);

  const handlePick = useCallback(
    async (source: 'camera' | 'library', target: 'avatar' | 'document') => {
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
            await handleSelectedImage(target, result.assets[0].uri);
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
            await handleSelectedImage(target, result.assets[0].uri);
          }
        }
      };

      try {
        await launch();
      } catch {
        Alert.alert(t('profile.error.title'), t('profile.error.message'));
      }
    },
    [handleSelectedImage, t],
  );

  const openPicker = useCallback(
    (target: 'avatar' | 'document') => {
      if (blocking.active || processingRef.current) return;
      setPickerTarget(target);
    },
    [blocking.active],
  );

  const closePicker = useCallback(() => setPickerTarget(null), []);

  const handleChoice = useCallback(
    (source: 'camera' | 'library') => {
      if (!pickerTarget || blocking.active) return;
      if (source === 'camera') {
        setCameraTarget(pickerTarget);
        setCameraVisible(true);
        closePicker();
        return;
      }
      closePicker();
      handlePick('library', pickerTarget);
    },
    [blocking.active, closePicker, handlePick, pickerTarget],
  );

  const handleCameraCapture = async (uri: string) => {
    if (!cameraTarget) return;
    const target = cameraTarget;
    setCameraVisible(false);
    setCameraTarget(null);
    await handleSelectedImage(target, uri);
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
          pointerEvents={blocking.active ? 'none' : 'auto'}
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
                    {form.firstName?.[0]?.toUpperCase() || form.lastName?.[0]?.toUpperCase() || '?'}
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
            style={[
              styles.documentCard,
              isDocumentLoaded ? styles.documentCardLoaded : styles.documentCardNotLoaded,
            ]}
            onPress={() => openPicker('document')}
          >
            <View style={styles.documentPreview}>
              {idDocumentUri ? (
                <Image source={{ uri: idDocumentUri }} style={styles.documentImage} />
              ) : (
                <View style={styles.documentPlaceholder} />
              )}
              <View style={styles.documentCornerLabel}>
                <Text style={styles.documentCornerLabelText}>ID</Text>
              </View>
            </View>
            <View style={styles.avatarText}>
              <Text style={styles.avatarTitle}>{t('profile.document.title')}</Text>
              <Text style={styles.avatarSubtitle}>
                {t('profile.document.subtitle')}
              </Text>
              <Text
                style={[
                  styles.documentStatus,
                  !isDocumentLoaded && styles.documentStatusDanger,
                ]}
              >
                {isDocumentLoaded
                  ? t('profile.document.status.loaded')
                  : t('profile.document.status.notLoaded')}
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
      {blocking.active && (
        <View style={styles.blockingOverlay} pointerEvents="auto">
          <View style={styles.blockingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.blockingText}>{blocking.message}</Text>
          </View>
        </View>
      )}
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
    documentCardLoaded: {
      backgroundColor: 'rgba(74, 222, 128, 0.12)', // light green
      borderColor: colors.accent,
    },
    documentCardNotLoaded: {
      backgroundColor: 'rgba(248, 113, 113, 0.12)', // light red
      borderColor: colors.danger,
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
    documentCornerLabel: {
      position: 'absolute',
      top: spacing.xs,
      left: spacing.xs,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      paddingHorizontal: spacing.xs,
      paddingVertical: 4,
      borderRadius: 999,
    },
    documentCornerLabelText: {
      color: colors.textPrimary,
      fontSize: typography.caption,
      fontWeight: typography.weight.semibold as any,
    },
    documentStatus: {
      color: colors.accent,
      fontSize: typography.caption,
      fontWeight: typography.weight.semibold as any,
      marginTop: spacing.xs,
    },
    documentStatusDanger: {
      color: colors.danger,
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
    blockingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(5, 14, 31, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    blockingCard: {
      backgroundColor: colors.card,
      borderRadius: 28,
      padding: spacing.xl,
      alignItems: 'center',
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.primaryMuted,
    },
    blockingText: {
      color: colors.textPrimary,
      textAlign: 'center',
      fontSize: typography.body,
    },
  });


