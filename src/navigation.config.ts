import { RouteConfig } from '@react-navigation/core';

import HomePage from './screens/HomePage';
import Page2 from './screens/Page2';
import Main from './index';
import { NavigationItem } from './shared';

export const navigationConfig: NavigationItem = {
  type: 'bottom-tabs',
  routes: [
    { name: 'Home', component: HomePage },
    { name: 'Page2', component: Page2 },
    { name: 'Main', component: Main },
  ],
};
