import React from 'react';
import { Text } from 'react-native';
import HomePage from './screens/HomePage';
import Page2 from './screens/Page2';
import WelcomeScreen from './screens/WelcomeScreen';
import { NavigationItem } from './shared';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

export const navigationConfig: NavigationItem = {
  name: 'Root',
  type: 'bottom-tabs',
  routes: [
    {
      name: 'Home',
      component: HomePage,
      options: { tabBarBadge: '66' } as BottomTabNavigationOptions,
    },
    { name: 'Page2', component: Page2 },
    {
      name: 'WelcomeScreen',
      component: WelcomeScreen,
      options: { tabBarLabel: '欢迎' },
    },
    {
      name: '哈哈',
      type: 'native-stack',
      routes: [
        {
          name: 'S1',
          component: () => {
            return <Text>S1</Text>;
          },
          options: { header: () => null } as NativeStackNavigationOptions,
        },
      ],
    },
  ],
};
