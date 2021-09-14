import { PermissionsAndroid } from 'react-native';

class NativeUtil {
  /**
   * 申请权限
   * @param permissionName
   * @param opts
   * @returns
   */
  requestPermissionAndroid(
    permissionName: any,
    opts?: { title?: string; message?: string },
  ) {
    return PermissionsAndroid.request(permissionName, {
      title: 'Cool Photo App Camera Permission',
      message:
        'Cool Photo App needs access to your camera ' +
        'so you can take awesome pictures.',
      buttonNeutral: '稍后询问',
      buttonNegative: '取消',
      buttonPositive: '确认',
    }).then(value => {
      return value === PermissionsAndroid.RESULTS.GRANTED;
    });
  }
}

export const nativeUtil = new NativeUtil();
