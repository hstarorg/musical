import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { MusicInfo } from '@/types/music-types';
import { DbService } from './db.service';
import { requestPermissionAndroid, getFiles } from '@/utils';

const ConfigKeys = {
  CurrentMusicKey: 'CurrentMusic',
};

class MusicService {
  private db: DbService;
  constructor() {
    this.db = new DbService('musical.db');
    this.tryInit().then((result) => {
      console.log('init done', result);
    });
  }

  /**
   * 查询音乐列表
   */
  queryMusicList(): Promise<MusicInfo[]> {
    return this.db.find('SELECT * FROM music;');
  }

  private async tryInit() {
    const createSysConfigSql = `
    CREATE TABLE IF NOT EXISTS [sys_config] (
      [id] integer COLLATE BINARY NOT NULL PRIMARY KEY AUTOINCREMENT,
      [key] varchar(50) COLLATE BINARY UNIQUE NOT NULL,
      [value] varchar(200) COLLATE BINARY NOT NULL
    );
    `;
    const createMusicSql = `
    CREATE TABLE IF NOT EXISTS [music] (
      [id] integer COLLATE BINARY NOT NULL PRIMARY KEY AUTOINCREMENT,
      [name] varchar(200) COLLATE BINARY NOT NULL,
      [path] varchar(2000) COLLATE BINARY NOT NULL
    );
    `;
    const createUniqueIndexSql = `
    CREATE UNIQUE INDEX IF NOT EXISTS idx_music_path ON music(path);
    `;
    await this.db.execute(createSysConfigSql);
    await this.db.execute(createMusicSql);
    await this.db.execute(createUniqueIndexSql);
    // 增量迁移：为已有表添加元数据列
    await this.tryAddColumn('music', 'duration', 'integer');
    await this.tryAddColumn('music', 'artist', 'varchar(200)');
    await this.tryAddColumn('music', 'album', 'varchar(200)');

    // 收藏表
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS [favorites] (
        [id] integer PRIMARY KEY AUTOINCREMENT,
        [music_id] integer NOT NULL UNIQUE,
        [created_at] integer NOT NULL DEFAULT (strftime('%s','now')),
        FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE
      );
    `);

    // 播放历史表
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS [play_history] (
        [id] integer PRIMARY KEY AUTOINCREMENT,
        [music_id] integer NOT NULL,
        [played_at] integer NOT NULL DEFAULT (strftime('%s','now')),
        FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE
      );
    `);

