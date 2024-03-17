import React, { useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { getFiles } from 'app/utils/fs-utils';
import { SafeAreaView } from 'react-native-safe-area-context';

export function MineScreen() {
  const root = '/storage/emulated/0/Android/data';
  // const root = RNFS.ExternalStorageDirectoryPath;

  const test = useCallback(() => {
    getFiles(
      root,
      (item) => {
        return item.path.endsWith('.apk');
      },
      true,
    ).then((files) => {
      console.log(files);
    });
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>Mine Page</Text>
        <Button onPress={test} title="点我扫描" />
      </View>
    </SafeAreaView>
  );
}
