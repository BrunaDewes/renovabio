import { Ionicons } from '@expo/vector-icons';
import { Image, View } from 'react-native';

type AvatarProps = {
  size: number;
  photoUri?: string | null;
  borderColor?: string;
  backgroundColor?: string;
  iconColor?: string;
};

export function Avatar({
  size,
  photoUri,
  borderColor = '#FFFFFF',
  backgroundColor = 'rgba(255,255,255,0.18)',
  iconColor = '#FFFFFF',
}: AvatarProps) {
  const borderRadius = size / 2;

  if (photoUri) {
    return (
      <Image
        source={{ uri: photoUri }}
        style={{
          width: size,
          height: size,
          borderRadius,
          borderWidth: 3,
          borderColor,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius,
        borderWidth: 3,
        borderColor,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name="person" size={size * 0.48} color={iconColor} />
    </View>
  );
}
