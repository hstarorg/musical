import React, { useCallback } from 'react';
import { View, Text, Button } from 'react-native';
import { ScreenPropsBase } from '../../types';
import { Header } from 'react-native/Libraries/NewAppScreen';
import RNFS, { pathForBundle } from 'react-native-fs';
import { fsExtra } from '../../utils';

export default (props: ScreenPropsBase) => {
  // console.log(RNFS.);

  const root = '/storage/emulated/0/Android/data';
  // const root = RNFS.ExternalStorageDirectoryPath;

  const test = useCallback(() => {
    fsExtra
      .filterFiles(
        root,
        (a: RNFS.ReadDirItem) => {
          console.log(a.path);
          return a.path.endsWith('.apk');
        },
        true,
      )
      .then(files => {
        console.log(files);
      });
  }, []);

  return (
    <View>
      <Header />
      <Text>Mine Page</Text>
      <Button onPress={test} title="点我扫描" />
    </View>
  );
};
