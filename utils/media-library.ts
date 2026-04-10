import * as MediaLibrary from 'expo-media-library';
import type { MusicInfo } from '@/types/music-types';

/**
 * 从系统媒体库扫描音频文件
 * 使用系统索引，无需遍历文件系统，速度快且兼容 scoped storage
 */
export async function scanMediaLibrary(): Promise<Omit<MusicInfo, 'id'>[]> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    return [];
  }

  const results: Omit<MusicInfo, 'id'>[] = [];
  let hasMore = true;
  let after: string | undefined;

  while (hasMore) {
    const page = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 100,
      after,
      sortBy: [MediaLibrary.SortBy.creationTime],
    });

    for (const asset of page.assets) {
      results.push({
        name: asset.filename.replace(/\.(mp3|m4a|wav|flac|aac|ogg|wma)$/i, ''),
        path: asset.uri,
        duration: asset.duration ? Math.round(asset.duration * 1000) : undefined,
      });
    }

    hasMore = page.hasNextPage;
    after = page.endCursor;
  }

  return results;
}
