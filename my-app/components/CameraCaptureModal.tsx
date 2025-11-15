import { useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { spacing, typography } from '../res';
import { ColorPalette } from '../res/colors';
import { useThemeColors } from '../src/hooks/useThemeColors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
};

export function CameraCaptureModal({ visible, onClose, onCapture }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible, permission?.granted, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      onCapture(photo.uri);
      onClose();
    } catch {
      // ignore for now
    }
  };

  if (!visible) {
    return null;
  }

  const renderContent = () => {
    if (!permission) {
      return (
        <Text style={styles.infoText}>
          Checking camera permissions. Please wait...
        </Text>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionText}>
            We need your permission to open the camera. Please allow access and
            try again.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Allow camera</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeLabel}>✕</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.shutter} onPress={handleCapture}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>{renderContent()}</View>
    </Modal>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.background,
    },
    camera: {
      flex: 1,
    },
    cameraOverlay: {
      padding: spacing.lg,
      alignItems: 'flex-end',
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeLabel: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: typography.weight.semibold as any,
    },
    controls: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
      backgroundColor: colors.card,
    },
    shutter: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 4,
      borderColor: colors.textPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shutterInner: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.textPrimary,
    },
    infoText: {
      color: colors.textPrimary,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      gap: spacing.md,
    },
    permissionTitle: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
    },
    permissionText: {
      color: colors.textSecondary,
      fontSize: typography.subtitle,
      textAlign: 'center',
    },
    permissionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: 18,
    },
    permissionButtonText: {
      color: colors.textPrimary,
      fontSize: typography.subtitle,
      fontWeight: typography.weight.semibold as any,
    },
  });


