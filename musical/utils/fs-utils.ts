import { readDirectoryAsync, getInfoAsync, FileInfo } from 'expo-file-system';

export async function getFiles(
  dir: string,
  matchFn: (item: string) => boolean,
  deep = false
): Promise<FileInfo[]> {
  try {
    const files: FileInfo[] = [];
    const names = await readDirectoryAsync(dir);
    for (const name of names) {
      const filepath = dir + '/' + name;
      const fileInfo = await getInfoAsync(filepath);
      if (fileInfo.exists && !fileInfo.isDirectory) {
        // 满足条件才要
        if (matchFn(fileInfo.uri)) {
          files.push(fileInfo);
        }
      } else if (deep && fileInfo.isDirectory) {
        const childFiles = await getFiles(fileInfo.uri, matchFn, true);
        files.push(...childFiles);
      }
    }
    return files;
  } catch (ex) {
    return [];
  }
}

// import RNFS from 'react-native-fs';

// export async function getFiles(
//   dir: string,
//   matchFn: (item: RNFS.ReadDirItem) => boolean,
//   deep = false,
// ): Promise<RNFS.ReadDirItem[]> {
//   try {
//     const files: RNFS.ReadDirItem[] = [];
//     const items = await RNFS.readDir(dir);
//     for (const item of items) {
//       if (item.isFile()) {
//         // 满足条件才要
//         if (matchFn(item)) {
//           files.push(item);
//         }
//       } else if (deep && item.isDirectory()) {
//         const childFiles = await getFiles(item.path, matchFn, true);
//         files.push(...childFiles);
//       }
//     }
//     return files;
//   } catch (ex) {
//     return [];
//   }
// }
