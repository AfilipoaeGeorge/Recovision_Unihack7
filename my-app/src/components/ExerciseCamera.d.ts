import type { ViewStyle } from 'react-native';

export type ExerciseCameraProps = {
  width: number;
  height: number;
  style?: ViewStyle;
  onLandmark?: (data: unknown) => void;
};

export declare function ExerciseCamera(props: ExerciseCameraProps): JSX.Element;


