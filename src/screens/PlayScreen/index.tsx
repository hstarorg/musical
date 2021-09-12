import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { ScreenPropsBase } from '../../types';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const nativeStackNavigator = createNativeStackNavigator();

export default (props: ScreenPropsBase) => {
  const { navigation } = props;

  // useEffect(() => {
  //   setTimeout(() => {
  //     navigation.navigate('Page1');
  //   }, 2000);
  // }, []);

  return (
    <View>
      <Button
        title="点我试试"
        onPress={() => {
          navigation.navigate('Page2');
        }}></Button>
      <Text>P3</Text>
    </View>
  );
};
