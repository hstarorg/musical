import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { MusicInfo } from '@/types/music-types';
import { DbService } from './db.service';
import { requestPermissionAndroid, getFiles } from '@/utils';
import { documentDirectory } from 'expo-file-system';

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
    return await Promise.all([
      this.db.execute(createSysConfigSql),
      this.db.execute(createMusicSql),
    ]);
  }

  async updateCurrentMusic(
    musicInfo: MusicInfo,
    type: 'next' | 'prev',
    sortType: 'random' | 'asc'
  ) {
    const sql = `
    SELECT (
      SELECT id FROM music WHERE id < ? ORDER BY id DESC LIMIT 1
    ) AS prevVal, (
      SELECT id FROM music WHERE id > ? LIMIT 1
    ) AS nextVal, (
      SELECT id FROM music LIMIT 1
    ) AS firstVal, (
      SELECT id FROM music ORDER BY id DESC LIMIT 1
    ) AS lastVal, (
      SELECT id FROM music ORDER BY RANDOM() LIMIT 1
    ) AS randomVal
    `;
    const result: {
      prevVal: number;
      nextVal: number;
      firstVal: number;
      lastVal: number;
      randomVal: number;
    } = (await this.db.findOne(sql, [musicInfo.id!, musicInfo.id!]))!;
    // 设置下一首歌曲
    let newMusicId;
    // 随机时，自动选择一首
    if (sortType === 'random') {
      newMusicId = result.randomVal;
    } else {
      // 非随机时，则顺序选择
      newMusicId =
        type === 'next'
          ? result.nextVal || result.firstVal
          : result.prevVal || result.lastVal;
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
   * 扫描和存储音乐文件到 Sqlite
   * @returns
   */
  async scanAndStoreLocalMusics() {
    if (Platform.OS === 'android') {
      // 申请权限
      const granted = await requestPermissionAndroid(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (!granted) {
        Alert.alert('您未允许授权');
        return;
      }
    } else if (Platform.OS === 'ios') {
      // ios 无需申请权限
    }

    // 允许授权时，先筛选音乐文件，然后写入 DB
    const files = await getFiles(
      '/',
      (item: string) => {
        return item.endsWith('.mp3');
      },
      true
    );
    const sqlTasks = [this.clearAllMusics()];
    // 追加新增任务
    sqlTasks.push(
      ...files.map((file) => {
        return this.insertMusic({ name: file.uri, path: file.uri });
      })
    );
    // 执行
    await Promise.all(sqlTasks);
    Alert.alert('扫描完毕');
  }

  async addMusicList(musicList: MusicInfo[]) {
    await Promise.all(musicList.map((x) => this.insertMusic(x)));
  }

  /**
   * 新增音乐
   * @param musicInfo
   * @returns
   */
  private insertMusic(musicInfo: MusicInfo) {
    const sql = `
    INSERT INTO music(name, path) VALUES(?, ?);
    `;
    return this.db.execute(sql, [musicInfo.name, musicInfo.path]);
  }

  private clearAllMusics() {
    const sql = `
    DELETE FROM music
    WHERE id > 0;
    `;
    return this.db.execute(sql);
  }
}

export const musicService = new MusicService();