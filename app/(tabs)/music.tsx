import React, { useCallback, useEffect } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Image,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AntIcon from '@expo/vector-icons/AntDesign';
import { globalVm } from '../globalVm';
import { SafeAreaView } from 'react-native-safe-area-context';

export default () => {
  const globalVmData = globalVm.$useSnapshot();

  useEffect(() => {
    globalVm.loadMusicList();
  }, []);

  const isMusicListEmpty = globalVmData.musicList.length === 0;

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#212121' }}>
      <StatusBar barStyle={false ? 'light-content' : 'dark-content'} />
      {/* <ScrollView contentInsetAdjustmentBehavior="automatic"> */}
      {isMusicListEmpty ? (
        <View style={styles.emptyArea}>
          <AntIcon.Button
            name="plus"
            style={{ width: 220 }}
            onPress={globalVm.selectMusicFiles}
          >
            Add Music
          </AntIcon.Button>
          <View style={{ height: 24 }} />
          <AntIcon.Button
            name="plus"
            style={{ width: 220 }}
            onPress={globalVm.scanMusic}
          >
            Scan Music
          </AntIcon.Button>
        </View>
      ) : (
        <>
          <View>
            <AntIcon.Button name="plus" onPress={globalVm.selectMusicFiles}>
              Add Music
            </AntIcon.Button>
          </View>
          <FlatList
            data={globalVmData.musicList}
            style={{ paddingLeft: 16, paddingRight: 16 }}
            renderItem={(info) => {
              const musicInfo = info.item;
              return (
                <TouchableOpacity
                  onPress={() => globalVm.selectMusic(musicInfo)}
                >
                  <View key={musicInfo.id!} style={styles.musicItem}>
                    <View>
                      <Image
                        source={{
                          uri: 'https://avatars.githubusercontent.com/u/4043284?s=120&v=4',
                        }}
                        style={{ width: 40, height: 40 }}
                      />
                    </View>
                    <View style={{ paddingLeft: 12, flex: 1 }}>
                      <Text
                        style={{ fontSize: 16, lineHeight: 20, color: '#eee' }}
                      >
                        {musicInfo.name}
                      </Text>
                      {/* <Text
                      style={{
                        fontSize: 12,
                        lineHeight: 20,
                        color: '#e4e4e4',
                      }}
                    >
                      {musicInfo.path}
                    </Text> */}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          ></FlatList>
        </>
      )}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  musicItem: {
    flexDirection: 'row',
    height: 80,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    paddingTop: 20,
  },
});
