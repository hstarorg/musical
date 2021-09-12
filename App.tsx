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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import HomePage from './src/screens/HomePage';
import Page2 from './src/screens/Page2';

const bottomTabNavigator = createBottomTabNavigator();

enableScreens();

const App = () => {
  return (
    <NavigationContainer>
      <bottomTabNavigator.Navigator initialRouteName="Home">
        <bottomTabNavigator.Screen name="Home" component={HomePage} />
        <bottomTabNavigator.Screen name="Page1" component={Page2} />
      </bottomTabNavigator.Navigator>
    </NavigationContainer>
  );
};

export default App;
