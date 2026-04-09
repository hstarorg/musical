import React, { useEffect } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AntIcon from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';

import { libraryVm } from '@/app-vms/libraryVm';
import { playerVm } from '@/app-vms/playerVm';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MusicItem, MUSIC_ITEM_HEIGHT } from '@/components/MusicItem';

export default function MusicScreen() {
  const libraryData = libraryVm.$useSnapshot();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  useEffect(() => {
    libraryVm.loadMusicList();
  }, []);

  const isMusicListEmpty = (libraryData.musicList?.length ?? 0) === 0;

  const handleDelete = (music: typeof libraryData.musicList[number]) => {
    libraryVm.deleteMusic(music);
  };

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
          <SwipeListView
            data={[...libraryData.musicList]}
            keyExtractor={(item) => String(item.id)}
            style={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: theme.surface }}>
                <MusicItem
                  music={item}
                  onPress={(m) => playerVm.selectMusic(m)}
                />
              </View>
            )}
            renderHiddenItem={({ item }) => (
              <View style={[styles.hiddenRow, { height: MUSIC_ITEM_HEIGHT }]}>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={styles.deleteText}>删除</Text>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-75}
            disableRightSwipe
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
  hiddenRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '85%',
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
