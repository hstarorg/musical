import { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { meVm } from '@/app-vms/meVm';
import { playerVm } from '@/app-vms/playerVm';
import { MusicItem } from '@/components/MusicItem';

export default function MeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const meData = meVm.$useSnapshot();

  useEffect(() => {
    meVm.loadFavorites();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.surface }}>
      {/* 品牌卡片 */}
      <View style={[styles.brandCard, { backgroundColor: theme.tint + '12' }]}>
        <MaterialCommunityIcons
          name="music-circle"
          size={40}
          color={theme.tint}
        />
        <View style={styles.brandInfo}>
          <Text style={[styles.brandName, { color: theme.text }]}>Musical</Text>
          <Text style={[styles.brandSlogan, { color: theme.textSecondary }]}>
            你的私人音乐空间
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
          <MaterialCommunityIcons
            name="heart"
            size={14}
            color={meData.activeTab === 'favorites' ? theme.tint : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  meData.activeTab === 'favorites' ? theme.tint : theme.textSecondary,
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
          <MaterialCommunityIcons
            name="history"
            size={14}
            color={meData.activeTab === 'history' ? theme.tint : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  meData.activeTab === 'history' ? theme.tint : theme.textSecondary,
              },
            ]}
          >
            {' '}历史
          </Text>
        </TouchableOpacity>
      </View>

      {/* 列表内容 */}
      {meData.activeTab === 'favorites' ? (
        (meData.favorites?.length ?? 0) === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="heart-outline"
              size={40}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              暂无收藏
            </Text>
            <Text style={[styles.emptyHint, { color: theme.textSecondary }]}>
              播放时点击爱心即可收藏
            </Text>
          </View>
        ) : (
          <FlatList
            data={meData.favorites}
            keyExtractor={(item) => String(item.id)}
            style={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <MusicItem music={item} onPress={(m) => playerVm.selectMusic(m)} />
            )}
          />
        )
      ) : (meData.history?.length ?? 0) === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="history"
            size={40}
            color={theme.textSecondary}
          />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            暂无播放记录
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.clearBtn} onPress={meVm.clearHistory}>
            <Text style={{ color: '#e74c3c', fontSize: 13 }}>清空历史</Text>
          </TouchableOpacity>
          <FlatList
            data={meData.history}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            style={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <MusicItem music={item} onPress={(m) => playerVm.selectMusic(m)} />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
  },
  brandSlogan: {
    fontSize: 13,
    marginTop: 2,
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
    gap: 8,
  },
  emptyText: {
    fontSize: 15,
  },
  emptyHint: {
    fontSize: 12,
  },
  clearBtn: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
