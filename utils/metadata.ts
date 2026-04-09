import { parseBuffer, type IPicture } from 'music-metadata';
import { File } from 'expo-file-system';
import { Buffer } from 'buffer';
import type { MusicInfo } from '@/types/music-types';

/**
 * 从文件路径中清洗出干净的歌曲名（仅作 fallback）
 */
function cleanFileName(raw: string): string {
  let name = raw.split('/').pop() || raw;
  name = name.replace(/\.(mp3|m4a|wav|flac|aac|ogg|wma)$/i, '');
  try {
    name = decodeURIComponent(name);
  } catch {}
  return name.trim() || raw;
}

/**
 * 将封面图片转为 data URI
 */
function pictureToDataUri(pic: IPicture): string {
  const base64 = Buffer.from(pic.data).toString('base64');
  const mime = pic.format || 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

/**
 * 从音频文件中提取完整的 MusicInfo（ID3 标签 + 时长 + 封面）
 */
export async function extractMusicInfo(
  fileName: string,
  uri: string
): Promise<Omit<MusicInfo, 'id'>> {
  const fallbackName = cleanFileName(fileName);

  let name = fallbackName;
  let artist: string | undefined;
  let album: string | undefined;
  let artwork: string | undefined;
  let track: number | undefined;
  let year: number | undefined;
  let duration: number | undefined;

  try {
    const file = new File(uri);
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const ext = uri.split('.').pop()?.toLowerCase() || 'mp3';
    const mimeMap: Record<string, string> = {
      mp3: 'audio/mpeg', m4a: 'audio/mp4', flac: 'audio/flac',
      ogg: 'audio/ogg', wav: 'audio/wav', aac: 'audio/aac', wma: 'audio/x-ms-wma',
    };
    const metadata = await parseBuffer(uint8Array, mimeMap[ext] || 'audio/mpeg');

    const common = metadata.common;
    const format = metadata.format;

    if (common.title) name = common.title;
    if (common.artist) artist = common.artist;
    if (common.album) album = common.album;
    if (common.year) year = common.year;
    if (common.track?.no) track = common.track.no;
    if (format.duration) duration = Math.round(format.duration * 1000);

    if (common.picture && common.picture.length > 0) {
      artwork = pictureToDataUri(common.picture[0]);
    }
  } catch (err) {
    console.warn('[metadata] Failed to parse:', err);
  }

  return { name, path: uri, artist, album, artwork, track, year, duration };
}
