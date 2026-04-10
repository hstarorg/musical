import { Tabs } from 'expo-router';
import React from 'react';
import Feather from '@expo/vector-icons/Feather';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: '播放',
          tabBarIcon: ({ color }) => (
            <Feather name="play-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="music/index"
        options={{
          title: '音乐',
          tabBarIcon: ({ color }) => (
            <Feather name="music" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="me/index"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
