import React, { useEffect } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AntIcon from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';

import { libraryVm } from '@/app-vms/libraryVm';
import { playerVm } from '@/app-vms/playerVm';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MusicItem } from '@/components/MusicItem';

export default function MusicScreen() {
  const libraryData = libraryVm.$useSnapshot();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  useEffect(() => {
    libraryVm.loadMusicList();
  }, []);

  const isMusicListEmpty = (libraryData.musicList?.length ?? 0) === 0;

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
            keyExtractor={(item) => String(item.id)}
            style={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <MusicItem
                music={item}
                onPress={(m) => playerVm.selectMusic(m)}
                onDelete={(m) =>
                  Alert.alert('确认删除', `删除「${m.name}」？`, [
                    { text: '取消', style: 'cancel' },
                    {
                      text: '删除',
                      style: 'destructive',
                      onPress: () => libraryVm.deleteMusic(m),
                    },
                  ])
                }
              />
            )}
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
});
