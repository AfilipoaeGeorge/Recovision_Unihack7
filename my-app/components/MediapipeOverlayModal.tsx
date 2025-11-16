import { useMemo, useState } from 'react';
import { Modal, StyleSheet, View, Dimensions } from 'react-native';
import { spacing, typography } from '../res';
import { ColorPalette } from '../res/colors';
import { useThemeColors } from '../src/hooks/useThemeColors';
import { PrimaryButton } from './PrimaryButton';
import { ExerciseCamera } from '../src/components/ExerciseCamera';
import { PoseOverlay } from '../src/components/PoseOverlay';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function MediapipeOverlayModal({ visible, onClose }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [landmarks, setLandmarks] = useState<{ x: number; y: number; visibility?: number }[]>([]);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.backTopLeft}>
          <PrimaryButton
            variant="ghost"
            label="Back"
            onPress={onClose}
            style={{ width: undefined, paddingHorizontal: spacing.lg }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <ExerciseCamera
            width={width}
            height={height}
            onLandmark={(data: unknown) => {
              try {
                let points: any[] = [];
                if (Array.isArray(data)) {
                  points = data as any[];
                } else if (data && typeof data === 'object') {
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
          <PoseOverlay width={width} height={height} landmarks={landmarks} />
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backTopLeft: {
      position: 'absolute',
      top: spacing.lg,
      left: spacing.lg,
      zIndex: 10,
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.title,
      fontWeight: typography.weight.semibold as any,
    },
  });


