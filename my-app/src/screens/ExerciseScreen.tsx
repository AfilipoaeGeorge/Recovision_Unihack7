import { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, StyleSheet, View, Dimensions, Text, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing, typography } from '../../res';
import { ColorPalette } from '../../res/colors';
import { ScreenHeader } from '../../components/ScreenHeader';
import { RootStackParamList } from '../navigation/types';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTranslation } from '../hooks/useTranslation';
import { ExerciseCamera } from '../components/ExerciseCamera';
import { useCameraPermissions } from 'expo-camera';
import { PrimaryButton } from '../../components/PrimaryButton';
import { PoseOverlay } from '../components/PoseOverlay';

type Props = NativeStackScreenProps<RootStackParamList, 'Exercise'>;

export function ExerciseScreen({ navigation }: Props) {
  const t = useTranslation();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [landmarks, setLandmarks] = useState<{ x: number; y: number; visibility?: number }[]>([]);
  const cameraWidth = useMemo(
    () => Dimensions.get('window').width - spacing.xl * 2,
    [],
  );
  const cameraHeight = useMemo(
    () => (cameraWidth * 16) / 9,
    [cameraWidth],
  );
  const gradientStops = useMemo(
    () => [colors.background, colors.surface, colors.card],
    [colors],
  );

  const startExercise = async () => {
    // Request permission only if not granted
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        return;
      }
    }
    setShowCamera(true);
  };

  const closeExercise = () => {
    navigation.goBack();
  };
  return (
    <LinearGradient
      style={styles.gradient}
      colors={gradientStops as any}
    >
      <SafeAreaView style={styles.safeArea}>
        {showCamera ? (
          <View style={styles.cameraFullscreen}>
            <View style={styles.backTopLeft}>
              <PrimaryButton
                variant="ghost"
                label={t('common.back' as any)}
                onPress={closeExercise}
                style={{ width: undefined, paddingHorizontal: spacing.lg }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ExerciseCamera
                width={Dimensions.get('window').width}
                height={Dimensions.get('window').height}
                onLandmark={(data: unknown) => {
                  // Normalize different possible shapes of landmark payloads
                  try {
                    let points: any[] = [];
                    if (Array.isArray(data)) {
                      points = data as any[];
                    } else if (data && typeof data === 'object') {
                      // common keys: landmarks, poseLandmarks, points
                      // @ts-expect-error dynamic
                      points = data.landmarks || data.poseLandmarks || data.points || [];
                    }
                    const normalized = (points as any[])
                      .map((p) => {
                        const x = typeof p.x === 'number' ? p.x : Number(p[0]);
                        const y = typeof p.y === 'number' ? p.y : Number(p[1]);
                        const visibility =
                          typeof p.visibility === 'number'
                            ? p.visibility
                            : typeof p.v === 'number'
                            ? p.v
                            : undefined;
                        return { x, y, visibility };
                      })
                      .filter(
                        (p) =>
                          typeof p.x === 'number' &&
                          typeof p.y === 'number' &&
                          !Number.isNaN(p.x) &&
                          !Number.isNaN(p.y),
                      );
                    setLandmarks(normalized);
                  } catch {
                    // ignore malformed payloads
                  }
                }}
              />
              {Platform.OS !== 'web' && (
                <PoseOverlay
                  width={Dimensions.get('window').width}
                  height={Dimensions.get('window').height}
                  landmarks={landmarks}
                />
              )}
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <ScreenHeader
              title={t('exercise.title')}
              subtitle={t('exercise.subtitle')}
              onBack={() => navigation.goBack()}
            />
            <PrimaryButton
              label={t('exercise.start' as any)}
              onPress={startExercise}
            />
          </View>
        )}
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
    content: {
      flex: 1,
      padding: spacing.xl,
      gap: spacing.md,
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
    cameraFullscreen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backTopLeft: {
      position: 'absolute',
      top: spacing.lg,
      left: spacing.lg,
      zIndex: 10,
    },
    cameraContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraFeed: {
      // 16:9 box sized to screen width with margins
      width: Dimensions.get('window').width - spacing.xl * 2,
      height: ((Dimensions.get('window').width - spacing.xl * 2) * 16) / 9,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    infoBox: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      borderRadius: 12,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoText: {
      color: colors.textSecondary,
      fontSize: typography.subtitle,
      textAlign: 'center',
    },
  });


