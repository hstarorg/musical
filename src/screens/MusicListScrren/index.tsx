import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  View,
  useColorScheme,
  StatusBar,
  FlatList,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AntIcon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import { ScreenPropsBase } from '../../types';
import { fsExtra, nativeUtil } from '../../utils';
import { soundManager } from '../../services';

export default (props: ScreenPropsBase) => {
  const { navigation } = props;
  const isDarkMode = useColorScheme() === 'dark';
  const [musicList, setMusicList] = useState<RNFS.ReadDirItem[]>([]);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const scanMusicList = useCallback(async () => {
    const granted = await nativeUtil.requestPermissionAndroid(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    if (granted) {
      fsExtra
        .filterFiles(
          RNFS.ExternalStorageDirectoryPath,
          (item: RNFS.ReadDirItem) => {
            return item.path.endsWith('.mp3');
          },
          true,
        )
        .then(files => {
          console.log(files, 'files');
          setMusicList(files);
          Alert.alert('扫描完毕');
        })
        .catch(() => {
          Alert.alert('异常了！');
        });
    } else {
      Alert.alert('您未授权');
    }
  }, []);

  const handleMusicPress = useCallback((musicInfo: RNFS.ReadDirItem) => {
    soundManager
      .loadAsync(musicInfo.path)
      .then(() => {
        soundManager.play();
      })
      .catch(err => {
        Alert.alert('err' + err.message);
        console.error(err);
      });
  }, []);

  useLayoutEffect(() => {
    (navigation as any).setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingRight: 16 }}
            onPress={scanMusicList}>
            <Text style={{ color: 'blue' }}>扫描本地音乐</Text>
            {/* <AntIcon name="lock" size={16} /> */}
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  return (
    <View style={{ backgroundColor: '#212121' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
       
      </ScrollView> */}
      {musicList.length === 0 ? (
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: 220,
            height: '100%',
          }}>
          <AntIcon.Button name="plus">还没有本地音乐，立即添加</AntIcon.Button>
        </View>
      ) : (
        <FlatList
          data={musicList}
          style={{ paddingLeft: 16, paddingRight: 16 }}
          renderItem={info => {
            const musicInfo = info.item;
            return (
              <TouchableOpacity onPress={() => handleMusicPress(musicInfo)}>
                <View
                  key={Math.random().toString()}
                  style={{
                    flexDirection: 'row',
                    height: 80,
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1,
                    paddingTop: 20,
                  }}>
                  <View>
                    <Image
                      source={{
                        uri: 'https://avatars.githubusercontent.com/u/4043284?s=120&v=4',
                      }}
                      style={{ width: 40, height: 40 }}
                    />
                  </View>
                  <View style={{ paddingLeft: 12 }}>
                    <Text
                      style={{ fontSize: 16, lineHeight: 20, color: '#eee' }}>
                      {musicInfo.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 20,
                        color: '#e4e4e4',
                      }}>
                      {musicInfo.path}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}></FlatList>
      )}
    </View>
  );
};
