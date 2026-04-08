import { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { meVm } from '@/app-vms/meVm';
import { playerVm } from '@/app-vms/playerVm';
import { MusicInfo } from '@/types/music-types';

export default function MeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const meData = meVm.$useSnapshot();

  useEffect(() => {
    meVm.loadFavorites();
  }, []);

  const renderMusicItem = (music: MusicInfo) => (
    <TouchableOpacity onPress={() => playerVm.selectMusic(music)}>
      <View style={[styles.musicItem, { borderBottomColor: theme.border }]}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 36, height: 36, borderRadius: 4 }}
        />
        <View style={{ paddingLeft: 12, flex: 1 }}>
          <Text style={{ fontSize: 14, color: theme.text }} numberOfLines={1}>
            {music.name}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textSecondary }}>
            {music.artist || '未知艺术家'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View style={styles.avatorArea}>
          <Image
            style={styles.avator}
            source={require('@/assets/images/icon.png')}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userInfo_text, { color: theme.text }]}>
            Jay Hu
          </Text>
          <Text
            style={[styles.userInfo_bio_text, { color: theme.textSecondary }]}
          >
            Love life, love coding...
          </Text>
        </View>
      </View>

      {/* Tab 切换 */}
      <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            meData.activeTab === 'favorites' && {
              borderBottomColor: theme.tint,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => meVm.setActiveTab('favorites')}
        >
          <MaterialCommunityIcons name="heart" size={14} color={meData.activeTab === 'favorites' ? theme.tint : theme.textSecondary} />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  meData.activeTab === 'favorites'
                    ? theme.tint
                    : theme.textSecondary,
              },
            ]}
          >
            {' '}收藏
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            meData.activeTab === 'history' && {
              borderBottomColor: theme.tint,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => meVm.setActiveTab('history')}
        >
          <AntDesign name="clockcircleo" size={14} color={meData.activeTab === 'history' ? theme.tint : theme.textSecondary} />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  meData.activeTab === 'history'
                    ? theme.tint
                    : theme.textSecondary,
              },
            ]}
          >
            {' '}历史
          </Text>
        </TouchableOpacity>
      </View>

      {/* 列表内容 */}
      {meData.activeTab === 'favorites' ? (
        meData.favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: theme.textSecondary }}>暂无收藏</Text>
          </View>
        ) : (
          <FlatList
            data={meData.favorites}
            keyExtractor={(item) => String(item.id)}
            style={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => renderMusicItem(item)}
          />
        )
      ) : meData.history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: theme.textSecondary }}>暂无播放记录</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={meVm.clearHistory}
          >
            <Text style={{ color: '#e74c3c', fontSize: 13 }}>清空历史</Text>
          </TouchableOpacity>
          <FlatList
            data={meData.history}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            style={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => renderMusicItem(item)}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    height: 96,
    flexDirection: 'row',
  },
  avatorArea: {
    width: 64,
  },
  avator: {
    height: 64,
    width: 64,
    borderRadius: 32,
  },
  userInfo: {
    flex: 1,
    paddingLeft: 8,
    paddingTop: 8,
  },
  userInfo_text: {
    fontSize: 20,
  },
  userInfo_bio_text: {
    fontSize: 14,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderBottomWidth: 1,
  },
});
