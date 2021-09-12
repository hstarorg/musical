/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { RouteContainer } from './src/shared';
import { navigationConfig } from './src/navigation.config';
enableScreens();

const App = () => {
  return (
    <NavigationContainer>
      <RouteContainer navigationConfig={navigationConfig} />
    </NavigationContainer>
  );
};

export default App;
