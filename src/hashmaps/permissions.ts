import { PERMISSIONS } from 'react-native-permissions';

type androidHash = {
  [key: string]:
    | 'android.permission.READ_EXTERNAL_STORAGE'
    | 'android.permission.CAMERA';
};

type iosHash = {
  [key: string]: 'ios.permission.PHOTO_LIBRARY' | 'ios.permission.CAMERA';
};

export const permissionsAndroid: androidHash = {
  gallery: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  camera: PERMISSIONS.ANDROID.CAMERA,
};

export const permissionsIos: iosHash = {
  gallery: PERMISSIONS.IOS.PHOTO_LIBRARY,
  camera: PERMISSIONS.IOS.CAMERA,
};
