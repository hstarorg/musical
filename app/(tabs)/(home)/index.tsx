import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { playerVm } from '@/app-vms/playerVm';
import { AudioVisualizer } from '@/components/visualizer';
import { MusicPlaySortEnum } from '@/constants';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const PlaySortIcons: Record<MusicPlaySortEnum, string> = {
  [MusicPlaySortEnum.Random]: 'shuffle-variant',
  [MusicPlaySortEnum.SingleLoop]: 'repeat-once',
  [MusicPlaySortEnum.ListLoop]: 'repeat',
  [MusicPlaySortEnum.Asc]: 'arrow-right',
};

export default function PlayScreen() {
  const playerData = playerVm.$useSnapshot();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  useEffect(() => {
    playerVm.loadCurrentMusic();
  }, []);

  const { currentMusic, progressInfo } = playerData;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
      <View style={[styles.playScreen, { backgroundColor: theme.surface }]}>
        <View style={styles.graphArea}>
          <AudioVisualizer
            isPlaying={playerData.isPlaying}
            tintColor={theme.tint}
          />
        </View>
        <View style={styles.infoArea}>
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={[styles.mainTitle, { color: theme.text }]}>
              {currentMusic?.name}
            </Text>
          </View>
          <View style={{ overflow: 'hidden', height: 40 }}>
            <Text style={[styles.subTitle, { color: theme.textSecondary }]}>
              {currentMusic?.artist || currentMusic?.path}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.progressBarArea}>
            <View style={{ width: 50, height: 20 }}>
              <Text style={{ color: theme.text }}>
                {progressInfo.positionMillis}
              </Text>
            </View>
            <Slider
              style={{ flex: 1, height: 20, maxHeight: 20 }}
              value={progressInfo.progress}
              onSlidingComplete={playerVm.handleProcessChange}
              step={1}
              minimumValue={0}
              maximumValue={progressInfo.total}
              minimumTrackTintColor={theme.tint}
            />
            <View style={{ width: 50, height: 20 }}>
              <Text style={{ color: theme.text, textAlign: 'right' }}>
                {progressInfo.durationMillis}
              </Text>
            </View>
          </View>
          <View style={styles.controlBtnArea}>
            <MaterialCommunityIcons.Button
              name={
                (PlaySortIcons[playerData.musicPlaySort as MusicPlaySortEnum] ||
                  'shuffle-variant') as any
              }
              onPress={playerVm.togglePlaySortType}
              style={{ height: 80, padding: 0, paddingLeft: 10 }}
              backgroundColor="transparent"
              underlayColor="transparent"
              color={theme.tint}
              size={20}
            />
            <Entypo.Button
              onPress={playerVm.preMusic}
              name="controller-jump-to-start"
              style={{ width: 60, height: 80, backgroundColor: 'transparent' }}
              backgroundColor="transparent"
              underlayColor="transparent"
              color={theme.tint}
              size={40}
            />
            <Feather.Button
              name={playerData.isPlaying ? 'pause' : 'play'}
              onPress={playerVm.togglePlay}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.controlBg,
                paddingLeft: playerData.isPlaying ? 20 : 24,
              }}
              color={theme.controlText}
              backgroundColor="transparent"
              underlayColor="transparent"
              size={40}
            />
            <Entypo.Button
              onPress={playerVm.nextMusic}
              name="controller-next"
              style={{ width: 60, height: 80 }}
              backgroundColor="transparent"
              underlayColor="transparent"
              color={theme.tint}
              size={40}
            />
            <MaterialCommunityIcons.Button
              name={playerData.isFavorite ? 'heart' : 'heart-outline'}
              onPress={playerVm.toggleFavorite}
              style={{ height: 80, paddingLeft: 10, paddingRight: 0 }}
              backgroundColor="transparent"
              underlayColor="transparent"
              color={playerData.isFavorite ? '#e74c3c' : theme.tint}
              size={20}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  playScreen: {
    height: '100%',
  },
  graphArea: {
    height: '40%',
  },
  infoArea: {
    marginTop: 40,
    marginBottom: 40,
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 14,
  },
  progressBarArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  controlBtnArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
});
