import React from 'react';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NavigationItem } from './shared';

import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MusicListScrren from './screens/MusicListScrren';
import PlayScreen from './screens/PlayScreen';
import MineScreen from './screens/MineScreen';

export const navigationConfig: NavigationItem = {
  name: 'Root',
  type: 'bottom-tabs',
  routes: [
    {
      name: 'PlayScreen',
      component: PlayScreen,
      options: {
        // tabBarBadge: '66',
        tabBarLabel: '播放',
        tabBarIcon: ({ size, color }) => (
          <FontAwesome5Icon name="play-circle" size={size} color={color} />
        ),
      } as BottomTabNavigationOptions,
    },
    {
      name: 'MusicListScrren',
      component: MusicListScrren,
      options: {
        tabBarLabel: '列表',
        tabBarIcon: ({ size, color }) => (
          <FontAwesome5Icon name="music" size={size} color={color} />
        ),
      },
    },
    {
      name: 'Mine_Root',
      type: 'native-stack',
      routes: [
        {
          name: 'MineScreen',
          component: MineScreen,
          options: {
            header: () => null,
          } as NativeStackNavigationOptions,
        },
      ],
      options: {
        title: '我的',
        headerShown: false, // 不显示头部
        lazy: true, // 懒加载场景
        animationEnabled: true, // 切换时动画
        tabBarIcon: ({ size, color }) => (
          <FontAwesome5Icon name="user-alt" size={size} color={color} />
        ),
      } as BottomTabNavigationOptions,
    },
  ],
};
