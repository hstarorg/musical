import RNFS from 'react-native-fs';

class FsExtra {
  filterFiles = async (
    rootDir: string,
    fileMatch: (readDirItem: RNFS.ReadDirItem) => boolean,
    deep: boolean,
  ) => {
    try {
      const files: RNFS.ReadDirItem[] = [];
      const items = await RNFS.readDir(rootDir);
      for (let item of items) {
        if (item.isFile()) {
          // 满足条件才要
          if (fileMatch(item)) {
            files.push(item);
          }
        } else if (deep && item.isDirectory()) {
          const childFiles = await this.filterFiles(item.path, fileMatch, true);
          files.push(...childFiles);
        }
      }
      return files;
    } catch (ex) {
      return [];
    }
  };
}

export const fsExtra = new FsExtra();
