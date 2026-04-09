import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MusicInfo } from '@/types/music-types';
import { musicUtil } from '@/utils';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  music: MusicInfo;
  onPress?: (music: MusicInfo) => void;
};

export function MusicItem({ music, onPress }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <TouchableOpacity onPress={() => onPress?.(music)} activeOpacity={0.6}>
      <View style={[styles.container, { borderBottomColor: theme.border }]}>
        <Image
          source={
            music.artwork
              ? { uri: music.artwork }
              : require('@/assets/images/icon.png')
          }
          style={styles.cover}
        />
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
});
