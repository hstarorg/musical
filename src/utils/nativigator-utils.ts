import {
  NavigationState,
  PartialState,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {useEffect, useRef} from 'react';
import {BackHandler, Platform} from 'react-native';

/**
 * Gets the current screen from any navigation state.
 * @param {NavigationState | PartialState<NavigationState>} state - The navigation state to traverse.
 * @returns {string} - The name of the current screen.
 */
export function getActiveRouteName(
  state: NavigationState | PartialState<NavigationState>,
): string {
  const route = state.routes[state.index ?? 0];

  // Found the active route -- return the name
  if (!route.state) {
    return route.name;
  }

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state);
}

/**
 * Reference to the root App Navigator.
 *
 * If needed, you can use this to access the navigation object outside of a
 * `NavigationContainer` context. However, it's recommended to use the `useNavigation` hook whenever possible.
 * @see [Navigating Without Navigation Prop]{@link https://reactnavigation.org/docs/navigating-without-navigation-prop/}
 *
 * The types on this reference will only let you reference top level navigators. If you have
 * nested navigators, you'll need to use the `useNavigation` with the stack navigator's ParamList type.
 */
export const navigationRef = createNavigationContainerRef();

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 * @see [BackHandler]{@link https://reactnative.dev/docs/backhandler}
 * @param {(routeName: string) => boolean} canExit - Function that returns whether we can exit the app.
 * @returns {void}
 */
export function useBackButtonHandler(canExit: (routeName: string) => boolean) {
  // ignore unless android... no back button!
  const isNotAndroid = Platform.OS !== 'android';

  // The reason we're using a ref here is because we need to be able
  // to update the canExit function without re-setting up all the listeners
  const canExitRef = useRef(canExit);

  useEffect(() => {
    if (isNotAndroid) {
      return;
    }
    canExitRef.current = canExit;
  }, [canExit, isNotAndroid]);

  useEffect(() => {
    if (isNotAndroid) {
      return;
    }
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return false;
      }

      // grab the current route
      const routeName = getActiveRouteName(navigationRef.getRootState());

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // exit and let the system know we've handled the event
        BackHandler.exitApp();
        return true;
      }

      // we can't exit, so let's turn this into a back action
      if (navigationRef.canGoBack()) {
        navigationRef.goBack();
        return true;
      }

      return false;
    };

    // Subscribe when we come to life
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Unsubscribe when we're done
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [isNotAndroid]);
}
