import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import BackgroundTimer from 'react-native-background-timer';
import Slider from '@react-native-community/slider';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import { WebView } from 'react-native-webview';
// import { MusicInfo, ScreenPropsBase } from '../../types/biz-types';
// import styles from './styles';
// import { musicUtil } from '../../utils/musicUtil';
import { AudioManager } from '@/libs';
import { musicService } from '@/services';
import { AVPlaybackStatus } from 'expo-av';
import { MusicInfo } from '@/types/music-types';
import { musicUtil } from '@/utils';

const PlaySortMap = {
  random: 'shuffle-variant',
  asc: 'arrow-right',
};

let autoChanging = false;

export default function PlayScreen() {
  const audioManagerSignleton = AudioManager.instance;

  const [audioStatus, setAudioStatus] = useState<
    AVPlaybackStatus & { isLoaded: true }
  >();
  const [playSortType, setPlaySortType] =
    useState<keyof typeof PlaySortMap>('asc');
  const [currentMusic, setCurrentMusic] = useState<MusicInfo>();
  const [refreshCtrl, setRefreshCtrl] = useState({});

  function updateStatus() {
    // 设置总时长
    audioManagerSignleton.getAudioStatus()?.then((value) => {
      setAudioStatus(value);
      // 如果没有点击停止，且歌曲放完了，则需要挑选另外一首
      if (value?.shouldPlay && !value.isPlaying && !autoChanging) {
        autoChanging = true;
        // 自动切换下一首
        musicService
          .updateCurrentMusic(currentMusic!, 'next', playSortType)
          .then(() => {
            loadMusic(value?.shouldPlay);
          })
          .finally(() => {
            autoChanging = false;
          });
      }
    });
  }

  async function loadMusic(autoPlaying: boolean = false) {
    const musicInfo = (await musicService.getCurrentMusic()) as MusicInfo;
    if (musicInfo) {
      setCurrentMusic(musicInfo);
      // 加载音乐
      audioManagerSignleton
        .loadAsync(musicInfo.path)
        .then(() => {
          if (autoPlaying) {
            return audioManagerSignleton.playAsync();
          }
        })
        .then(() => {
          setRefreshCtrl({});
        });
    }
  }

  useEffect(() => {
    loadMusic();
    return () => {
      audioManagerSignleton.stopAsync();
    };
  }, []);

  // useEffect(() => {
  //   const unsubscribeFocus = navigation.addListener('focus', async () => {
  //     const musicInfo = await musicService.getCurrentMusic();
  //     if (musicInfo) {
  //       setCurrentMusic(musicInfo);
  //       setRefreshCtrl({});
  //     }
  //   });
  //   return () => {
  //     unsubscribeFocus();
  //   };
  // }, [navigation]);

  useEffect(() => {
    updateStatus();
  }, []);

  // useEffect(() => {
  //   let timer = BackgroundTimer.setInterval(() => {
  //     setRefreshCtrl({});
  //   }, 1000);
  //   return () => {
  //     BackgroundTimer.clearInterval(timer);
  //   };
  // }, []);

  const doPlay = useCallback(() => {
    if (audioStatus?.isPlaying) {
      audioManagerSignleton.pauseAsync();
    } else {
      audioManagerSignleton.playAsync();
    }
  }, [audioStatus]);

  const changePrevMusic = useCallback(() => {
    musicService
      .updateCurrentMusic(currentMusic!, 'prev', playSortType)
      .then(() => {
        loadMusic(audioStatus?.isPlaying);
      });
  }, [currentMusic, audioStatus, playSortType]);

  const changeNextMusic = useCallback(() => {
    musicService
      .updateCurrentMusic(currentMusic!, 'next', playSortType)
      .then(() => {
        loadMusic(audioStatus?.isPlaying);
      });
  }, [currentMusic, audioStatus, playSortType]);

  const handleProgressChange = useCallback((value: any) => {
    audioManagerSignleton.setPositionAsync(value);
  }, []);

  const togglePlaySortType = useCallback(() => {
    const nextPlaySortType = musicUtil.findNextKey(
      Object.keys(PlaySortMap),
      playSortType
    );
    setPlaySortType(nextPlaySortType as any);
  }, [playSortType]);

  // 进度条
  let progress = 0;
  let total = 0;
  if (audioStatus?.isLoaded) {
    progress = Math.floor(audioStatus.positionMillis / 1000);
    total = Math.floor((audioStatus.durationMillis || 0) / 1000);
  }

  return (
    <View style={styles.playScreen}>
      <View style={styles.headerArea}>
        <Text
          style={{
            textAlign: 'center',
            lineHeight: 40,
            fontSize: 20,
            color: '#ddd',
          }}
        >
          Playing
        </Text>
      </View>
      <View style={styles.graphArea}>
        {/* <WebView
          // style={{ backgroundColor: 'red' }}
          source={{ html: '<h1>Hi，研发中，请稍后</h1>' }}
          javaScriptEnabled={true}
        /> */}
      </View>
      <View style={styles.infoArea}>
        <View>
          <Text style={styles.mainTitle}>{currentMusic?.name}</Text>
        </View>
        <View>
          <Text style={styles.subTitle}>{currentMusic?.path}</Text>
        </View>
      </View>
      <View style={styles.controlArea}>
        <View style={styles.progressBarArea}>
          <View style={{ width: 50 }}>
            <Text style={{ color: '#fff' }}>
              {musicUtil.duration2TimeStr(audioStatus?.positionMillis)}
            </Text>
          </View>
          <Slider
            value={progress}
            minimumValue={0}
            maximumValue={total}
            step={1}
            onSlidingComplete={handleProgressChange}
            // 已选中部分背景色
            minimumTrackTintColor="#fff"
            // 总量背景色
            // maximumTrackTintColor="blue"
            // 小圆点颜色
            // thumbTintColor="#fff"
            style={{
              flex: 1,
              marginTop: 6,
              height: 7,
            }}
          />
          <View style={{ width: 50 }}>
            <Text style={{ color: '#fff', textAlign: 'right' }}>
              {musicUtil.duration2TimeStr(audioStatus?.durationMillis)}
            </Text>
          </View>
        </View>
        <View style={styles.controlBtnArea}>
          <MaterialCommunityIcons.Button
            name={PlaySortMap[playSortType] as any}
            onPress={togglePlaySortType}
            style={{
              height: 80,
              padding: 0,
              paddingLeft: 10,
            }}
            backgroundColor="transparent"
            underlayColor="transparent"
            color="#fff"
            size={20}
          />
          <Entypo.Button
            onPress={changePrevMusic}
            name="controller-jump-to-start"
            style={{
              width: 60,
              height: 80,
              backgroundColor: 'transparent',
            }}
            backgroundColor="transparent"
            underlayColor="transparent"
            color="#fff"
            size={40}
          />
          <Feather.Button
            name={audioStatus?.isPlaying ? 'pause' : 'play'}
            onPress={doPlay}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#fff',
              paddingLeft: 24,
            }}
            color="#000"
            backgroundColor="transparent"
            underlayColor="transparent"
            size={40}
          />
          <Entypo.Button
            onPress={changeNextMusic}
            name="controller-next"
            style={{
              width: 60,
              height: 80,
            }}
            backgroundColor="transparent"
            underlayColor="transparent"
            color="#fff"
            size={40}
          />
          <MaterialCommunityIcons.Button
            name="playlist-music"
            onPress={() => {
              // navigation.navigate('MusicListScrren');
            }}
            style={{
              height: 80,
              paddingLeft: 10,
              paddingRight: 0,
            }}
            backgroundColor="transparent"
            underlayColor="transparent"
            color="#fff"
            size={20}
          />
        </View>
      </View>
      {/* <Button
        title="点我试试"
        onPress={() => {
          navigation.navigate('Page2');
        }}></Button> */}
      {/* <Text>P3</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  playScreen: {
    // backgroundColor: 'linear-gradient(45deg, black, transparent)',
    backgroundColor: '#212121',
    height: '100%',
    color: '#eee',
  },
  headerArea: {
    height: 40,
  },
  graphArea: {
    height: '40%',
    // backgroundColor: 'red',
  },
  infoArea: {
    marginTop: 40,
    marginBottom: 40,
  },
  mainTitle: {
    color: '#eee',
    textAlign: 'center',
    fontSize: 16,
  },
  subTitle: {
    textAlign: 'center',
    color: '#A3A5B2',
    fontSize: 14,
  },
  controlArea: {
    // paddingLeft: 24,
    // paddingRight: 24,
  },
  progressBarArea: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 40,
    paddingLeft: 24,
    paddingRight: 24,
  },
  controlBtnArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor:'red',
    paddingLeft: 14,
    paddingRight: 14,
  },
});
