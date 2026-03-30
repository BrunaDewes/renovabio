import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

type PasswordInputProps = Omit<TextInputProps, 'style'> & {
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function PasswordInput({
  borderColor = '#94c61f',
  textColor = '#f8f4d9',
  iconColor = '#f8f4d9',
  backgroundColor = 'transparent',
  containerStyle,
  inputStyle,
  ...props
}: PasswordInputProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View
      style={[
        {
          width: '100%',
          borderWidth: 1.5,
          borderColor,
          borderRadius: 20,
          paddingLeft: 16,
          paddingRight: 12,
          backgroundColor,
          flexDirection: 'row',
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      <TextInput
        {...props}
        secureTextEntry={!visivel}
        placeholderTextColor={props.placeholderTextColor ?? textColor}
        style={[
          {
            flex: 1,
            paddingVertical: 14,
            color: textColor,
          },
          inputStyle,
        ]}
      />

      <Pressable onPress={() => setVisivel((atual) => !atual)} hitSlop={8}>
        <Ionicons
          name={visivel ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color={iconColor}
        />
      </Pressable>
    </View>
  );
}
