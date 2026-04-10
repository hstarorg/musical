import React, { useEffect, useState } from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
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
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    libraryVm.loadMusicList();
  }, []);

  const handleScan = async () => {
    setScanning(true);
    const count = await libraryVm.scanMusic();
    setScanning(false);
    if (count === 0) {
      // 没找到新歌，不弹提示
    }
  };

  const isMusicListEmpty = (libraryData.musicList?.length ?? 0) === 0;

  // ==================== 空状态 ====================
  if (isMusicListEmpty) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View style={styles.emptyContainer}>
          {/* 大图标 */}
          <MaterialCommunityIcons
            name="music-note"
            size={64}
            color={theme.tint}
            style={{ marginBottom: 16 }}
          />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            还没有音乐
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            添加几首开始播放吧
          </Text>

          {/* 卡片 */}
          <View style={styles.cardGroup}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.background }]}
              activeOpacity={0.7}
              onPress={libraryVm.selectMusicFiles}
            >
              <View style={[styles.cardIcon, { backgroundColor: theme.tint + '18' }]}>
                <Feather name="folder" size={20} color={theme.tint} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  选择文件
                </Text>
                <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                  从设备中选择音乐文件
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, { backgroundColor: theme.background }]}
              activeOpacity={0.7}
              onPress={handleScan}
              disabled={scanning}
            >
              <View style={[styles.cardIcon, { backgroundColor: theme.tint + '18' }]}>
                <Feather name="search" size={20} color={theme.tint} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>
                  {scanning ? '扫描中...' : '扫描设备'}
                </Text>
                <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                  自动发现设备中的音乐
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ==================== 有内容 ====================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* 顶部操作栏 */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.addPill, { backgroundColor: theme.background }]}
          activeOpacity={0.7}
          onPress={libraryVm.selectMusicFiles}
        >
          <Feather name="plus" size={18} color={theme.tint} />
          <Text style={[styles.addPillText, { color: theme.textSecondary }]}>
            添加音乐
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.scanBtn, { backgroundColor: theme.background }]}
          activeOpacity={0.7}
          onPress={handleScan}
          disabled={scanning}
        >
          <Feather
            name="search"
            size={18}
            color={scanning ? theme.textSecondary : theme.tint}
          />
        </TouchableOpacity>
      </View>

      {/* 歌曲数量 */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: theme.textSecondary }]}>
          {libraryData.musicList.length} 首歌曲
        </Text>
      </View>

      {/* 列表 */}
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
              onPress={() => libraryVm.deleteMusic(item)}
            >
              <Text style={styles.deleteText}>删除</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
        disableRightSwipe
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ===== 空状态 =====
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    marginBottom: 32,
  },
  cardGroup: {
    width: '100%',
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  cardDesc: {
    fontSize: 12,
    marginTop: 2,
  },

  // ===== 有内容顶部 =====
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  addPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  addPillText: {
    fontSize: 14,
  },
  scanBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countRow: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  countText: {
    fontSize: 12,
  },

  // ===== 删除 =====
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
