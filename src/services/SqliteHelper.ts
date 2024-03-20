import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

export class SqliteHelper {
  private db!: SQLite.SQLiteDatabase;

  constructor() {}

  private openDatabase() {
    return SQLite.openDatabase({
      name: 'musical.db',
    } as any).then(db => {
      this.db = db;
      return this.db;
    });
  }

  private async getDB() {
    if (!this.db) {
      await this.openDatabase();
    }
    return this.db;
  }

  async execute(statement: string, params?: any[]) {
    await this.getDB();
    const resultSet = await this.db.executeSql(statement, params);
    return resultSet[0]?.rows.raw();
  }

  /**
   * 执行 SQL，返回单个值
   * @param statement
   * @param params
   * @returns
   */
  async executeScalar(statement: string, params?: any[]) {
    await this.getDB();
    const resultSet = await this.db.executeSql(statement, params);
    return resultSet[0]?.rows.item(0);
  }

  /**
   * 执行 SQL，返回受影响的行数和主键ID（新增时存在）
   * @param statement
   * @param params
   * @returns
   */
  async executeNonQuery(statement: string, params?: any[]) {
    await this.getDB();
    const resultSet = await this.db.executeSql(statement, params);
    return resultSet[0];
  }
}
