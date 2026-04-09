import { Linking, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Helper for opening a give URL in an external browser.
 */
export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

export async function requestPermissionAndroid(permissionName: any) {
  return PermissionsAndroid.request(permissionName, {
    title: 'Cool Photo App Camera Permission',
    message:
      'Cool Photo App needs access to your camera ' +
      'so you can take awesome pictures.',
    buttonNeutral: '稍后询问',
    buttonNegative: '取消',
    buttonPositive: '确认',
  }).then((value) => {
    return value === PermissionsAndroid.RESULTS.GRANTED;
  });
}

export const asyncStorage = {
  async setData(
    key: string,
    value: unknown,
    options: { expires?: number } = {}
  ) {
    const cacheItem = {
      data: value,
      expires: options.expires ? Date.now() + options.expires : 0,
      $from: 'asyncStorage',
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    return true;
  },

  async getData(key: string) {
    try {
      const cacheItem = await AsyncStorage.getItem(key);
      const cacheObj = JSON.parse(cacheItem || '');
      if (cacheObj.$from !== 'asyncStorage') {
        return null;
      }
      // expired
      if (cacheObj.expires > 0 && cacheObj.expires < Date.now()) {
        // remove item, but not blocking code
        AsyncStorage.removeItem(key);
        return null;
      }
      return cacheObj.data;
    } catch (e) {
      return null;
    }
  },
};
