/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React from 'react';
import {useColorScheme} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import {MineScreen} from './screens/MineScreen';
import {PlayScreen} from './screens/PlayScreen';
import {config} from './config';
import {navigationRef, useBackButtonHandler} from './utils/nativigator-utils';

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = config.exitRoutes;
// Documentation: https://reactnavigation.org/docs/bottom-tab-navigator
const BottomTab = createBottomTabNavigator();

export interface AppNavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export function AppNavigator(props: AppNavigationProps) {
  const colorScheme = useColorScheme();

  console.log(props);

  useBackButtonHandler(routeName => exitRoutes.includes(routeName));

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BottomTab.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="PlayScreen">
        <BottomTab.Screen
          name="PlayScreen"
          component={PlayScreen}
          options={{
            tabBarLabel: '播放',
            headerShown: false,
            // tabBarBadge: 3,
            tabBarIcon: ({size, color}) => (
              <FontAwesome5Icon name="play-circle" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="MusicListScreen"
          component={PlayScreen}
          options={{
            tabBarLabel: '音乐',
            title: '本地音乐',
            tabBarIcon: ({size, color}) => (
              <FontAwesome5Icon name="play-circle" size={size} color={color} />
            ),
          }}
        />
        <BottomTab.Screen
          name="MineScreen"
          component={MineScreen}
          options={{
            tabBarLabel: '我的',
            headerShown: false,
            lazy: true, // 懒加载场景
            tabBarIcon: ({size, color}) => (
              <FontAwesome5Icon name="play-circle" size={size} color={color} />
            ),
          }}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}
