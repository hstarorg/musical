import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const bottomTabNavigator = createBottomTabNavigator();
const nativeStackNavigator = createNativeStackNavigator();

type RouteItem = {
  name: string;
  component: React.ComponentType<any>;
  type?: never;
  routes?: never;
};

export type NavigationItem = {
  name?: never;
  type: 'native-stack' | 'bottom-tabs' | 'stack';
  routes: (RouteItem | NavigationItem)[];
  component?: never;
};

export type RouteContainerProps = {
  navigationConfig: NavigationItem;
};

export type RouteContentProps = {
  type: 'native-stack' | 'bottom-tabs' | 'stack';
  routes: (RouteItem | NavigationItem)[];
};

const RouteContent = (props: RouteContentProps) => {
  const { type, routes } = props;
  if (type === 'bottom-tabs') {
    return (
      <bottomTabNavigator.Navigator>
        {routes.map(config => {
          if (config.name) {
            return (
              <bottomTabNavigator.Screen
                key={config.name}
                name={config.name}
                component={config.component}
              />
            );
          }
          return <RouteContent type={config.type} routes={config.routes} />;
        })}
      </bottomTabNavigator.Navigator>
    );
  }
  if (type === 'native-stack') {
    return (
      <nativeStackNavigator.Navigator>
        {routes.map(config => {
          if (config.component) {
            return (
              <nativeStackNavigator.Screen
                name={config.name}
                key={config.name}
                component={config.component}
              />
            );
          }
          return <RouteContent type={config.type} routes={config.routes} />;
        })}
      </nativeStackNavigator.Navigator>
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