    // 播放队列表
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS [play_queue] (
        [id] integer PRIMARY KEY AUTOINCREMENT,
        [music_id] integer NOT NULL,
        [position] integer NOT NULL,
        FOREIGN KEY (music_id) REFERENCES music(id) ON DELETE CASCADE
      );
    `);
  }

  private async tryAddColumn(table: string, column: string, type: string) {
    try {
      await this.db.execute(`ALTER TABLE [${table}] ADD COLUMN [${column}] ${type};`);
    } catch {
      // 列已存在时 ALTER TABLE 会报错，忽略即可
    }
  }

  async updateCurrentMusic(
    musicInfo: MusicInfo,
    type: 'next' | 'prev',
    sortType: string
  ) {
    // 单曲循环：保持当前歌曲不变
    if (sortType === 'singleLoop') {
      return;
    }

    // 随机模式
    if (sortType === 'random') {
      const row = await this.db.findOne<{ id: number }>(
        'SELECT id FROM music ORDER BY RANDOM() LIMIT 1'
      );
      if (row) {
        await this.setCurrentMusic(String(row.id));
      }
      return;
    }

    // 顺序/列表循环：查找前后曲目
    const sql = `
    SELECT (
      SELECT id FROM music WHERE id < ? ORDER BY id DESC LIMIT 1
    ) AS prevVal, (
      SELECT id FROM music WHERE id > ? LIMIT 1
    ) AS nextVal, (
      SELECT id FROM music LIMIT 1
    ) AS firstVal, (
      SELECT id FROM music ORDER BY id DESC LIMIT 1
    ) AS lastVal
    `;
    const result: {
      prevVal: number | null;
      nextVal: number | null;
      firstVal: number;
      lastVal: number;
    } = (await this.db.findOne(sql, [musicInfo.id!, musicInfo.id!]))!;

    let newMusicId: number;
    if (type === 'next') {
      // listLoop 到末尾回到第一首，asc 到末尾也回到第一首
      newMusicId = result.nextVal || result.firstVal;
    } else {
      newMusicId = result.prevVal || result.lastVal;
    }
    await this.setCurrentMusic(String(newMusicId));
  }

  /**
   * 获取当前音乐
   * @returns
   */
  async getCurrentMusic() {
    const sql = `
    SELECT t2.* FROM sys_config AS t1
    JOIN music AS t2 ON t1.value = t2.id
    WHERE t1.key = '${ConfigKeys.CurrentMusicKey}';
    `;
    const reslut = await this.db.findOne(sql);
    return reslut;
  }

  /**
   * 设置当前选中的音乐
   * @param musicId
   * @returns
   */
  async setCurrentMusic(musicId: string) {
    // 此 sql 为更新主键，不太使用，注意：第一个字段需要是unique
    const sql = `
    INSERT OR REPLACE INTO [sys_config]([key], value)
    VALUES('${ConfigKeys.CurrentMusicKey}', ?);
    `;

    // 此 sql 需要 CONFLICT 的字段是 unique
    // const sql = `
    // INSERT INTO sys_config([key], value)
    // VALUES('${ConfigKeys.CurrentMusicKey}', ?) ON CONFLICT([key]) DO UPDATE
    // SET value = excluded.value;
    // `;
    return await this.db.execute(sql, [musicId]);
  }

  /**
   * 查询已有的音乐路径集合
   */
  private async queryExistingPaths(): Promise<Set<string>> {
    const rows = await this.db.find<{ path: string }>(
      'SELECT path FROM music;'
    );
    return new Set(rows.map((r) => r.path));
  }

  /**
   * 扫描和存储音乐文件到 Sqlite（增量更新，不会清空已有数据）
   */
  async scanAndStoreLocalMusics() {
    if (Platform.OS === 'android') {
      const granted = await requestPermissionAndroid(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (!granted) {
        Alert.alert('您未允许授权');
        return;
      }
    }

    const files = await getFiles(
      '/',
      (item: string) => item.endsWith('.mp3'),
      true
    );

    // 增量对比：只插入 DB 中不存在的新文件
    const existingPaths = await this.queryExistingPaths();
    const newFiles = files.filter((file) => !existingPaths.has(file.uri));

    if (newFiles.length > 0) {
      await this.addMusicListBatch(
        newFiles.map((file) => ({ name: file.uri, path: file.uri }))
      );
    }

    Alert.alert('扫描完毕', `新增 ${newFiles.length} 首，共 ${files.length} 首`);
  }

  /**
   * 批量添加音乐（事务写入，遇到重复 path 自动跳过）
   */
  async addMusicListBatch(musicList: MusicInfo[]) {
    if (musicList.length === 0) return;
    await this.db.withTransaction(async () => {
      for (const music of musicList) {
        await this.insertMusic(music);
      }
    });
  }

  /**
   * 新增音乐（INSERT OR IGNORE 避免 path 重复时报错）
   */
  private insertMusic(musicInfo: MusicInfo) {
    const sql = `
    INSERT OR IGNORE INTO music(name, path, duration, artist, album) VALUES(?, ?, ?, ?, ?);
    `;
    return this.db.execute(sql, [
      musicInfo.name,
      musicInfo.path,
      musicInfo.duration ?? null,
      musicInfo.artist ?? null,
      musicInfo.album ?? null,
    ]);
  }

  // ==================== 收藏 ====================

  async toggleFavorite(musicId: number): Promise<boolean> {
    const existing = await this.db.findOne<{ id: number }>(
      'SELECT id FROM favorites WHERE music_id = ?;',
      [musicId]
    );
    if (existing) {
      await this.db.execute('DELETE FROM favorites WHERE music_id = ?;', [musicId]);
      return false;
    } else {
      await this.db.execute(
        'INSERT OR IGNORE INTO favorites(music_id) VALUES(?);',
        [musicId]
      );
      return true;
    }
  }

  async isFavorite(musicId: number): Promise<boolean> {
    const row = await this.db.findOne<{ id: number }>(
      'SELECT id FROM favorites WHERE music_id = ?;',
      [musicId]
    );
    return !!row;
  }

  async queryFavorites(): Promise<MusicInfo[]> {
    return this.db.find(
      `SELECT m.* FROM favorites f JOIN music m ON f.music_id = m.id ORDER BY f.created_at DESC;`
    );
  }

  // ==================== 播放历史 ====================

  async addPlayHistory(musicId: number) {
    await this.db.execute(
      'INSERT INTO play_history(music_id) VALUES(?);',
      [musicId]
    );
    // 只保留最近 200 条记录
    await this.db.execute(
      `DELETE FROM play_history WHERE id NOT IN (
        SELECT id FROM play_history ORDER BY played_at DESC LIMIT 200
      );`
    );
  }

  async queryPlayHistory(): Promise<(MusicInfo & { played_at: number })[]> {
    return this.db.find(
      `SELECT m.*, h.played_at FROM play_history h
       JOIN music m ON h.music_id = m.id
       ORDER BY h.played_at DESC LIMIT 50;`
    );
  }

  async clearPlayHistory() {
    await this.db.execute('DELETE FROM play_history;');
  }

  // ==================== 播放队列 ====================

  async getQueue(): Promise<MusicInfo[]> {
    return this.db.find(
      `SELECT m.* FROM play_queue q JOIN music m ON q.music_id = m.id ORDER BY q.position ASC;`
    );
  }

  async addToQueue(musicId: number) {
    const maxPos = await this.db.findOne<{ maxPos: number | null }>(
      'SELECT MAX(position) as maxPos FROM play_queue;'
    );
    const nextPos = (maxPos?.maxPos ?? -1) + 1;
    await this.db.execute(
      'INSERT INTO play_queue(music_id, position) VALUES(?, ?);',
      [musicId, nextPos]
    );
  }

  async removeFromQueue(musicId: number) {
    await this.db.execute(
      'DELETE FROM play_queue WHERE music_id = ?;',
      [musicId]
    );
  }

  async clearQueue() {
    await this.db.execute('DELETE FROM play_queue;');
  }

  async getNextFromQueue(): Promise<MusicInfo | null> {
    const item = await this.db.findOne<MusicInfo & { qid: number }>(
      `SELECT m.*, q.id as qid FROM play_queue q
       JOIN music m ON q.music_id = m.id
       ORDER BY q.position ASC LIMIT 1;`
    );
    if (item) {
      await this.db.execute('DELETE FROM play_queue WHERE id = ?;', [item.qid]);
      return { id: item.id, name: item.name, path: item.path, artist: item.artist, album: item.album, duration: item.duration };
    }
    return null;
  }
}

export const musicService = new MusicService();
