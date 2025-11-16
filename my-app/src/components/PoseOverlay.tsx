import React from 'react';
import { View, StyleSheet } from 'react-native';

type Landmark = { x: number; y: number; visibility?: number };

type Props = {
  width: number;
  height: number;
  landmarks: Landmark[];
};

export function PoseOverlay({ width, height, landmarks }: Props) {
  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {landmarks.map((lm, index) => {
        if (
          lm == null ||
          Number.isNaN(lm.x) ||
          Number.isNaN(lm.y) ||
          lm.x < 0 ||
          lm.x > 1 ||
          lm.y < 0 ||
          lm.y > 1
        ) {
          return null;
        }
        const left = lm.x * width - 3;
        const top = lm.y * height - 3;
        const opacity =
          typeof lm.visibility === 'number' ? Math.max(0.3, Math.min(1, lm.visibility)) : 0.9;
        return <View key={index} style={[styles.point, { left, top, opacity }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  point: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80', // green-400
    borderWidth: 1,
    borderColor: '#065F46', // emerald-800
  },
});


