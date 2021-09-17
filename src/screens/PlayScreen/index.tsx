import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Bar as ProgressBar } from 'react-native-progress';
import { WebView } from 'react-native-webview';
import { MusicInfo, ScreenPropsBase } from '../../types';
import styles from './styles';
import { musicUtil } from '../../utils';
import { htmlContent } from './htmlContent';
import { audioManager, musicService } from '../../services';
import { AVPlaybackStatus } from 'expo-av';

const PlaySortMap = {
  random: 'shuffle-variant',
  asc: 'arrow-right',
};

export default (props: ScreenPropsBase) => {
  const { navigation } = props;
  const [audioStatus, setAudioStatus] = useState<
    AVPlaybackStatus & { isLoaded: true }
  >();
  const [playSortType, setPlaySortType] =
    useState<keyof typeof PlaySortMap>('asc');
  const [currentMusic, setCurrentMusic] = useState<MusicInfo>();

  function updateStatus() {
    // 设置总时长
    audioManager.getAudioStatus()?.then(value => {
      setAudioStatus(value);
    });
  }

  function loadMusic(autoPlaying: boolean = false) {
    musicService.getCurrentMusic().then((musicInfo: MusicInfo) => {
      setCurrentMusic(musicInfo);
      // 加载音乐
      audioManager
        .loadAsync(musicInfo.path)
        .then(() => {
          if (autoPlaying) {
            return audioManager.playAsync();
          }
        })
        .then(() => {
          updateStatus();
        });
    });
  }

  useEffect(() => {
    loadMusic();
    return () => {
      audioManager.stopAsync();
    };
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      musicService.getCurrentMusic().then((musicInfo: MusicInfo) => {
        setCurrentMusic(musicInfo);
      });
      updateStatus();
    });
    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  useEffect(() => {
    let timer = setInterval(() => {
      updateStatus();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const doPlay = useCallback(() => {
    if (audioStatus?.isPlaying) {
      audioManager.pauseAsync();
    } else {
      audioManager.playAsync();
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

  const togglePlaySortType = useCallback(() => {
    const nextPlaySortType = musicUtil.findNextKey(
      Object.keys(PlaySortMap),
      playSortType,
    );
    setPlaySortType(nextPlaySortType as any);
  }, [playSortType]);

  // 进度条
  let progress = 0;
  if (audioStatus) {
    progress = audioStatus.isLoaded
      ? audioStatus.positionMillis / (audioStatus.durationMillis || 1)
      : 0;
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
          }}>
          Playing
        </Text>
      </View>
      <View style={styles.graphArea}>
        <WebView
          // style={{ backgroundColor: 'red' }}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}
        />
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
          <ProgressBar
            progress={progress}
            width={null}
            height={6}
            color="#fff"
            style={{ flex: 1, marginTop: 6, marginBottom: 6 }}
          />
          <View style={{ width: 50 }}>
            <Text style={{ color: '#fff', textAlign: 'right' }}>
              {musicUtil.duration2TimeStr(audioStatus?.durationMillis)}
            </Text>
          </View>
        </View>
        <View style={styles.controlBtnArea}>
          <MaterialCommunityIcon.Button
            name={PlaySortMap[playSortType]}
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
          <EntypoIcon.Button
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
          <EntypoIcon.Button
            onPress={doPlay}
            name={
              audioStatus?.isPlaying ? 'controller-paus' : 'controller-play'
            }
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#fff',
              paddingLeft: 20,
            }}
            color="#000"
            backgroundColor="transparent"
            underlayColor="transparent"
            size={40}
          />
          <EntypoIcon.Button
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
          <MaterialCommunityIcon.Button
            name="playlist-music"
            onPress={() => {
              navigation.navigate('MusicListScrren');
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
};
