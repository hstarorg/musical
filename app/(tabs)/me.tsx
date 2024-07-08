import { getFiles } from '@/utils';
import { useCallback } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MeScreen() {
  const test = useCallback(() => {
    // console.log('documentDirectory', documentDirectory);
    getFiles(
      '/',
      (item) => {
        return true; // item.endsWith('.mp3');
      },
      false
    ).then((files) => {
      console.log(files);
    });
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Button onPress={test} title="点我扫描" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
