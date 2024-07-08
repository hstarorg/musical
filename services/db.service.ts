import * as SQLite from 'expo-sqlite';

export class DbService {
  private db: SQLite.SQLiteDatabase;
  constructor(databaseName: string) {
    this.db = SQLite.openDatabaseSync(databaseName);
  }

  async findOne<T>(
    sql: string,
    params?: SQLite.SQLiteBindParams,
  ): Promise<T | null> {
    return this.db.getFirstAsync(sql, params || {});
  }

  async find<T>(sql: string, params?: SQLite.SQLiteBindParams): Promise<T[]> {
    return this.db.getAllAsync<T>(sql, params || {});
  }

  async execute(sql: string, params?: SQLite.SQLiteBindParams) {
    return this.db.runAsync(sql, params || {});
  }
}
