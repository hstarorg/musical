import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = {
  size?: number;
  borderRadius?: number;
};

export function DefaultCover({ size = 48, borderRadius = 6 }: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="music-note"
        size={size * 0.5}
        color="#ffffffcc"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#764ba2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
