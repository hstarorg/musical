import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {useFonts} from 'expo-font';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {ErrorBoundary} from './components/ErrorBoundary';
import {AppNavigator} from './AppNavigator';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
// import {customFontsToLoad} from './theme';

export function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  // const [areFontsLoaded] = useFonts(customFontsToLoad);

  // if (!areFontsLoaded) {
  //   return <View />;
  // }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView style={styles.safeAreaView}>
        <ErrorBoundary catchErrors="always">
          <GestureHandlerRootView style={styles.gestureHandlerRootView}>
            <AppNavigator />
          </GestureHandlerRootView>
        </ErrorBoundary>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  gestureHandlerRootView: {
    flex: 1,
  },
});
