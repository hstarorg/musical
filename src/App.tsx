import React from 'react';
import {SafeAreaView, useColorScheme, View, ViewStyle} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {useFonts} from 'expo-font';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {ErrorBoundary} from './components/ErrorBoundary';
import {AppNavigator} from './AppNavigator';
// import {customFontsToLoad} from './theme';

export function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // const [areFontsLoaded] = useFonts(customFontsToLoad);

  // if (!areFontsLoaded) {
  //   return <View />;
  // }

  return (
    <SafeAreaView style={backgroundStyle}>
      <ErrorBoundary catchErrors="always">
        <GestureHandlerRootView style={$container}>
          <AppNavigator />
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const $container: ViewStyle = {
  flex: 1,
};
