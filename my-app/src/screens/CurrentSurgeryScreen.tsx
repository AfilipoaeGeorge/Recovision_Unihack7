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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { spacing, typography } from '../../res';
import { ColorPalette } from '../../res/colors';
import { ScreenHeader } from '../../components/ScreenHeader';
import { RootStackParamList } from '../navigation/types';
import { CameraCaptureModal } from '../../components/CameraCaptureModal';
import { SurgeryDetailView } from '../../components/SurgeryDetailView';
import { currentSurgery } from '../data/surgeries';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../hooks/useTranslation';

type Props = NativeStackScreenProps<RootStackParamList, 'CurrentSurgery'>;

export function CurrentSurgeryScreen({ navigation }: Props) {
  const t = useTranslation();
  const [scarImages, setScarImages] = useState(currentSurgery.scarImages);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const gradientStops = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );

  const addScarImage = useCallback((uri: string) => {
    setScarImages((prev) => [uri, ...prev]);
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
      addScarImage(result.assets[0].uri);
    }
  }, [addScarImage, t]);

  const openPicker = () => setPickerVisible(true);
  const closePicker = () => setPickerVisible(false);

  const handleChoice = (source: 'camera' | 'library') => {
    closePicker();
    if (source === 'camera') {
      setCameraVisible(true);
    } else {
      handleGalleryPick();
    }
  };

  const handleCameraCapture = (uri: string) => {
    addScarImage(uri);
    setCameraVisible(false);
  };

  const closeCamera = () => setCameraVisible(false);

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
            title={t('currentSurgery.title')}
            subtitle={t('currentSurgery.subtitle')}
            onBack={() => navigation.goBack()}
          />
          <SurgeryDetailView
            surgery={currentSurgery}
            scarImages={scarImages}
            onUploadPress={openPicker}
            onDeleteScar={(uri) =>
              setScarImages((prev) => prev.filter((item) => item !== uri))
            }
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


