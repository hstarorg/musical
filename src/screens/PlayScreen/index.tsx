import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Bar as ProgressBar } from 'react-native-progress';
import Sound from 'react-native-sound';
import { WebView } from 'react-native-webview';
import { ScreenPropsBase } from '../../types';
import styles from './styles';
import { musicUtil } from '../../utils';

const m01 = require('../../assets/01.mp3');

export default (props: ScreenPropsBase) => {
  const { navigation } = props;
  const musicRef = useRef<any>();
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playStatus, setPlayStatus] = useState<'pause' | 'playing'>('pause');

  useEffect(() => {
    const s1 = (musicRef.current = new Sound(m01, err => {
      console.log(err);
      setTotalDuration(s1.getDuration());
    }));

    return () => {
      if (musicRef.current) {
        musicRef.current.stop(() => {
          musicRef.current?.release();
        });
      }
    };
  }, []);

  useEffect(() => {
    let timer = setInterval(() => {
      musicRef.current.getCurrentTime((seconds: number, isPlaying: boolean) => {
        setCurrentTime(seconds);
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [totalDuration]);

  const doPlay = useCallback(() => {
    if (playStatus === 'pause') {
      musicRef.current.play();
      setPlayStatus('playing');
    } else if (playStatus === 'playing') {
      musicRef.current.pause();
      setPlayStatus('pause');
    }
  }, [playStatus, musicRef]);

  // 进度条
  const progress = currentTime / totalDuration || 0;

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
          style={{ backgroundColor: 'red' }}
          source={{ uri: 'https://baidu.com' }}
        />
      </View>
      <View style={styles.infoArea}>
        <View>
          <Text style={styles.mainTitle}>这是歌曲主标题</Text>
        </View>
        <View>
          <Text style={styles.subTitle}>这是歌曲副标题</Text>
        </View>
      </View>
      <View style={styles.controlArea}>
        <View style={styles.progressBarArea}>
          <View style={{ width: 50 }}>
            <Text style={{ color: '#fff' }}>
              {musicUtil.duration2TimeStr(currentTime)}
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
              {musicUtil.duration2TimeStr(totalDuration)}
            </Text>
          </View>
        </View>
        <View style={styles.controlBtnArea}>
          <MaterialCommunityIcon.Button
            name="shuffle-variant"
            onPress={() => {
              // alert('aaa');
            }}
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
            onPress={() => {
              // alert('aaa');
            }}
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
              playStatus === 'pause' ? 'controller-play' : 'controller-paus'
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
            onPress={() => {
              // alert('aaa');
            }}
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
              // alert('aaa');
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
