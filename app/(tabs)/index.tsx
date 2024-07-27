import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import BackgroundTimer from 'react-native-background-timer';
import Slider from '@react-native-community/slider';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { WebView } from 'react-native-webview';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import { globalVm } from '../globalVm';
import { MusicPlaySortEnum } from '@/constants';

// TaskManager.defineTask('updateAudioStatus', async () => {
//   console.log('task run');
//   globalVm.updateAudioStatus();
// });

export default function PlayScreen() {
  const globalVmData = globalVm.$useSnapshot();

  useEffect(() => {
    globalVm.loadCurrentMusic();
    // BackgroundFetch.registerTaskAsync('updateAudioStatus', {
    //   minimumInterval: 1,
    // });

    const unregister = globalVm.initPlaybackStatusUpdateNotification();

    // setInterval(() => {
    //   globalVm.updateAudioStatus();
    // }, 1000);

    return () => {
      unregister();
    };
  }, []);

  // useEffect(() => {
  //   let timer = BackgroundTimer.setInterval(() => {
  //     setRefreshCtrl({});
  //   }, 1000);
  //   return () => {
  //     BackgroundTimer.clearInterval(timer);
  //   };
  // }, []);

  const { currentMusic, progressInfo } = globalVmData;

  return (
    <SafeAreaView>
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
            Play
          </Text>
        </View>
        <View style={styles.graphArea}>
          <WebView
            // style={{ backgroundColor: 'red' }}
            source={{ html: '<h1>Coming soon...</h1>' }}
            javaScriptEnabled={true}
          />
        </View>
        <View style={styles.infoArea}>
          <View style={{ paddingLeft: 16, paddingRight: 16 }}>
            <Text style={styles.mainTitle}>{currentMusic?.name}</Text>
          </View>
          <View style={{ overflow: 'hidden', height: 40 }}>
            <Text style={styles.subTitle}>{currentMusic?.path}</Text>
          </View>
        </View>
        <View style={styles.controlArea}>
          <View style={styles.progressBarArea}>
            <View style={{ width: 50, height: 20 }}>
              <Text style={{ color: '#fff' }}>
                {progressInfo.positionMillis}
              </Text>
            </View>
            <Slider
              style={{ flex: 1, height: 20, maxHeight: 20 }}
              value={progressInfo.progress}
              onSlidingComplete={globalVm.handleProcessChange}
              step={1}
              minimumValue={0}
              maximumValue={progressInfo.total}
              minimumTrackTintColor="#fff"
            />
            <View style={{ width: 50, height: 20 }}>
              <Text style={{ color: '#fff', textAlign: 'right' }}>
                {progressInfo.durationMillis}
              </Text>
            </View>
          </View>
          <View style={styles.controlBtnArea}>
            <MaterialCommunityIcons.Button
              name={
                globalVmData.musicPlaySort === MusicPlaySortEnum.Random
                  ? 'shuffle-variant'
                  : 'arrow-right'
              }
              onPress={globalVm.togglePlaySortType}
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
              onPress={globalVm.preMusic}
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
              name={globalVmData.isPlaying ? 'pause' : 'play'}
              onPress={globalVm.togglePlay}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#fff',
                paddingLeft: globalVmData.isPlaying ? 20 : 24,
              }}
              color="#000"
              backgroundColor="transparent"
              underlayColor="transparent"
              size={40}
            />
            <Entypo.Button
              onPress={globalVm.nextMusic}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  playScreen: {
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
