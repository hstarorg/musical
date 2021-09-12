import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  useColorScheme,
  StatusBar,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AntIcon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import { ScreenPropsBase } from '../../types';

export default (props: ScreenPropsBase) => {
  const { navigation } = props;
  const isDarkMode = useColorScheme() === 'dark';
  const [musicList, setMusicList] = useState<any>([]);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    setTimeout(() => {
      setMusicList([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]);
    }, 2000);
  }, []);

  useLayoutEffect(() => {
    (navigation as any).setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingRight: 16 }}
            onPress={() => {
              alert('研发中');
            }}>
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
            flex: 0.5,
            marginTop: '20%',
            flexShrink: 0,
            flexGrow: 0,
            width: 220,
          }}>
          <AntIcon.Button name="plus">还没有本地音乐，立即添加</AntIcon.Button>
        </View>
      ) : (
        <FlatList
          data={musicList}
          style={{ paddingLeft: 16, paddingRight: 16 }}
          renderItem={item => {
            return (
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
                  <Text style={{ fontSize: 16, lineHeight: 20, color: '#eee' }}>
                    歌曲名称
                  </Text>
                  <Text
                    style={{ fontSize: 12, lineHeight: 20, color: '#e4e4e4' }}>
                    歌曲作者
                  </Text>
                </View>
              </View>
            );
          }}></FlatList>
      )}
    </View>
  );
};
