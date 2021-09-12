import React from 'react';
import { View, Text } from 'react-native';
import { ScreenPropsBase } from '../../types';
import { Header } from 'react-native/Libraries/NewAppScreen';

export default (props: ScreenPropsBase) => {
  return (
    <View>
      <Header />
      <Text>Mine Page</Text>
    </View>
  );
};
