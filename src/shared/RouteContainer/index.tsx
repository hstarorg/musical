import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/core';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';

const bottomTabNavigator = createBottomTabNavigator();
const nativeStackNavigator = createNativeStackNavigator();
const stackNavigator = createStackNavigator();

type RouteItem = {
  name: string;
  component: React.ComponentType<any>;
  type?: never;
  routes?: never;
  options?:
    | BottomTabNavigationOptions
    | NativeStackNavigationOptions
    | StackNavigationOptions;
};

export type NavigationItem = {
  name: string;
  type: 'native-stack' | 'bottom-tabs' | 'stack';
  routes: (RouteItem | NavigationItem)[];
  component?: never;
  options?:
    | BottomTabNavigationOptions
    | NativeStackNavigationOptions
    | StackNavigationOptions;
};

export type RouteContainerProps = {
  navigationConfig: NavigationItem;
};

export type RouteContentProps = {
  type: 'native-stack' | 'bottom-tabs' | 'stack';
  routes: (RouteItem | NavigationItem)[];
};

function buildScreensByRoutes(
  ScreenComp: (
    _: RouteConfig<any, any, NavigationState, {}, EventMapBase>,
  ) => null,
  routes: (RouteItem | NavigationItem)[],
) {
  return routes.map(config => {
    let comp = config.component;
    if (!comp) {
      comp = () => <RouteContent type={config.type!} routes={config.routes!} />;
    }
    return (
      <ScreenComp
        key={config.name}
        name={config.name}
        component={comp}
        options={config.options}
      />
    );
  });
}

const RouteContent = (props: RouteContentProps) => {
  const { type, routes } = props;
  if (type === 'bottom-tabs') {
    return (
      <bottomTabNavigator.Navigator>
        {buildScreensByRoutes(bottomTabNavigator.Screen, routes)}
      </bottomTabNavigator.Navigator>
    );
  }
  if (type === 'native-stack') {
    return (
      <nativeStackNavigator.Navigator>
        {buildScreensByRoutes(nativeStackNavigator.Screen, routes)}
      </nativeStackNavigator.Navigator>
    );
  }
  if (type === 'stack') {
    return (
      <stackNavigator.Navigator>
        {buildScreensByRoutes(stackNavigator.Screen, routes)}
      </stackNavigator.Navigator>
    );
  }
  return null;
};

export const RouteContainer = (props: RouteContainerProps) => {
  const { navigationConfig } = props;
  return (
    <RouteContent
      type={navigationConfig.type}
      routes={navigationConfig.routes}
    />
  );
};
