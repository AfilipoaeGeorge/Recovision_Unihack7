import React, { useEffect } from 'react';
import { View, Text, ViewStyle, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

type Props = {
  width: number;
  height: number;
  style?: ViewStyle;
  onLandmark?: (data: unknown) => void;
};

export function ExerciseCamera({ width, height }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  useEffect(() => {
    if (!permission?.granted) {
      // Best-effort request on mount; the screen also handles permissions
      requestPermission().catch(() => {});
    }
  }, [permission?.granted, requestPermission]);

  if (!permission) {
    return (
      <View style={[styles.center, { width, height }]}>
        <Text>Checking camera permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.center, { width, height }]}>
        <Text style={styles.infoText}>Camera permission required</Text>
        <Text style={styles.subText}>Please allow access to use the camera.</Text>
      </View>
    );
  }

  return (
    <CameraView
      style={{ width, height }}
      facing="user"
    />
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontWeight: '600',
    marginBottom: 8,
  },
  subText: {
    opacity: 0.8,
  },
});


