import React, { useEffect } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AntIcon from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';

import { libraryVm } from '@/app-vms/libraryVm';
import { playerVm } from '@/app-vms/playerVm';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { musicUtil } from '@/utils';

export default function MusicScreen() {
  const libraryData = libraryVm.$useSnapshot();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  useEffect(() => {
    libraryVm.loadMusicList();
  }, []);

  const isMusicListEmpty = libraryData.musicList.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      {isMusicListEmpty ? (
        <View style={styles.emptyArea}>
          <AntIcon.Button
            name="plus"
            style={{ width: 220 }}
            onPress={libraryVm.selectMusicFiles}
          >
            Add Music
          </AntIcon.Button>
          <View style={{ height: 24 }} />
          <AntIcon.Button
            name="plus"
            style={{ width: 220 }}
            onPress={libraryVm.scanMusic}
          >
            Scan Music
          </AntIcon.Button>
        </View>
      ) : (
        <>
          <View>
            <AntIcon.Button name="plus" onPress={libraryVm.selectMusicFiles}>
              Add Music
            </AntIcon.Button>
          </View>
          <FlatList
            data={libraryData.musicList}
            style={{ paddingHorizontal: 16 }}
            renderItem={(info) => {
              const musicInfo = info.item;
              return (
                <TouchableOpacity
                  onPress={() => playerVm.selectMusic(musicInfo)}
                >
                  <View
                    key={musicInfo.id!}
                    style={[
                      styles.musicItem,
                      { borderBottomColor: theme.border },
                    ]}
                  >
                    <View>
                      <Image
                        source={require('@/assets/images/icon.png')}
                        style={{ width: 40, height: 40, borderRadius: 4 }}
                      />
                    </View>
                    <View style={{ paddingLeft: 12, flex: 1 }}>
                      <Text
                        style={{ fontSize: 16, lineHeight: 20, color: theme.text }}
                      >
                        {musicInfo.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 20,
                          color: theme.textSecondary,
                        }}
                      >
                        {musicInfo.artist || '未知艺术家'}
                        {musicInfo.duration
                          ? ` · ${musicUtil.duration2TimeStr(musicInfo.duration)}`
                          : ''}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  musicItem: {
    flexDirection: 'row',
    height: 80,
    borderBottomWidth: 1,
    paddingTop: 20,
  },
});
