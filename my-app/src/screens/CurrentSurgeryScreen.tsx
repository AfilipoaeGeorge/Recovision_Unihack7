import { useCallback, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { spacing, typography } from '../../res';
import { ColorPalette } from '../../res/colors';
import { ScreenHeader } from '../../components/ScreenHeader';
import { RootStackParamList } from '../navigation/types';
import { CameraCaptureModal } from '../../components/CameraCaptureModal';
import { MediapipeOverlayModal } from '../../components/MediapipeOverlayModal';
import { SurgeryDetailView } from '../../components/SurgeryDetailView';
import { currentSurgery } from '../data/surgeries';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../hooks/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'CurrentSurgery'>;

export function CurrentSurgeryScreen({ navigation }: Props) {
  const t = useTranslation();
  const [scarImages, setScarImages] = useState(currentSurgery.scarImages);
  const [predictionsByUri, setPredictionsByUri] = useState<Record<string, string>>({});
  const [pickerVisible, setPickerVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const gradientStops = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );

  const addScarImage = useCallback((uri: string) => {
    setScarImages((prev) => [uri, ...prev]);
  }, []);

  const classifyScarImage = useCallback(async (uri: string) => {
    try {
      const form = new FormData();

      // Infer filename and MIME type from uri
      const getNameAndType = (path: string): { name: string; type: string } => {
        const match = path.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
        const ext = (match?.[1] || 'jpg').toLowerCase();
        const map: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          webp: 'image/webp',
          heic: 'image/heic',
          heif: 'image/heif',
        };
        const type = map[ext] || 'application/octet-stream';
        return { name: `scar.${ext}`, type };
      };

      if (Platform.OS === 'web') {
        // On web, the uri can be a data URL or blob URL; convert to Blob/File
        const res = await fetch(uri);
        const blob = await res.blob();
        const { name, type } = getNameAndType((blob as any).name || uri);
        const file = new File([blob], name, { type: blob.type || type });
        form.append('file', file);
      } else {
        const { name, type } = getNameAndType(uri);
        form.append('file', {
          uri,
          name,
          type,
        } as any);
      }

      const response = await fetch(
        'https://recovision-ai.wonderfulsmoke-9d940820.swedencentral.azurecontainerapps.io/predict',
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
          },
          body: form,
        },
      );
      if (!response.ok) {
        return;
      }
      const data = (await response.json());
      console.log("API RESPONSE:", data);
      if (data?.label) {
        setPredictionsByUri((prev) => ({ ...prev, [uri]: data.label as string }));
      }
    } catch {
      // ignore errors for now
    }
  }, []);

  const handleGalleryPick = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('profile.permission.needed'), t('currentSurgery.permission.gallery'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      addScarImage(uri);
      classifyScarImage(uri);
    }
  }, [addScarImage, t, classifyScarImage]);

  const openPicker = () => setPickerVisible(true);
  const closePicker = () => setPickerVisible(false);

  const handleChoice = (source: 'camera' | 'library') => {
    closePicker();
    if (source === 'camera') {
      // Show Mediapipe overlay camera (with landmarks). You can switch to capture modal if needed.
      setOverlayVisible(true);
    } else {
      handleGalleryPick();
    }
  };

  const handleCameraCapture = (uri: string) => {
    addScarImage(uri);
    classifyScarImage(uri);
    setCameraVisible(false);
  };

  const closeCamera = () => setCameraVisible(false);
  const closeOverlay = () => setOverlayVisible(false);

  const handleDeleteScar = (uri: string) => {
    setScarImages((prev) => prev.filter((item) => item !== uri));
    setPredictionsByUri((prev) => {
      const next = { ...prev };
      delete next[uri];
      return next;
    });
  };

  return (
    <LinearGradient
      style={styles.gradient}
      colors={gradientStops as any}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title={t('currentSurgery.title')}
            subtitle={t('currentSurgery.subtitle')}
            onBack={() => navigation.goBack()}
          />
          <SurgeryDetailView
            surgery={currentSurgery}
            scarImages={scarImages}
            onUploadPress={openPicker}
            onDeleteScar={handleDeleteScar}
            captionsByUri={predictionsByUri}
            showUploadButton
          />
        </ScrollView>
        <Modal
          visible={pickerVisible}
          transparent
          animationType="fade"
          onRequestClose={closePicker}
        >
          <TouchableWithoutFeedback onPress={closePicker}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  <Text style={styles.modalTitle}>{t('currentSurgery.modal.title')}</Text>
                  <Text style={styles.modalSubtitle}>
                    {t('currentSurgery.modal.subtitle')}
                  </Text>
                  <PrimaryButton
                    label={t('currentSurgery.modal.camera')}
                    onPress={() => handleChoice('camera')}
                  />
                  <PrimaryButton
                    label={t('currentSurgery.modal.gallery')}
                    variant="ghost"
                    onPress={() => handleChoice('library')}
                  />
                  <PrimaryButton label={t('currentSurgery.modal.cancel')} variant="ghost" onPress={closePicker} />
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
        <MediapipeOverlayModal visible={overlayVisible} onClose={closeOverlay} />
      </SafeAreaView>
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
      gap: spacing.xl,
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


