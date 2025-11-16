import React from 'react';
import { ViewStyle } from 'react-native';
import { RNMediapipe } from '@thinksys/react-native-mediapipe';

type Props = {
  width: number;
  height: number;
  style?: ViewStyle;
  onLandmark?: (data: unknown) => void;
};

export function ExerciseCamera({ width, height, style, onLandmark }: Props) {
  return (
    <RNMediapipe
      width={width}
      height={height}
      onLandmark={onLandmark}
      face={true}
      leftArm={true}
      rightArm={true}
      leftWrist={true}
      rightWrist={true}
      torso={true}
      leftLeg={true}
      rightLeg={true}
      leftAnkle={true}
      rightAnkle={true}
      // @ts-expect-error allow style passthrough if supported
      style={style}
    />
  );
}


