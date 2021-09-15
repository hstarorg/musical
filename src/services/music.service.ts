import { Alert, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { MusicInfo } from '../types';
import { fsExtra, nativeUtil } from '../utils';
import { SqliteHelper } from './SqliteHelper';

class MusicService {
  private db: SqliteHelper;
  constructor() {
    this.db = new SqliteHelper();
    this.tryInit().then(result => {
      console.log(result);
    });
  }

  /**
   * 查询音乐列表
   */
  queryMusicList() {
    return this.db.execute('SELECT * FROM music;');
  }

  private async tryInit() {
    const createTableSql = `
    CREATE TABLE IF NOT EXISTS [music] (
      [id] integer COLLATE BINARY NOT NULL PRIMARY KEY AUTOINCREMENT, 
      [name] varchar(200) COLLATE BINARY NOT NULL, 
      [path] varchar(200) COLLATE BINARY NOT NULL
    );
    `;
    return await this.db.execute(createTableSql);
  }

  /**
   * 扫描和存储音乐文件到 Sqlite
   * @returns
   */
  async scanAndStoreLocalMusics() {
    // 申请权限
    const granted = await nativeUtil.requestPermissionAndroid(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (!granted) {
      Alert.alert('您未允许授权');
      return;
    }
    // 允许授权时，先筛选音乐文件，然后写入 DB
    const files = await fsExtra.filterFiles(
      RNFS.ExternalStorageDirectoryPath,
      (item: RNFS.ReadDirItem) => {
        return item.path.endsWith('.mp3');
      },
      true,
    );
    const sqlTasks = [this.clearAllMusics()];
    // 追加新增任务
    sqlTasks.push(
      ...files.map(file => {
        return this.insertMusic({ name: file.name, path: file.path });
      }),
    );
    // 执行
    await Promise.all(sqlTasks);
    Alert.alert('扫描完毕');
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
    return this.db.executeNonQuery(sql, [musicInfo.name, musicInfo.path]);
  }

  private clearAllMusics() {
    const sql = `
    DELETE FROM music
    WHERE id > 0;
    `;
    return this.db.executeNonQuery(sql);
  }
}

export const musicService = new MusicService();
