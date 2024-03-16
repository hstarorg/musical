/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as Screens from '../screens';
import Config from '../config';
import { navigationRef, useBackButtonHandler } from './navigationUtilities';

// import FontAwesome5Icon from 'react-native-vector-icons';

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;
// Documentation: https://reactnavigation.org/docs/bottom-tab-navigator
const BottomTabs = createBottomTabNavigator();

export interface AppNavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export function AppNavigator(props: AppNavigationProps) {
  const colorScheme = useColorScheme();

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  return (
    <NavigationContainer ref={navigationRef} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme} {...props}>
      <BottomTabs.Navigator screenOptions={{ headerShown: false }} initialRouteName={'PlayScreen'}>
        <BottomTabs.Screen
          name="PlayScreen"
          component={Screens.PlayScreen}
          options={{
            tabBarLabel: '播放',
            headerShown: false,
            // tabBarIcon: ({ size, color }) => <FontAwesome5Icon name="play-circle" size={size} color={color} />,
          }}
        />
        <BottomTabs.Screen
          name="MusicListScreen"
          component={Screens.PlayScreen}
          options={{
            tabBarLabel: '音乐',
            title: '本地音乐',
            // tabBarIcon: ({ size, color }) => <FontAwesome5Icon name="play-circle" size={size} color={color} />,
          }}
        />
        <BottomTabs.Screen
          name="MineScreen"
          component={Screens.MineScreen}
          options={{
            tabBarLabel: '我的',
            headerShown: false,
            lazy: true, // 懒加载场景
            // tabBarIcon: ({ size, color }) => <FontAwesome5Icon name="play-circle" size={size} color={color} />,
          }}
        />
      </BottomTabs.Navigator>
    </NavigationContainer>
  );
}
