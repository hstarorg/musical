import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MusicInfo } from '@/types/music-types';
import { musicUtil } from '@/utils';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

type Props = {
  music: MusicInfo;
  onPress?: (music: MusicInfo) => void;
  onDelete?: (music: MusicInfo) => void;
};

function DeleteAction({ drag, onPress }: { drag: SharedValue<number>; onPress: () => void }) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, -drag.value / 60),
  }));

  return (
    <Reanimated.View style={[styles.deleteAction, animatedStyle]}>
      <TouchableOpacity style={styles.deleteBtn} onPress={onPress}>
        <Text style={styles.deleteText}>删除</Text>
      </TouchableOpacity>
    </Reanimated.View>
  );
}

export function MusicItem({ music, onPress, onDelete }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  const content = (
    <TouchableOpacity onPress={() => onPress?.(music)} activeOpacity={0.6}>
      <View style={[styles.container, { borderBottomColor: theme.border }]}>
        <Image source={{ uri: music.artwork }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {music.name}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: theme.textSecondary }]} numberOfLines={1}>
              {music.artist || '未知艺术家'}
              {music.album ? ` · ${music.album}` : ''}
            </Text>
          </View>
          <View style={styles.tags}>
            {music.duration ? (
              <Text style={[styles.tag, { color: theme.textSecondary, borderColor: theme.border }]}>
                {musicUtil.duration2TimeStr(music.duration)}
              </Text>
            ) : null}
            {music.year ? (
              <Text style={[styles.tag, { color: theme.textSecondary, borderColor: theme.border }]}>{music.year}</Text>
            ) : null}
            {music.track ? (
              <Text style={[styles.tag, { color: theme.textSecondary, borderColor: theme.border }]}>
                #{music.track}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!onDelete) return content;

  return (
    <ReanimatedSwipeable
      renderRightActions={(_progress, drag) => <DeleteAction drag={drag} onPress={() => onDelete(music)} />}
      overshootRight={false}
    >
      {content}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
  meta: {
    flexDirection: 'row',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 6,
  },
  tag: {
    fontSize: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 80,
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '80%',
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
